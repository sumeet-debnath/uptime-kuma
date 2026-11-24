# Agent Object Model audit

address: http://127.0.0.1:3610
cli: node /Users/sumeetdebnath/Workspace/agent-om/packages/audit/bin/agent-om-audit.mjs

The app runs as the production build in a container, with seeded monitors,
status pages and maintenance; the developer starts it (no `start:` line).

## Accounts

- The admin (the app's only user): sign in as `admin`, password in $KUMA_ADMIN_PASSWORD.

## Scope

Every page a signed-in admin can reach.
