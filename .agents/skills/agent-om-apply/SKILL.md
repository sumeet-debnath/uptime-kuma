---
name: agent-om-apply
description: Fixes what an Agent Object Model audit found in a web app. Reads the audit's report (agent-om/audits/), finds the code behind each finding, writes a fix plan for the developer to approve or change, then makes the approved markup-only changes (roles, names, states, descriptions, data-agentom-* metadata) and checks each finding is gone with nothing a person sees or does changed. Use when asked to fix or apply an Agent Object Model audit's findings.
---

# Apply an Agent Object Model audit

An audit's report (`agent-om/audits/NNN-YYYY-MM-DD.md`) lists what an agent
misses on each screen of the app, with the fix in words. Applying it turns
those fixes into changes to the app's code, in three parts:

1. **Plan**: find the code behind each finding, work out the change, and write
   it all to a fix plan.
2. **Approve**: the developer approves the plan, changes it, or makes the
   changes themselves. Nothing is changed in the app before they reply.
3. **Apply and check**: make the approved changes and check, screen by screen,
   that each finding is gone and nothing else changed.

Next to this file:

- `plan.md`: the format of the fix plan.
- `guidelines.md`: the guidelines. Findings name them by number (1.3, 4.1…).

## The rule every change follows

A change to the app's pages is markup only: roles, accessible names, states,
relationships, descriptions in hidden elements, visually hidden text and
`data-agentom-*` metadata. Nothing a person sees changes (pixels, layout, visible text), and
nothing they do (mouse, keyboard, focus order and Tab stops, touch, timing,
addresses). It's the guidelines' first rule.

- An element a change adds (a hidden description) takes no space and no Tab
  stop.
- A name is written the way the app writes its visible text: through its
  translation function when visible text goes through one.
- A finding caused by a shared component is fixed once, where the component
  is defined, when that fixes every finding it causes.
- A finding that can't be fixed without changing what people see or do (a
  control drawn only while the pointer is over its row: any fix gives it a Tab
  stop or draws it always) is never changed by you, even when asked. It goes
  under "Needs your decision" in the plan, with what each way of fixing it
  would change for people. So does one that can't be fixed in the app's own
  code (a library it uses writes the markup and lets nothing through), with
  what would have to change in the library.
- A finding only partly fixable is fixed as far as it can be; the rest goes
  under "Needs your decision".
- Some guidelines ask for more than markup (the screen's context, a sitemap):
  a change that adds a dependency or a build step is planned like any other,
  with a question asking the developer whether they want it.

## 1. Set up

Read `agent-om/config.md`. Its `cli:` line is how to run the command, written
`agent-om` below (in a shell, define a function for it: `agent-om() { <the cli
line> "$@"; }`); `address:` is where the app runs locally. A config that still
has the line "A template: every value below is an example" isn't this app's:
ask the developer to fill it in before going on.

Read the newest report in `agent-om/audits/`, or the one the developer names.
If `agent-om/fixes/` already has a plan for that audit (the same NNN), read it
and go on from where it stands: what's applied stays applied, and you go to
the part it's at.

Which findings: every failure that's new or still open, or those the developer
names (ids, a level, a page). Never the "Looked at" list (judged fine), and
never the possible problems in the Agent Object Model (`P-` ids): those are the
projection's, not the app's. List them in the plan as not in it.

Then start a session: `agent-om status`; if none is running, check that the
app answers at its address (start it with the config's `start:` command, in
the background, or ask the developer), then `agent-om start`, and sign in as
the account the config names when the app asks for it. A session doesn't
outlive `agent-om stop`: every new one signs in again. For a password,
`agent-om fill-secret <id> <VARIABLE>` with the variable the config names:
never type a secret, print it, or write it down.

## 2. Plan

Work screen by screen, not finding by finding: list the screens the findings
are on (the report's "Screens covered" says how each is reached), and for
each screen:

1. **Bring it up**: `agent-om open` its page, then the steps the report gives
   for it. `agent-om check` shows the findings' keys (the report's
   "Element"), and `agent-om inspect <id>` (or `--selector <css>`) an
   element's markup and how the audit reads it. Keep the check's lines
   (`agent-om check > agent-om/.session/before-<screen>.txt`): after a change
   the app loads the page again, and a check `--since` a saved screen can then
   only say `navigated`, so what's new is told by comparing the lines.
2. **Take the "before"**: `agent-om screenshot` (it prints the file). Note the
   file, with the screen's address and any state it was in (a sort, a view, a
   toggle, the sidebar collapsed), next to the changes it belongs to: you
   bring the screen up in the same state to compare with it after.
3. **Put it back**: when bringing the screen up saved something (a tab or a
   setting the app remembers, a record you made to reach it), undo it before
   the next screen, as the audit does.

Then for each finding:

1. **Find its code**: search the app's source for what the markup shows (its
   text, its classes, its attributes), starting from the component the page's
   route renders. Follow it to where the element is written, and to where a
   shared component is defined.
2. **Work out the change**, from the report's fix and `guidelines.md`. When
   the code shows the report's fix is wrong (the element comes from a library
   the app can't change, the report misread the markup), say so in the plan,
   with what you'd do instead, or that it can't be fixed in the app.

Group the changes by where they're made (one component, one file), so a change
can fix many findings. Write the plan to `agent-om/fixes/NNN-YYYY-MM-DD.md`, NNN
the audit's number and the date today's, following `plan.md`. Every failure in
scope is in a change, under "Needs your decision", or under "Not in this
plan".

Where a change needs what only the developer knows (what an action risks,
what a control should be called), write the question under it.

Then `agent-om stop`, and tell the developer where the plan is: how many
changes, how many findings they fix, what needs their decision, and the
questions. They can approve it, change it (by editing the file or by saying
what to change), or make the changes themselves, with the plan as their
checklist. Stop until they reply; start a session again (as in step 1) when
they do.

## 3. Apply

When the developer approves (all of it, or the changes they name), read the
plan file again: it's what you apply, with their edits. Mark the changes they
left out `skipped`, with their reason.

Make each approved change, in the plan's order. After each file, run the app's
own typecheck and lint when it has them (its package.json or README says
how), and fix what your change broke. Format only the files you changed (the
app's formatter on those files, never on a whole folder). Mark the change
`applied` in the plan.

When the developer made the changes themselves, apply nothing: mark them
`done by the developer` and check them.

## 4. Check

Run the app's tests once, when it has them. A test that fails because of an
approved change (it expects the old name, or its mock lacks what the change
now uses) is updated with the change; say which in the change's outcome. Any
other failure is the change's to fix, or to undo.

Then, for each applied change, once the app has reloaded with it:

1. Bring up each of its screens as in step 2, in the state its before was
   taken in, and put them back after.
2. `agent-om check`: none of its findings' keys is listed, and no line is
   there that the lines kept in step 2 lack.
3. `agent-om screenshot --compare <before>`: the same as the before, or how
   many pixels differ and where, with an image of the differences in red. Look
   at every area that differs: content that changes by itself (live counts,
   times, a chart's latest point) doesn't count; anything else moved, drawn
   or gone does. A console error `check` lists that wasn't there before the
   change, an error page or the framework's error overlay: the change broke
   the page.
4. Read its diff (`git diff` of its files, or what you wrote), line by line,
   against the rule every change follows: a screenshot shows what people see,
   not what they do. Every added or changed line is a role, a name, a state, a
   relationship, a description or `data-agentom-*` metadata; or a hidden
   element (`hidden`, or visually hidden text that takes no space); or what
   those need (an id, a message key, a translation, a wrapper kept out of the
   layout with `display: contents`). Anything else is a change people would
   feel: a `tabIndex` or focus handling added or changed, an event handler
   added, removed or changed, an element's tag changed (a `div` made a
   `button` takes keys and a Tab stop), visible text, any other class or
   style. A line only re-wrapped or moved, the same as before, isn't a change.

When all four hold, mark the change `checked`. When part of it couldn't be
seen (a list with no items at the moment), mark it `checked in part`, with
what wasn't seen. When a finding is still there, a new one is, or the screen
looks different, undo that change, mark it `undone` with what you saw, and
tell the developer. A line of the diff that breaks the rule is undone too
(the rest of the change can stay), or, when the finding can't be fixed
without it, the change goes under "Needs your decision" with what it would
change for people. A finding left open by what the developer chose (they kept
a name the check still flags) isn't a reason to undo: keep the change and say
so in its outcome.

## 5. Report

`agent-om stop`. Tell the developer what was applied and checked, what was
undone or skipped and why, and what still needs their decision. The changes
are theirs to review and commit, with the plan: never commit them yourself.
The next audit is the full record: it marks the findings fixed.
