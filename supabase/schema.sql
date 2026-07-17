create table if not exists public.kgm_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text not null,
  request_for text,
  person_age integer,
  primary_need text,
  lives_alone text,
  mobility_difficulty text,
  caregiver_present text,
  medical_order text,
  message text not null,
  page_path text,
  user_agent text,
  ip_hint text
);

create table if not exists public.kgm_chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text,
  page_path text,
  message text not null,
  answer text not null,
  history jsonb,
  site text
);

alter table public.kgm_leads enable row level security;
alter table public.kgm_chat_messages enable row level security;

drop policy if exists "service role manages kgm leads" on public.kgm_leads;
create policy "service role manages kgm leads"
  on public.kgm_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role manages kgm chat messages" on public.kgm_chat_messages;
create policy "service role manages kgm chat messages"
  on public.kgm_chat_messages
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
