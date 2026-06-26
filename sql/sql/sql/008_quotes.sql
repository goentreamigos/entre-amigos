-- =============================================
-- 008_quotes.sql
-- Vendor quotes with line items
-- Multiple quotes allowed per vendor per lead (revisions)
-- =============================================

create table public.quotes (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads(id) on delete cascade,
  vendor_id uuid references public.profiles(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete cascade,
  total numeric(10, 2) not null default 0,
  notes text,
  valid_until timestamp with time zone,
  -- Status: draft (not sent), sent (customer sees it), accepted, declined, expired, superseded (vendor sent newer)
  status text not null default 'sent',
  created_at timestamp with time zone default now(),
  responded_at timestamp with time zone,
  constraint valid_quote_status check (status in ('draft', 'sent', 'accepted', 'declined', 'expired', 'superseded'))
);

create index quotes_lead_idx on public.quotes(lead_id);
create index quotes_vendor_idx on public.quotes(vendor_id);
create index quotes_customer_idx on public.quotes(customer_id);
create index quotes_status_idx on public.quotes(status);

-- Line items belonging to a quote
create table public.quote_items (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references public.quotes(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(10, 2) not null default 0,
  -- line_total is computed by app, but stored for easy display
  line_total numeric(10, 2) not null default 0,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

create index quote_items_quote_idx on public.quote_items(quote_id);

-- Enable RLS
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

-- Vendors can read/create/update their own quotes
create policy "Vendors manage own quotes"
  on public.quotes for all
  using (auth.uid() = vendor_id);

-- Customers can read quotes sent to them
create policy "Customers read own quotes"
  on public.quotes for select
  using (auth.uid() = customer_id);

-- Customers can update (accept/decline) their own quotes
create policy "Customers respond to quotes"
  on public.quotes for update
  using (auth.uid() = customer_id);

-- Admins can do everything with quotes
create policy "Admins manage quotes"
  on public.quotes for all
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

-- Quote items follow the parent quote's permissions
create policy "Quote items follow quote — read"
  on public.quote_items for select
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_items.quote_id
        and (q.vendor_id = auth.uid() or q.customer_id = auth.uid()
          or public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'))
    )
  );

create policy "Quote items follow quote — write"
  on public.quote_items for all
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_items.quote_id
        and (q.vendor_id = auth.uid()
          or public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'))
    )
  );

-- =============================================
-- When a vendor sends a new quote, mark any previous ones as 'superseded'
-- (so customer only sees the latest)
-- =============================================
create or replace function public.supersede_old_quotes()
returns trigger as $$
begin
  -- Only run on new 'sent' quotes
  if new.status = 'sent' then
    update public.quotes
    set status = 'superseded'
    where lead_id = new.lead_id
      and vendor_id = new.vendor_id
      and id != new.id
      and status = 'sent';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_supersede_quotes on public.quotes;
create trigger trg_supersede_quotes
  after insert on public.quotes
  for each row execute function public.supersede_old_quotes();
