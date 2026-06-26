-- =============================================
-- 007_reviews.sql
-- Customer reviews of vendors with admin moderation
-- =============================================

create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads(id) on delete cascade,
  vendor_id uuid references public.profiles(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete cascade,
  rating int not null,
  comment text,
  status text not null default 'pending',
  reviewed_at timestamp with time zone,
  reviewed_by uuid references auth.users(id),
  admin_notes text,
  created_at timestamp with time zone default now(),
  constraint valid_rating check (rating >= 1 and rating <= 5),
  constraint valid_review_status check (status in ('pending', 'approved', 'rejected')),
  unique(lead_id)
);

create index reviews_vendor_idx on public.reviews(vendor_id);
create index reviews_status_idx on public.reviews(status);

alter table public.reviews enable row level security;

create policy "Customers read own reviews"
  on public.reviews for select
  using (auth.uid() = customer_id);

create policy "Customers create reviews"
  on public.reviews for insert
  with check (auth.uid() = customer_id);

create policy "Public reads approved reviews"
  on public.reviews for select
  using (status = 'approved');

create policy "Vendors read own pending"
  on public.reviews for select
  using (auth.uid() = vendor_id);

create policy "Admins manage reviews"
  on public.reviews for all
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

-- =============================================
-- Helper function (FIXED: plpgsql instead of sql)
-- =============================================
create or replace function public.get_vendor_stats(p_vendor_id uuid)
returns table (
  avg_rating numeric,
  review_count bigint,
  below_threshold boolean
) as $$
declare
  v_avg numeric;
  v_count bigint;
begin
  select coalesce(round(avg(rating)::numeric, 1), 0), count(*)
  into v_avg, v_count
  from public.reviews
  where vendor_id = p_vendor_id and status = 'approved';

  return query select
    v_avg as avg_rating,
    v_count as review_count,
    (v_count >= 5 and v_avg < 3.5) as below_threshold;
end;
$$ language plpgsql security definer stable;
