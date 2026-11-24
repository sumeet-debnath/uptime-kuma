# The fix plan: `agent-om/fixes/NNN-YYYY-MM-DD.md`

For the app's developers: every change that fixes an audit's findings, to
approve before it's made, and the record of why each was made after. NNN is
the audit's number (one plan per audit), the date the plan's. Plain Markdown,
in this order.

```md
# Fix plan for audit NNN, YYYY-MM-DD

<app name>. From agent-om/audits/NNN-YYYY-MM-DD.md: <F> failures in scope.
<x> findings fixed by <c> changes (<p> of those findings in part), <y> findings need your decision, <z> not in this plan.

## Changes

### C-1 Name the row actions' icon buttons

- **Status:** proposed
- **Fixes:** F-003 (1.3, 12× `button in row of table 'Websites'`, /websites),
  F-007 (1.3, 4× `button in row of table 'Teams'`, /teams)
- **Where:** src/components/RowActions.tsx:42, used on /websites and /teams
- **Change:**
  ```diff
  - <Button icon={<Edit />} onClick={onEdit} />
  + <Button icon={<Edit />} onClick={onEdit} aria-label={t('Edit {name}', { name })} />
  ```
- **Nothing visible changes:** an `aria-label` isn't drawn and adds no Tab stop.
- **Check:** /websites, the page; /teams, the page. `agent-om-audit check` lists none
  of F-003's or F-007's keys. Before: agent-om/.session/shots/004.png, 005.png
- **Question:** should the name be "Edit" or "Edit <website>"?   ← only when there is one
- **Outcome:** checked: both findings gone, the screens alike.  ← once applied

### C-2 Add the message keys the new names use

- **Status:** proposed
- **Fixes:** none on its own: the names in C-3 and C-5 use these keys.
- ...

## Needs your decision

- F-020 (1.20, /websites/:id, the row toolbar shown on hover): every way to
  expose it changes what people do or see: a Tab stop on each row, or the
  toolbar drawn always. Nothing changed until you choose.
- F-012 (1.3, the "Copy" buttons): the UI library writes them and takes no
  name from the app; fixing it needs a change in the library.
- F-021 (4.1), the part C-4 doesn't fix: the confirm buttons inside the
  library's alert dialog.

## Not in this plan

- P-001 (1.3): a possible problem in the Agent Object Model; to report to it.
- F-011 (1.9): left out at your request.
```

- **Status** is one of: `proposed`, `approved`, `applied`, `checked`,
  `checked in part` (what wasn't seen), `skipped` (why), `undone` (what the
  check saw), `done by the developer`.
- **Changes** are numbered `C-1`, `C-2`… in the order they're applied, grouped
  by where they're made (one component, one file), not by finding. A change
  others need comes before them.
- **Fixes:** each finding by its report id, guideline, key (as the report gives
  it, how many elements) and page; "(part)" when the change fixes it only in
  part, the rest under "Needs your decision". A change others need (message
  keys, a shared helper) fixes none on its own: say which changes use it.
- **Every change stands on its own**: the file and line, the diff, why nothing
  visible changes, and how to check it, so a developer can make it without the
  skill. One pattern repeated over many places (a name on each of 80 fields)
  is one change: the diff once, then every file and line it goes on, or the
  search that finds them all (`grep -n 'class="form-text"' src/**/*.vue`).
- **The counts:** findings, never changes: a finding fixed in part counts in
  <x> and in <p>, and again in <y> for the rest.
- **Every failure in scope** is in a change, under "Needs your decision", or
  under "Not in this plan" (a finding fixed in part, in a change and under
  "Needs your decision").
- **Needs your decision** holds what can't be fixed without changing what
  people see or do (with what each way would change), what can't be fixed in
  the app's own code (with what the library would have to change), and the
  rest of findings fixed in part.
