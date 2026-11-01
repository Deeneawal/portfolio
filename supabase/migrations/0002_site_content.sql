-- Owner-editable portfolio content (profile, numbers, story copy, résumé link).
-- Same model as analytics: RLS on, zero policies, no grants to public roles.
-- Only the server (service role) reads and writes it; pages are regenerated on save.

create table if not exists public.site_content (
  key        text primary key check (key ~ '^[a-z0-9_-]{1,40}$'),
  value      jsonb not null default '{}'::jsonb check (pg_column_size(value) < 200000),
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated, public;
grant select, insert, update, delete on table public.site_content to service_role;

-- Public bucket for the downloadable résumé. Writes still require the service role.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];
