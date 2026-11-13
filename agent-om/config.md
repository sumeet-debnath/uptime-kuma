# Agent Object Model audit

address: http://localhost:3000
start: npm run dev
cli: node /Users/sumeetdebnath/Workspace/agent-om/packages/audit/bin/agent-om.mjs

Uptime Kuma 2.5.9 (branch feat/add-agent-om, from the 2.5.9 release). `npm run dev`
starts the frontend (Vite, port 3000) and the backend (port 3001); the app is
up when both answer. Its data is a SQLite file in `data/` (git-ignored).

## Accounts

- The admin, the only account: sign in as `admin`, password in
  $KUMA_ADMIN_PASSWORD. The variable is set by `. agent-om/.env` (git-ignored):
  source that file in the shell before `agent-om fill-secret`, and never print
  or read it.

## Scope

Every page the signed-in admin can reach: the dashboard and a monitor's page,
adding and editing a monitor, status pages (the list, the page `/status/kuma`
and its editor), maintenance, and every tab of Settings. Also the sign-in
screen, as a signed-out visitor sees it.

Leave out the links that leave the app (GitHub, Wikipedia, documentation).

## What's there

Three monitors (Kuma backend and Kuma frontend, up; Broken site, down) and one
status page (Kuma services, `/status/kuma`). No notifications, tags, groups,
maintenance windows or API keys yet: make what a screen needs, and remove what
you made when it would change other screens.
