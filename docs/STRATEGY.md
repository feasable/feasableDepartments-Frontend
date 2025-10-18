# lunoSpaces – Product, Auth, Onboarding, and Dashboard Strategy

## Vision
Build an AI workspace platform ("Spaces"/"Astronauts") where teams spin up specialized AI agents for departments to autonomously execute tasks. Smooth entry, delightful UI/UX, and strong collaboration loops drive adoption.

## Personas
- Founder/operator: wants quick value; minimal setup; invite team.
- Manager: clarity on activity, control, and approvals.
- IC/Marketer/Support: easy tasking and handoff to agents.
- Developer/Integrator: APIs, webhooks, automations.

## Key Differentiators
- Space/Astronaut marketplace with ready-to-run templates.
- Voice/command-palette control (hands-free and fast).
- Multi-agent orchestration (Flows) with explainability & replay logs.
- Deep integration surface (CRM, helpdesk, comms, storage).
- Collaborative guardrails (approvals, policies, auditing).

## North-star UX
- 60s to value: sign-in → workspace exists or quick-create → deploy first Space/agent → ship 1 task → see results.
- Smooth re-entry: fast auth, resume context, recent activity, quick actions.

---

## Auth & Session Flows
- Email/password, OAuth (Google/GitHub), Magic link, Reset password, Session refresh.
- Callback consolidator: `/auth/callback` exchanges code and routes to `/dashboard`.
- Single `/auth` for all forms to avoid split routes.
- Redirect rules:
  - Unauthed → `/auth`.
  - Authed without workspace → onboarding wizard.
  - Authed with workspace but incomplete profile → dashboard banner + wizard CTA.

## Onboarding Paths
- Create new workspace (default Personal Workspace).
- Join by invite token (`/invite/[token]`).
- Skip for now: minimal workspace + banner.
- Optional steps: company name, team size, integrations, first Space, invite teammates.

## Dashboard IA
- Left nav: Overview, Spaces, Tasks, Agents, Automations, Data, Team, Billing, Settings.
- Header: Workspace switcher, global search/command, user menu.
- Overview: stats + recent activity + quick actions.
- Spaces: marketplace, templates, one-click deploys.
- Agents: config per department, runs, logs.
- Automations: drag-and-drop flows, triggers, approvals.

## Growth Loops
- Invite flows with roles + sharing links.
- Public templates & showcase pages.
- Referral credits on workspace creation.
- One-click “Clone this Space”.

## Analytics & Experimentation
- Event taxonomy: auth_start/success, onboarding_start/finish, space_deployed, task_created, agent_run, invite_sent, plan_upgraded.
- Use PostHog (self-host) or Segment; Feature flags via table/remote config.

## Security & Compliance
- Supabase RLS on all tenant tables.
- API keys scoped per workspace; signed webhooks.
- Audit logs, consent for voice, PII minimization.

## Performance & Quality
- Suspense/skeletons; optimistic UI; background loads.
- Error boundaries with retry and context logging.

## Roadmap (High level)
- Phase 1: Auth hardening, callback, banner gating, invites, workspace switcher.
- Phase 2: Spaces marketplace, Agents CRUD, Flows MVP, integrations.
- Phase 3: Growth, billing, analytics, polish.
