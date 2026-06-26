-- =============================================
-- 006_lead_timer_broadcast.sql
-- Adds urgency flag, claim deadline, auto-broadcast cron job,
-- and broadcast-claim logic
-- =============================================

-- Add new columns to leads table
alter table public.leads add column if not exists urgent boolean default false;
alter table public.leads add column if not exists claim_deadline timestamp with time zone;
alter table public.leads add column if not exists broadcast_at timestamp with time zone;
alter table public.leads add column if not exists original_vendor_id uuid references public.profiles(id);

-- Track missed leads (vendors who didn't claim in time)
create table if not exists public.missed_leads (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  missed_at timestamp with time zone default now()
);

alter table public.missed_leads enable row level security;

-- Vendors can see their own misses (for transparency)
create policy "Vendors read own missed"
  on public.missed_leads for select
  using (auth.uid() = vendor_id);

-- Admins can see all missed leads
create policy "Admins read missed"
  on public.missed_leads for select
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

-- Allow inserts from the trigger function (security definer bypasses RLS)
create policy "System inserts missed"
  on public.missed_leads for insert
  with check (true);

-- =============================================
-- Update the lead creation flow:
-- When a lead is inserted, set claim_deadline based on urgency
-- Urgent: 30 min, Normal: 60 min
-- =============================================
create or replace function public.set_claim_deadline()
returns trigger as $$
begin
  if new.assigned_vendor_id is not null and new.claim_deadline is null then
    new.claim_deadline := now() + case
      when new.urgent then interval '30 minutes'
      else interval '60 minutes'
    end;
    new.original_vendor_id := new.assigned_vendor_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_claim_deadline on public.leads;
create trigger trg_set_claim_deadline
  before insert on public.leads
  for each row execute function public.set_claim_deadline();

-- =============================================
-- The broadcast function: finds assigned leads past deadline,
-- moves them to 'broadcast' status, logs the miss
-- =============================================
create or replace function public.broadcast_expired_leads()
returns void as $$
declare
  expired_lead record;
begin
  for expired_lead in
    select * from public.leads
    where status = 'assigned'
      and claim_deadline < now()
  loop
    -- Log the miss against the original vendor
    insert into public.missed_leads (vendor_id, lead_id)
    values (expired_lead.assigned_vendor_id, expired_lead.id);

    -- Mark lead as broadcast (assigned_vendor_id cleared so anyone can claim)
    update public.leads
    set status = 'broadcast',
        assigned_vendor_id = null,
        broadcast_at = now()
    where id = expired_lead.id;
  end loop;
end;
$$ language plpgsql security definer;

-- =============================================
-- Schedule the broadcast check to run every minute
-- =============================================
select cron.schedule(
  'broadcast-expired-leads',
  '* * * * *',  -- every minute
  $$ select public.broadcast_expired_leads(); $$
);

-- =============================================
-- Allow vendors to see broadcast leads in their approved categories
-- =============================================
create policy "Vendors read broadcast leads in their categories"
  on public.leads for select
  using (
    status = 'broadcast'
    and exists (
      select 1 from public.vendor_categories vc
      where vc.vendor_id = auth.uid()
        and vc.category_id = leads.category_id
        and vc.status = 'approved'
    )
  );

-- =============================================
-- Allow vendors to claim broadcast leads (first-to-update wins)
-- This uses a special function that locks the row to prevent races
-- =============================================
create or replace function public.claim_broadcast_lead(p_lead_id uuid)
returns boolean as $$
declare
  v_lead record;
  v_is_approved boolean;
begin
  -- Lock the lead row
  select * into v_lead from public.leads where id = p_lead_id for update;

  -- Must be a broadcast lead
  if v_lead.status != 'broadcast' then
    return false;
  end if;

  -- Vendor must be approved for this category
  select exists(
    select 1 from public.vendor_categories
    where vendor_id = auth.uid()
      and category_id = v_lead.category_id
      and status = 'approved'
  ) into v_is_approved;

  if not v_is_approved then
    return false;
  end if;

  -- Claim it
  update public.leads
  set status = 'claimed',
      assigned_vendor_id = auth.uid(),
      assigned_at = now()
  where id = p_lead_id;

  return true;
end;
$$ language plpgsql security definer;
