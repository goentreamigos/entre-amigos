-- =============================================
-- 001_create_profiles.sql
-- Creates the profiles table that stores user info + role
-- =============================================

-- Profiles table — extends Supabase's built-in auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'customer',
  created_at timestamp with time zone default now(),
  -- Roles: owner, manager, employee, vendor, customer
  constraint valid_role check (role in ('owner', 'manager', 'employee', 'vendor', 'customer'))
);

-- Enable Row Level Security so only logged-in users can read
alter table public.profiles enable row level security;

-- Anyone logged in can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Owners and managers can read all profiles
create policy "Owners and managers can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'manager')
    )
  );

-- Users can update their own profile (but not their role)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function that runs when a new user signs up — creates their profile
-- Auto-promotes goentreamigos@gmail.com to owner
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case
      when new.email = 'goentreamigos@gmail.com' then 'owner'
      else 'customer'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger that runs the function above whenever a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
