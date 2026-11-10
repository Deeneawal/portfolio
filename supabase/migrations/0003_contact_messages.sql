-- Messages sent through the contact form, kept so the owner can read them in /admin/messages.
-- Same model as analytics: RLS on, zero policies, no grants to public roles.
-- Only the server (service role) reads and writes it. Until this is applied, messages are kept
-- as private JSON files in the "analytics" storage bucket and still show in the dashboard.

create table if not exists public.contact_messages (
  id         text primary key check (id ~ '^[0-9]{13}-[a-f0-9]{8}$'),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 80),
  email      text not null check (char_length(email) between 3 and 200),
  company    text not null default '' check (char_length(company) <= 120),
  message    text not null check (char_length(message) between 1 and 3000),
  page       text check (page is null or char_length(page) <= 120),
  country    text check (country is null or char_length(country) <= 2),
  city       text check (city is null or char_length(city) <= 80),
  email_sent boolean not null default false,
  read       boolean not null default false
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;
revoke all on table public.contact_messages from anon, authenticated, public;
grant select, insert, update, delete on table public.contact_messages to service_role;
