-- =============================================
-- 004_vendor_categories.sql
-- Categories master list + vendor category requests
-- =============================================

-- Master list of service categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  icon text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Seed initial categories (matches our app tiles)
insert into public.categories (key, icon) values
  ('insurance', '🛡️'),
  ('doctor', '🩺'),
  ('buyHome', '🏠'),
  ('renting', '🏢'),
  ('mechanic', '🔧'),
  ('legal', '⚖️'),
  ('banking', '🏦'),
  ('education', '🎓');

-- Vendor → category mapping (requested or approved)
create table public.vendor_categories (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  status text not null default 'pending', -- pending, approved, denied
  requested_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid references auth.users(id),
  notes text,
  unique(vendor_id, category_id),
  constraint valid_status check (status in ('pending', 'approved', 'denied'))
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.vendor_categories enable row level security;

-- Anyone logged in can read categories (everyone needs the list)
create policy "Anyone reads categories"
  on public.categories for select
  using (auth.role() = 'authenticated');

-- Vendors can read their own category requests
create policy "Vendors read own categories"
  on public.vendor_categories for select
  using (auth.uid() = vendor_id);

-- Vendors can create their own requests
create policy "Vendors request categories"
  on public.vendor_categories for insert
  with check (auth.uid() = vendor_id);

-- Vendors can delete their own pending requests (cancel)
create policy "Vendors cancel own requests"
  on public.vendor_categories for delete
  using (auth.uid() = vendor_id and status = 'pending');

-- Admins can do everything with vendor_categories
create policy "Admins manage vendor_categories"
  on public.vendor_categories for all
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));
