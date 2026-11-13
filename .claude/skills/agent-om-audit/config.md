# The app's `agent-om/config.md`

What the audit needs to know about the app, in the app's own folder. Lines of
`key: value` at the top; the rest is free text for whoever audits.

```md
# Agent Object Model audit

address: http://localhost:3000
start: pnpm dev
cli: node /path/to/agent-om/packages/audit/bin/agent-om.mjs

## Accounts

- An admin: sign in as `admin@example.com`, password in $APP_ADMIN_PASSWORD.

## Scope

Every page a signed-in admin can reach. Leave out /admin/debug (the app's own tooling).
```

- `address`: where the app runs locally (its dev server): what `agent-om start`
  opens, and what `agent-om open <path>` opens a path of.
- `start`: the command that starts the app, run from the app's folder. Optional:
  without it, the developer starts the app.
- `cli`: how to run the `agent-om` command.
- **Accounts**: who to sign in as, and the environment variable holding each
  password (for `agent-om fill-secret`). Never a password itself.
- **Scope**: which pages, or "every page". What to leave out, and why.

`agent-om install` writes this example as the app's first config, with a line
that says it's a template: the values are the example's until that line is
deleted.

`agent-om/.session/` holds a running session's state, saved screens and
screenshots; it's git-ignored. Reports go in `agent-om/audits/`, and are meant to
be committed.
