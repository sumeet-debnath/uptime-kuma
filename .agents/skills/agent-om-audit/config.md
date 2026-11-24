# The app's `agent-om/config.md`

What the audit needs to know about the app, in the app's own folder. Lines of
`key: value` at the top; the rest is free text for whoever audits.

```md
# Agent Object Model audit

address: http://localhost:3000
start: pnpm dev
cli: npx @agent-om/audit

## Accounts

- An admin: sign in as `admin@example.com`, password in $APP_ADMIN_PASSWORD.

## Scope

Every page a signed-in admin can reach. Leave out /admin/debug (the app's own tooling).
```

- `address`: where the app runs locally (its dev server): what `agent-om-audit start`
  opens, and what `agent-om-audit open <path>` opens a path of.
- `start`: the command that starts the app, run from the app's folder. Optional:
  without it, the developer starts the app.
- `cli`: how to run the `agent-om-audit` command.
- **Accounts**: who to sign in as, and the variable holding each password
  (for `agent-om-audit fill-secret`, which takes it from the environment or
  from `agent-om/.env`: `APP_ADMIN_PASSWORD=…` lines the developer keeps there;
  `install` git-ignores it). Never a password itself.
- **Scope**: which pages, or "every page". What to leave out, and why.

`agent-om-audit install` writes this example as the app's first config, with a line
that says it's a template: the values are the example's until that line is
deleted.

`agent-om/.session/` holds a running session's state, saved screens and
screenshots; it's git-ignored. Reports go in `agent-om/audits/`, and are meant to
be committed.
