-- Private, first-party analytics for the portfolio.
-- Security model: RLS is enabled with ZERO policies and every privilege is revoked
-- from anon/authenticated, so the public API keys can neither read nor write.
-- Only the service role (server-side, never shipped to browsers) can touch this data.
-- All functions are SECURITY INVOKER: they run with the caller's rights, so even if
-- an EXECUTE grant were forgotten, anon would still hit RLS and see nothing.

create table if not exists public.events (
  id            bigint generated always as identity primary key,
  ts            timestamptz not null default now(),
  type          text not null check (type in ('pageview', 'resume_download', 'contact_click', 'outbound', 'engagement')),
  path          text not null check (length(path) <= 300),
  story_slug    text check (length(story_slug) <= 80),
  target        text check (length(target) <= 200),
  referrer_host text check (length(referrer_host) <= 200),
  utm_source    text check (length(utm_source) <= 100),
  utm_medium    text check (length(utm_medium) <= 100),
  utm_campaign  text check (length(utm_campaign) <= 100),
  utm_term      text check (length(utm_term) <= 100),
  utm_content   text check (length(utm_content) <= 100),
  country       text check (country ~ '^[A-Z]{2}$'),
  region        text check (length(region) <= 80),
  city          text check (length(city) <= 80),
  device        text check (device in ('desktop', 'mobile', 'tablet')),
  browser       text check (length(browser) <= 40),
  os            text check (length(os) <= 40),
  likely_human  boolean,
  visitor_hash  text not null check (visitor_hash ~ '^[0-9a-f]{32}$'),
  session_id    uuid,
  engaged_ms    integer check (engaged_ms between 0 and 3600000)
);

create index if not exists events_ts_idx on public.events (ts desc);
create index if not exists events_type_ts_idx on public.events (type, ts desc);
create index if not exists events_story_ts_idx on public.events (story_slug, ts desc) where story_slug is not null;

create table if not exists public.login_attempts (
  id      bigint generated always as identity primary key,
  ts      timestamptz not null default now(),
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{32}$')
);
create index if not exists login_attempts_ip_ts_idx on public.login_attempts (ip_hash, ts desc);

alter table public.events enable row level security;
alter table public.login_attempts enable row level security;

revoke all on table public.events, public.login_attempts from anon, authenticated, public;
revoke all on sequence public.events_id_seq, public.login_attempts_id_seq from anon, authenticated, public;
grant select, insert, delete on table public.events, public.login_attempts to service_role;
grant usage on sequence public.events_id_seq, public.login_attempts_id_seq to service_role;

-- Keep-alive probe for the daily cron.
create or replace function public.analytics_ping()
returns integer
language sql stable security invoker set search_path = ''
as $$ select 1 $$;

-- Headline numbers. Day boundaries are IST (the owner's timezone).
-- visitor_hash rotates daily, so distinct hashes over N days are "visitor-days".
create or replace function public.analytics_summary()
returns jsonb
language sql stable security invoker set search_path = ''
as $$
  with b as (select (now() at time zone 'Asia/Kolkata')::date as t),
  e as (
    select type, visitor_hash, story_slug, session_id, engaged_ms, likely_human,
           (ts at time zone 'Asia/Kolkata')::date as d
    from public.events
  )
  select jsonb_build_object(
    'views_all',        count(*) filter (where type = 'pageview'),
    'views_today',      count(*) filter (where type = 'pageview' and d = b.t),
    'views_7d',         count(*) filter (where type = 'pageview' and d > b.t - 7),
    'views_30d',        count(*) filter (where type = 'pageview' and d > b.t - 30),
    'visitors_today',   count(distinct visitor_hash) filter (where type = 'pageview' and d = b.t),
    'visitor_days_7d',  count(distinct visitor_hash) filter (where type = 'pageview' and d > b.t - 7),
    'visitor_days_30d', count(distinct visitor_hash) filter (where type = 'pageview' and d > b.t - 30),
    'visitor_days_all', count(distinct visitor_hash) filter (where type = 'pageview'),
    'resume_all',       count(*) filter (where type = 'resume_download'),
    'resume_30d',       count(*) filter (where type = 'resume_download' and d > b.t - 30),
    'resume_human_all', count(*) filter (where type = 'resume_download' and coalesce(likely_human, false)),
    'story_views_30d',  count(*) filter (where type = 'pageview' and story_slug is not null and d > b.t - 30),
    'contacts_30d',     count(*) filter (where type = 'contact_click' and d > b.t - 30),
    'sessions_30d',     count(distinct session_id) filter (where type = 'pageview' and d > b.t - 30),
    'engaged_s_30d',    coalesce(sum(engaged_ms) filter (where type = 'engagement' and d > b.t - 30), 0) / 1000
  )
  from e
  cross join b
$$;

-- Daily series for the last p_days days (IST), zero-filled.
create or replace function public.analytics_daily(p_days integer default 30)
returns table (day date, views bigint, visitors bigint, story_views bigint, resumes bigint)
language sql stable security invoker set search_path = ''
as $$
  with days as (
    select generate_series(
      (now() at time zone 'Asia/Kolkata')::date - (least(greatest(p_days, 1), 365) - 1),
      (now() at time zone 'Asia/Kolkata')::date,
      interval '1 day'
    )::date as day
  ),
  e as (
    select type, visitor_hash, story_slug, (ts at time zone 'Asia/Kolkata')::date as d
    from public.events
    where ts >= now() - make_interval(days => least(greatest(p_days, 1), 365) + 1)
  )
  select days.day,
         count(e.*) filter (where e.type = 'pageview'),
         count(distinct e.visitor_hash) filter (where e.type = 'pageview'),
         count(e.*) filter (where e.type = 'pageview' and e.story_slug is not null),
         count(e.*) filter (where e.type = 'resume_download')
  from days
  left join e on e.d = days.day
  group by days.day
  order by days.day
$$;

-- Top-N breakdowns. p_dim is matched with CASE, never interpolated into SQL.
create or replace function public.analytics_top(p_dim text, p_days integer default 30, p_limit integer default 8)
returns table (key text, n bigint)
language sql stable security invoker set search_path = ''
as $$
  select k as key, count(*) as n
  from (
    select case p_dim
             when 'story'    then case when type = 'pageview' then story_slug end
             when 'referrer' then case when type = 'pageview' then referrer_host end
             when 'country'  then case when type = 'pageview' then country end
             when 'city'     then case when type = 'pageview' and city is not null then city || coalesce(', ' || country, '') end
             when 'device'   then case when type = 'pageview' then device end
             when 'browser'  then case when type = 'pageview' then browser end
             when 'os'       then case when type = 'pageview' then os end
             when 'utm'      then case when type = 'pageview' then utm_source end
             when 'contact'  then case when type = 'contact_click' then target end
             when 'outbound' then case when type = 'outbound' then target end
           end as k
    from public.events
    where ts >= now() - make_interval(days => least(greatest(p_days, 1), 3650))
  ) x
  where k is not null
  group by k
  order by n desc, key
  limit least(greatest(p_limit, 1), 50)
$$;

-- Most recent events for the activity feed (no hashes or session ids exposed).
create or replace function public.analytics_recent(p_limit integer default 40)
returns table (ts timestamptz, type text, path text, story_slug text, target text, referrer_host text,
               country text, city text, device text, browser text, os text)
language sql stable security invoker set search_path = ''
as $$
  select ts, type, path, story_slug, target, referrer_host, country, city, device, browser, os
  from public.events
  where type <> 'engagement'
  order by ts desc
  limit least(greatest(p_limit, 1), 200)
$$;

-- Login throttle: records the attempt and returns true while the IP is under 5 attempts per 15 minutes.
create or replace function public.login_gate(p_ip_hash text)
returns boolean
language plpgsql volatile security invoker set search_path = ''
as $$
declare
  recent integer;
begin
  delete from public.login_attempts where ts < now() - interval '1 day';
  select count(*) into recent from public.login_attempts
   where ip_hash = p_ip_hash and ts > now() - interval '15 minutes';
  insert into public.login_attempts (ip_hash) values (p_ip_hash);
  return recent < 5;
end;
$$;

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.analytics_ping()',
    'public.analytics_summary()',
    'public.analytics_daily(integer)',
    'public.analytics_top(text, integer, integer)',
    'public.analytics_recent(integer)',
    'public.login_gate(text)'
  ] loop
    execute format('revoke execute on function %s from public, anon, authenticated', fn);
    execute format('grant execute on function %s to service_role', fn);
  end loop;
end $$;
