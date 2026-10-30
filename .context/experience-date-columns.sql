-- Run in the Supabase SQL editor before publishing structured experience dates.
-- Existing period values remain intact and are parsed by the frontend until edited.
begin;
alter table public.experiences
  add column if not exists start_month text,
  add column if not exists start_year integer,
  add column if not exists end_month text,
  add column if not exists end_year integer,
  add column if not exists is_current boolean not null default false;
commit;

-- Read-only verification after applying:
select start_month, start_year, end_month, end_year, is_current
from public.experiences limit 1;
