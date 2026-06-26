-- =============================================
-- 005_leads.sql
-- Leads table + round-robin assignment function
-- =============================================

-- Leads table — one row per customer inquiry
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id),
  -- Intake info (manual for now; bot will fill these later)
  customer_name text,
  customer_phone text,
  details text,
  -- Assignment
  assigned_vendor_id uuid references public.profiles(id),
  assigned_at timestamp with time zone,
  -- Status: new (just created), assigned (vendor matched), claimed (vendor accepted),
  -- quoted (vendor sent a quote), completed (job done), expired (no response)
  status text not null default 'new',
  created_at timestamp with time zone default now(),
  constraint valid_lead_status check (status in ('new', 'assigned', 'claimed', 'quoted', 'completed', 'expired', 'broadcast'))
);

-- Index to speed up vendor lookups
create index leads_assigned_vendor_idx on public.leads(assigned_vendor_id);
create index leads_status_idx on public.leads(status);

-- Track which vendor was last assigned per category (for round-robin)
create table public.category_rotation (
  category_id uuid references public.categories(id) primary key,
  last_vendor_id uuid references public.profiles(id),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.leads enable row level security;
alter table public.category_rotation enable row level security;

-- Customers can read their own leads
create policy "Customers read own leads"
  on public.leads for select
  using (auth.uid() = customer_id);

-- Customers can create their own leads
create policy "Customers create own leads"
  on public.leads for insert
  with check (auth.uid() = customer_id);

-- Vendors can read leads assigned to them
create policy "Vendors read assigned leads"
  on public.leads for select
  using (auth.uid() = assigned_vendor_id);

-- Vendors can update leads assigned to them (to claim, quote, complete)
create policy "Vendors update assigned leads"
  on public.leads for update
  using (auth.uid() = assigned_vendor_id);

-- Admins can do everything with leads
create policy "Admins manage leads"
  on public.leads for all
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

-- Admins can manage category_rotation (used internally)
create policy "Admins manage rotation"
  on public.category_rotation for all
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

-- Anyone authenticated can read rotation (needed by the assignment function)
create policy "Authenticated read rotation"
  on public.category_rotation for select
  using (auth.role() = 'authenticated');

-- =============================================
-- Round-robin assignment function
-- Picks the next approved vendor for a given category
-- Returns the vendor_id (or null if no vendors approved)
-- =============================================
create or replace function public.assign_next_vendor(p_category_id uuid)
returns uuid as $$
declare
  approved_vendors uuid[];
  last_vendor uuid;
  next_vendor uuid;
  last_index int;
begin
  -- Get all approved vendors for this category, sorted by id for consistency
  select array_agg(vendor_id order by vendor_id) into approved_vendors
  from public.vendor_categories
  where category_id = p_category_id and status = 'approved';

  -- No approved vendors? Return null
  if approved_vendors is null or array_length(approved_vendors, 1) = 0 then
    return null;
  end if;

  -- Look up last-assigned vendor for this category
  select last_vendor_id into last_vendor
  from public.category_rotation
  where category_id = p_category_id;

  -- If no rotation record yet, pick the first vendor
  if last_vendor is null then
    next_vendor := approved_vendors[1];
  else
    -- Find where the last vendor was in the array
    last_index := array_position(approved_vendors, last_vendor);
    if last_index is null or last_index >= array_length(approved_vendors, 1) then
      -- Wasn't in list (maybe revoked), or was last — wrap around
      next_vendor := approved_vendors[1];
    else
      next_vendor := approved_vendors[last_index + 1];
    end if;
  end if;

  -- Update rotation tracker (upsert)
  insert into public.category_rotation (category_id, last_vendor_id, updated_at)
  values (p_category_id, next_vendor, now())
  on conflict (category_id) do update
    set last_vendor_id = excluded.last_vendor_id, updated_at = now();

  return next_vendor;
end;
$$ language plpgsql security definer;
