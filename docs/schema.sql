-- lunoSpaces schema (PostgreSQL/Supabase)
-- Safe to run in a fresh project; review and adjust for existing data.

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Helper: membership check (defined later after tables are created)

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
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create/maintain profiles on new auth user
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name, full_name, avatar_url)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'first_name')::text, null),
    coalesce((new.raw_user_meta_data->>'last_name')::text, null),
    coalesce((new.raw_user_meta_data->>'full_name')::text, (new.raw_user_meta_data->>'name')::text),
    coalesce((new.raw_user_meta_data->>'avatar_url')::text, null)
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name  = excluded.last_name,
    full_name  = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

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

-- Ensure business owner is also a member (role=owner)
create or replace function public.handle_business_owner_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_members (business_id, user_id, role, status)
  values (new.id, new.owner_id, 'owner', 'active')
  on conflict (business_id, user_id) do update set role = 'owner', status = 'active';
  return new;
end;
$$;

drop trigger if exists on_business_created_add_owner on public.businesses;
create trigger on_business_created_add_owner
after insert on public.businesses
for each row execute function public.handle_business_owner_member();

-- Memberships
create table if not exists public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

-- In case an older table exists without these columns, add them before using is_member()
alter table if exists public.business_members add column if not exists role member_role not null default 'member';
alter table if exists public.business_members add column if not exists status text not null default 'active';
alter table if exists public.business_members add column if not exists created_at timestamptz not null default now();

-- Now that membership table exists, define helper function
create or replace function is_member(biz uuid, uid uuid)
returns boolean
language sql stable as $$
  select exists (
    select 1 from public.business_members m
    where m.business_id = biz and m.user_id = uid and m.status = 'active'
  );
$$;

-- Invitations
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  email text not null,
  role member_role not null default 'member',
  token text not null unique,
  invited_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending', -- pending, accepted, revoked, expired
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
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

-- Extend agent_runs with runtime metrics and diagnostic fields
alter table if exists public.agent_runs add column if not exists current_step text;
alter table if exists public.agent_runs add column if not exists last_error text;
alter table if exists public.agent_runs add column if not exists eta_seconds int;
alter table if exists public.agent_runs add column if not exists cost_cents int;
alter table if exists public.agent_runs add column if not exists tokens_input int;
alter table if exists public.agent_runs add column if not exists tokens_output int;

-- Task events (timeline)
create table if not exists public.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  type text not null, -- status_changed, agent_log, note, system
  message text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Task comments (user notes) with optional attachments as JSON list
create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete set null,
  body text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Task templates per workspace/department
create table if not exists public.task_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  department text,
  title text not null,
  default_payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- User/workspace preferences (server-side persisted UI prefs)
create table if not exists public.user_workspace_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  unique(user_id, business_id, key)
);

-- Notification settings per user/workspace
create table if not exists public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  channel text not null, -- email, slack
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id, business_id, channel)
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
alter table public.task_events enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_templates enable row level security;
alter table public.user_workspace_preferences enable row level security;
alter table public.notification_settings enable row level security;

-- Profiles
do $$ begin
  create policy profiles_select_self on public.profiles
  for select using (id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy profiles_update_self on public.profiles
  for update using (id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy profiles_insert_self on public.profiles
  for insert with check (id = auth.uid());
exception when duplicate_object then null; end $$;

-- Businesses
do $$ begin
  create policy businesses_insert_any on public.businesses
  for insert with check (auth.uid() is not null);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy businesses_select_members on public.businesses
  for select using (is_member(id, auth.uid()) or owner_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy businesses_update_owner on public.businesses
  for update using (owner_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy businesses_delete_owner on public.businesses
  for delete using (owner_id = auth.uid());
exception when duplicate_object then null; end $$;

-- Members
do $$ begin
  create policy members_select_members on public.business_members
  for select using (
    is_member(business_id, auth.uid()) or
    exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy members_insert_owner_admin on public.business_members
  for insert with check (
    exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin')) or
    exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy members_update_owner_admin on public.business_members
  for update using (
    exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin')) or
    exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- Invitations
do $$ begin
  create policy invitations_select_members on public.invitations
  for select using (
    exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.status = 'active') or
    exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy invitations_insert_owner_admin on public.invitations
  for insert with check (
    exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin')) or
    exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy invitations_update_owner_admin on public.invitations
  for update using (
    exists(select 1 from public.business_members m where m.business_id = business_id and m.user_id = auth.uid() and m.role in ('owner','admin')) or
    exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- Tasks
do $$ begin
  create policy tasks_crud_members on public.tasks
  for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

-- Agents/Flows/Runs/Integrations/Audit
do $$ begin
  create policy agents_crud_members on public.agents
  for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy flows_crud_members on public.flows
  for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy agent_runs_select_members on public.agent_runs
  for select using (
    exists(select 1 from public.agents a join public.business_members m on m.business_id = a.business_id where a.id = agent_runs.agent_id and m.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy agent_runs_insert_members on public.agent_runs
  for insert with check (
    exists(select 1 from public.agents a join public.business_members m on m.business_id = a.business_id where a.id = agent_id and m.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- Task events
do $$ begin
  create policy task_events_select_members on public.task_events
  for select using (
    exists(select 1 from public.tasks t join public.business_members m on m.business_id = t.business_id where t.id = task_id and m.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy task_events_insert_members on public.task_events
  for insert with check (
    exists(select 1 from public.tasks t join public.business_members m on m.business_id = t.business_id where t.id = task_id and m.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- Task comments
do $$ begin
  create policy task_comments_select_members on public.task_comments
  for select using (
    exists(select 1 from public.tasks t join public.business_members m on m.business_id = t.business_id where t.id = task_id and m.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy task_comments_insert_members on public.task_comments
  for insert with check (
    user_id = auth.uid() and exists(select 1 from public.tasks t join public.business_members m on m.business_id = t.business_id where t.id = task_id and m.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy task_comments_update_author on public.task_comments
  for update using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy task_comments_delete_author on public.task_comments
  for delete using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- Templates
do $$ begin
  create policy task_templates_crud_members on public.task_templates
  for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

-- Preferences
do $$ begin
  create policy uwp_select_self on public.user_workspace_preferences
  for select using (user_id = auth.uid() and is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy uwp_upsert_self on public.user_workspace_preferences
  for insert with check (user_id = auth.uid() and is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy uwp_update_self on public.user_workspace_preferences
  for update using (user_id = auth.uid() and is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

-- Notification settings
do $$ begin
  create policy notif_select_self on public.notification_settings
  for select using (user_id = auth.uid() and is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notif_upsert_self on public.notification_settings
  for insert with check (user_id = auth.uid() and is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notif_update_self on public.notification_settings
  for update using (user_id = auth.uid() and is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

-- Integration accounts and audit logs
do $$ begin
  create policy integration_accounts_crud_members on public.integration_accounts
  for all using (is_member(business_id, auth.uid())) with check (is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy audit_logs_select_members on public.audit_logs
  for select using (is_member(business_id, auth.uid()));
exception when duplicate_object then null; end $$;

-- Useful indexes
create index if not exists idx_members_user on public.business_members(user_id);
create index if not exists idx_tasks_business_status on public.tasks(business_id, status);
create index if not exists idx_invites_token on public.invitations(token);
create index if not exists idx_task_events_task on public.task_events(task_id, created_at);
create index if not exists idx_task_comments_task on public.task_comments(task_id, created_at);
create index if not exists idx_task_templates_business on public.task_templates(business_id, department);
create index if not exists idx_uwp_user_business on public.user_workspace_preferences(user_id, business_id);
create index if not exists idx_agent_runs_task on public.agent_runs(task_id, created_at);
