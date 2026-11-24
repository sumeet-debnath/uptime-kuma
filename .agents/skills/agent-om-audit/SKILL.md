---
name: agent-om-audit
description: Audits a web app against the Agent Object Model guidelines, screen by screen, for what an AI agent reading its pages from outside through the projection would miss (controls with no role or no name, state that isn't exposed, unmarked risk, popups that don't say what they hold, pages missing from the sitemap), and writes a report with a fix for each finding. Use when asked to audit an app for agents, for agent-readiness, or against the Agent Object Model guidelines.
---

# Agent Object Model audit

An audit checks every screen of the app (each page, and what a click, hover,
key or typing brings up on it) against the guidelines: what the markup gives
an agent that reads the page through the Agent Object Model's projection, and
what it leaves out. The projection is read from outside the page, as an
agent's tool reads it: Chrome's accessibility tree and the DOM, merged, with
secrets taken out; `agent-om-audit view` prints it as that tool does, each thing to
act on with its ref (`[e12]`). The `agent-om-audit` command checks one screen at a time and
says what it found; you decide which screens there are, bring each one up,
judge what it can't, and write the report.

Next to this file:

- `guidelines.md`: the guidelines. Findings name them by number (1.3, 4.1…).
- `rules.md`: what `agent-om-audit check` finds by itself, and the guidelines no rule checks.
- `config.md`: the format of the app's `agent-om/config.md`.
- `report.md`: the format of the report.

## 1. Set up

Read `agent-om/config.md` (its format: `config.md`). Its `cli:` line is how to
run the command, written `agent-om-audit` below; `address:` is where the app runs
locally. The `cli:` line is a command with arguments: in a shell, define a
function for it (`agent-om-audit() { <the cli line> "$@"; }`) rather than a variable.

A config that still has the line "A template: every value below is an
example" isn't this app's yet. Put in what the app's own files say (its
address and the command that starts it: its README, its package.json), ask the
developer for the account and the scope, and delete the line. Never audit
with the example's values.

1. `agent-om-audit status`. If a session is running, go on.
2. Check that the app answers at its address. If it doesn't, start it with the
   config's `start:` command, in the background, and wait until it answers; if
   there's none, or it fails, ask the developer to start it.
3. `agent-om-audit start`.
4. Sign in, when the app asks for it, as the account the config names: open
   the sign-in page, `agent-om-audit type` the name and `agent-om-audit fill-secret` the
   password. A session doesn't outlive `agent-om-audit stop`: a new one signs in
   again. When the variable isn't set, ask the developer to set it: never ask
   for the password itself.

The audit runs on the developer's local copy and has full control of it: click,
save, delete or send anything a screen needs. For a password, `agent-om-audit
fill-secret <ref> <VARIABLE>` with the variable the config names (it fills
only into the app at its address): it's taken from the environment, or from
`agent-om/.env`, where the developer keeps the app's test passwords (install
git-ignores it). Never type a secret, print it, or write it down, and never
read `agent-om/.env` yourself.

## 2. List the screens

List the pages: the config's scope, or else every page a user can reach (the
app's routes, its navigation, the sitemap it links to). For each page, list its
screens: everything a click, hover, key or typing shows on it (dialogs, menus,
popovers, tabs, expanded rows and panels, a form's errors, empty and error
states, what hovering a row shows). Find them in the page's code, and in
`agent-om-audit view` once it's open. Write the list down before you check anything:
it goes in the report.

## 3. Check each screen

For each page:

1. `agent-om-audit open <path>`, then `agent-om-audit check --as base`, then
   `agent-om-audit screenshot --labels` (the numbers are the page's controls,
   listed with their refs).
2. For each screen on the page: bring it up with `agent-om-audit click`, `hover`,
   `type`, `press`, `select` or `scroll`. A target is a ref from
   `agent-om-audit view` (`e12`); when what you need has no ref, use `--selector <css>`
   (`--nth <n>` picks one when it matches several), and note it: an agent
   couldn't have done that step. Every check hovers the first of each kind of
   repeated item by itself. An item that isn't one of many (a lone row, a
   card), or one with no ref (a message's toolbar), you hover yourself:
   `agent-om-audit hover <ref>` or `--selector <css>`, and the check right after it
   reports what the hover showed. A ref is Chrome's id for the element: it
   lasts as long as the element, and a page that draws its element anew (a
   list rendered again, another page) gives it another, so read refs from
   `agent-om-audit view` again after a step that changed the screen. `agent-om-audit view
   <ref>` shows one part of the page; alike items past 25 in a row are cut,
   and `--limit 0` shows them all. Then `agent-om-audit check --since base`, and
   `agent-om-audit screenshot` when something changed.
3. Put the page back (Escape, Close or Cancel), and check that `agent-om-audit check
   --since base` says nothing is added, changed or gone before the next screen.
   On a page that changes by itself (a count that ticks, a countdown, a
   clock) that line may never come: what matters is that what you opened is
   gone; then take a new base.
   When it can't be put back that way, `agent-om-audit open <path>` again and take a
   new base (`agent-om-audit check --as base`): a page loaded again is a new document,
   which `--since` can only call navigated.

A notice (a toast, a status line) shows for a few seconds: take its
screenshot first, then check, right after the step that shows it, or it's
gone.

A check right after `agent-om-audit hover` hovers nothing else, so what the hover
opened (a submenu) stays open; it says so. A step that can't reach its target
says what's over it (an open menu's layer): close what's open first, or reach
the target with the keyboard (arrow keys in a menu).

A check also lists the page's console errors since the last check: an error
page, or a screen that didn't come up, is in "Not covered", with the error.
After an error, look at `agent-om-audit view` before going on: the screen may not be
the one you asked for (a form that threw keeps showing the fields it had).

`agent-om-audit upload <ref> <file>` chooses a file for a file field. `agent-om-audit start
--viewport 390x844` opens the app in a phone's window, for screens only a
narrow window shows (stop the session and start it again to change the
window).

A step says what it did beside the page. A native dialog (`alert`, `confirm`,
`prompt`) is the browser's own: the projection holds nothing of it, so note it
where you judge the action (an agent can't see what it asks). A confirm is
dismissed, and the step went no further: take it again with `--accept` to go
through with it. Another tab the step opened is closed, with its address:
`agent-om-audit open` that page to check it. A download is named.

When a step makes the page load more (a list that loads older items as it
scrolls), `--since base` counts them all as added: take a new base there.

When a check's first line says `unsettled`, wait a moment and check again. When
it says `navigated` (a page loaded) or `moved` (the app went to another address
without loading one), the step went to another page: check that screen as that
page's, with a base of its own.

Some pages change what the whole app shows (opening a team switches the
current team, a setting changes the language): put it back before the next
page, or the pages after it are checked as another account would see them.

`agent-om-audit check --json` gives the findings as JSON. `agent-om-audit inspect <ref>`
shows an element's markup, how the audit reads it and its node.

## 4. Judge

- **Fail** findings are failures of the guideline they name. Keep each, unless
  it's plainly wrong about the element (then say why in the report's
  "Looked at" list).
- **Review** findings are where a rule couldn't decide. Inspect each (`agent-om-audit
  inspect`, the screenshot, the page's code) and decide: a failure, or fine.
  Say which, and why, in the report.
- A `secret-shown` review (4.5), or a screenshot refused because the screen
  shows what looks like a secret: stop and tell the developer where it is (the
  page, the screen, the element's key), never what it is (the audit masks it as
  `[looks secret]`). Skip that screen until they reply. If they say it's a
  secret, it's a 4.5 failure (the fix: `data-agentom-redact` on it); if they say
  it isn't, go on, and `agent-om-audit screenshot --anyway` takes the screenshot.
- When the page itself says a field holds a credential ("Your API key has
  been added: it will not be shown again"), that's the answer: report it as a
  4.5 failure, and say in the finding that the page's own words are why.
- To see whether a field that can be shown gives its value to the projection,
  fill it with a throwaway value of your own through `fill-secret`
  (`AUDIT_PROBE=<anything> agent-om-audit fill-secret <ref> AUDIT_PROBE`), show it,
  and check: a field the app doesn't mark comes back as a `secret-shown`
  failure. Never use a real password for this.
- A `secret-shown` failure is no guess: a field gave back a secret you filled
  in with `fill-secret` (a password shown as text, a code in a plain field),
  masked as `[secret]`. Keep it, and take no screenshot of that screen: put it
  back as it hides the secret first.
- What looks like a secret is masked wherever the audit prints it, a link's
  name and address included; its element is still reached by its ref, which
  is never made from what it says.
- When the developer answers after the report is written, finish the screens
  that waited and bring the same report up to date in place: the findings,
  "Looked at", "Screens covered", "Not covered" and the header's counts,
  counted from the file.
- Where the markup says something right (a role, a name, a state you can see
  in `agent-om-audit inspect`) and `agent-om-audit view` leaves it out or reads it wrong,
  the problem is the Agent Object Model's, not the app's. List it apart,
  under "Possible problems in the Agent Object Model".
- Then go through `guidelines.md` for what no rule sees (`rules.md` lists the
  guidelines no rule checks): names that don't say what a control does, state
  shown only by colour or an icon, actions that change data with no risk or the
  wrong one, unnamed sections, one thing called two names, a stale title.
  Read each screen's `agent-om-audit view` and screenshot for them.

A finding is the app's when its markup lacks what the guideline asks. Each
fix is markup only: roles, names, states, relationships, descriptions and
`data-agentom-*` metadata. It never changes what people see or do (the
guidelines' first rule). Some markup that reads as semantics does: a
`tabindex`, a label's `for` that now names a field, `type="search"`,
`required`, an `autocomplete` token, an element moved or its tag changed.
The guidelines list them under the first rule, with what to write instead:
write the fix that way. A finding that can't be fixed without one of them
says so in its fix, and what it would change for people.

## 5. Compare with the last audit

Look in `agent-om/audits/` for the newest report. If there is one, a finding
whose guideline and page match one of its findings, and whose key (or any of
its keys, for a finding of many elements) is one of that finding's keys, keeps
that finding's id. A finding on every page matches by guideline and key alone.
Keys are as `agent-om-audit check --json` gives them (`element.key`, and for a
finding of many elements each one's in `element.keys`; plain `check` prints only
what they share): copy them, never write your own. Of
the last report's findings:

- **fixed**: you checked its screen and it's gone;
- **still open**: you found it again;
- **not checked**: you didn't reach its screen;
- **withdrawn**: you judge it wasn't a failure after all (say why), though
  nothing changed.

The rest are **new**, numbered on from the last report's highest id. Do the same
for possible problems in the Agent Object Model (`P-` ids).

## 6. Write the report

Write `agent-om/audits/NNN-YYYY-MM-DD.md`: NNN one more than the newest report's
(001 for the first), the date today's. Follow `report.md`. Then `agent-om-audit
stop`, and tell the developer where the report is, how many findings it has at
each level, and what you couldn't check.
