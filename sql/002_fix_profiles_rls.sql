-- =============================================
-- 002_fix_profiles_rls.sql
-- Fixes infinite recursion in Row Level Security policies
-- =============================================

-- Drop the old policies that cause recursion
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Owners and managers can read all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Create a helper function that safely checks role
-- Using SECURITY DEFINER bypasses RLS so it doesn't recurse
create or replace function public.get_user_role(user_id uuid)
returns text as $$
  select role from public.profiles where id = user_id;
$$ language sql security definer stable;

-- New policy: anyone logged in can read their own profile
create policy "Read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- New policy: admins (owner/manager/employee) can read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

-- Users can update their own profile
create policy "Update own profile"
  on public.profiles for update
  using (auth.uid() = id);
