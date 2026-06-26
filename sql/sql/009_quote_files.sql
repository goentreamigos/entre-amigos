-- =============================================
-- 009_quote_files.sql
-- Allow vendors to attach files (PDFs, etc.) to quotes
-- =============================================

create table public.quote_files (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references public.quotes(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_path text not null,         -- path in Supabase Storage
  file_size bigint,                -- bytes
  mime_type text,
  created_at timestamp with time zone default now()
);

create index quote_files_quote_idx on public.quote_files(quote_id);

alter table public.quote_files enable row level security;

-- Same access pattern as quote_items: anyone who can see the parent quote can see/manage files
create policy "Quote files follow quote — read"
  on public.quote_files for select
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_files.quote_id
        and (q.vendor_id = auth.uid() or q.customer_id = auth.uid()
          or public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'))
    )
  );

create policy "Quote files follow quote — write"
  on public.quote_files for all
  using (
    exists (
      select 1 from public.quotes q
      where q.id = quote_files.quote_id
        and (q.vendor_id = auth.uid()
          or public.get_user_role(auth.uid()) in ('owner', 'manager', 'employee'))
    )
  );
