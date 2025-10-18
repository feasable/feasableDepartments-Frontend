-- lunoSpaces schema (PostgreSQL/Supabase)
-- Safe to run in a fresh project; review and adjust for existing data.

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Helper: membership check
create or replace function is_member(biz uuid, uid uuid)
returns boolean
language sql stable as $$
  select exists (
    select 1 from public.business_members m
    where m.business_id = biz and m.user_id = uid and m.status = 'active'
  );
$$;

-- ENUMs
do $$ begin
  create type task_status as enum ('queued','in_progress','completed','failed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_role as enum ('owner','admin','member','viewer');
exception when duplicate_object then null; end $$;

-- Profile (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text generated always as (nullif((auth.jwt() ->> 'email')::text, '')) stored,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Businesses (workspaces)
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  industry text,
  company_size text,
  website text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memberships
create table if not exists public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

-- Invitations
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  email text not null,
  role member_role not null default 'member',
  token text not null unique,
  invited_by uuid not null references auth.users(id) on delete set null,
  status text not null default 'pending', -- pending, accepted, revoked, expired
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete set null,
  title text not null,
  description text,
  department text,
  priority text default 'normal',
  status task_status not null default 'queued',
  due_date date,
  metadata jsonb default '{}'::jsonb,
  result jsonb,
  external_ref text, -- id on backend/queue if any
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Agents (per business)
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  department text,
  description text,
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Agent runs / executions
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  status text not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  input jsonb,
  output jsonb,
  logs jsonb,
  created_at timestamptz not null default now()
);

-- Flows (multi-agent orchestrations)
create table if not exists public.flows (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  graph jsonb not null, -- nodes/edges
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Integrations
create table if not exists public.integration_accounts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  provider text not null, -- google, github, notion, slack, etc
  label text,
  credentials jsonb not null, -- encrypted or external reference
  created_at timestamptz not null default now()
);

-- Audit log
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  context jsonb,
  created_at timestamptz not null default now()
);

-- Feature flags / settings
create table if not exists public.remote_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Basic RLS policies
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.invitations enable row level security;
alter table public.tasks enable row level security;
alter table public.agents enable row level security;
alter table public.agent_runs enable row level security;
alter table public.flows enable row level security;
alter table public.integration_accounts enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: users can see/update their row
create policy if not exists profiles_select_self on public.profiles
for select using (id = auth.uid());
create policy if not exists profiles_update_self on public.profiles
for update using (id = auth.uid());

-- Businesses: members can select; owners can update/delete; any authed can insert
create policy if not exists businesses_insert_any on public.businesses
for insert with check (auth.uid() is not null);
create policy if not exists businesses_select_members on public.businesses
for select using (is_member(id, auth.uid()) or owner_id = auth.uid());
create policy if not exists businesses_update_owner on public.businesses
for update using (owner_id = auth.uid());
create policy if not exists businesses_delete_owner on public.businesses
for delete using (owner_id = auth.uid());

-- Members: visible to members; insert/update by owner/admin
create policy if not exists members_select_members on public.business_members
for select using (is_member(business_id, auth.uid()) or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy if not exists members_insert_owner_admin on public.business_members
for insert with check (
  exists(
    select 1 from public.business_members m
    where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin')
  ) or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);
create policy if not exists members_update_owner_admin on public.business_members
for update using (
  exists(
    select 1 from public.business_members m
    where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin')
  ) or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

-- Invitations: owner/admin can manage; invited user can read by email via backend only (expose via RPC)
create policy if not exists invitations_select_members on public.invitations
for select using (
  exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.status = 'active')
  or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);
create policy if not exists invitations_insert_owner_admin on public.invitations
for insert with check (
  exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
  or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);
create policy if not exists invitations_update_owner_admin on public.invitations
for update using (
  exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
  or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

-- Tasks: members can CRUD within their business
create policy if not exists tasks_crud_members on public.tasks
for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));

-- Agents/Flows/Runs/Integrations/Audit: members visibility and insert/update for members
create policy if not exists agents_crud_members on public.agents
for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
create policy if not exists flows_crud_members on public.flows
for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
create policy if not exists agent_runs_select_members on public.agent_runs
for select using (
  exists(select 1 from public.agents a join public.business_members m on m.business_id = a.business_id where a.id = agent_runs.agent_id and m.user_id = auth.uid())
);
create policy if not exists agent_runs_insert_members on public.agent_runs
for insert with check (
  exists(select 1 from public.agents a join public.business_members m on m.business_id = a.business_id where a.id = agent_id and m.user_id = auth.uid())
);
create policy if not exists integration_accounts_crud_members on public.integration_accounts
for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
create policy if not exists audit_logs_select_members on public.audit_logs
for select using (is_member(business_id, auth.uid()));

-- Useful indexes
create index if not exists idx_members_user on public.business_members(user_id);
create index if not exists idx_tasks_business_status on public.tasks(business_id, status);
create index if not exists idx_invites_token on public.invitations(token);
