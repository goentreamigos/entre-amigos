-- =============================================
-- 003_create_invites.sql
-- Creates the invites table for invite-only signup
-- =============================================

create table public.invites (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  role text not null,
  invited_email text,
  invited_by uuid references auth.users(id),
  used boolean default false,
  used_by uuid references auth.users(id),
  used_at timestamp with time zone,
  expires_at timestamp with time zone default (now() + interval '14 days'),
  created_at timestamp with time zone default now(),
  constraint valid_invite_role check (role in ('owner', 'manager', 'employee', 'vendor', 'customer'))
);

alter table public.invites enable row level security;

create policy "Admins manage invites"
  on public.invites for all
  using (public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'));

create policy "Public can read invite by code"
  on public.invites for select
  using (true);

create or replace function public.handle_new_user()
returns trigger as $$
declare
  invite_code text;
  invite_record record;
  assigned_role text;
begin
  invite_code := new.raw_user_meta_data->>'invite_code';

  if new.email = 'goentreamigos@gmail.com' then
    assigned_role := 'owner';
  else
    assigned_role := 'customer';
  end if;

  if invite_code is not null then
    select * into invite_record from public.invites
      where code = invite_code and used = false and expires_at > now()
      limit 1;
    if found then
      assigned_role := invite_record.role;
      update public.invites
        set used = true, used_by = new.id, used_at = now()
        where id = invite_record.id;
    end if;
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    assigned_role
  );
  return new;
end;
$$ language plpgsql security definer;
