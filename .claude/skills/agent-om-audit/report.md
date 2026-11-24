# The report: `agent-om/audits/NNN-YYYY-MM-DD.md`

For the app's developers: what an agent misses on each screen, and the fix.
Plain Markdown, in this order.

```md
# Agent Object Model audit NNN, YYYY-MM-DD

<app name>, at <address>, as <account>. <N> pages, <M> screens.
<F> failures (<a> at level A, <aa> at AA, <aaa> at AAA), <P> possible problems in the Agent Object Model.
Since audit <NNN-1>: <x> fixed, <y> still open, <z> new, <w> not checked, <v> withdrawn.   ← after a first audit only

## Findings

### F-001 <guideline number and title> (<level>)

- **Page:** /campaigns, screen "Filter menu open"
- **Element:** `button 'Filter' in region 'Campaigns'`   ← the finding's key, as `agent-om-audit check` gives it
- **Found by:** `popup-undescribed` (or "reading the screen")
- **What's wrong:** the button opens a menu of statuses, and nothing says which.
- **Evidence:** what the check said; the markup that matters.
- **Fix:** `aria-describedby` pointing at a hidden element listing "Choices: Active, Paused, Ended".
- **Since audit NNN-1:** new | still open   ← after a first audit only

(One section per finding, in this order: every finding of level A, then AA,
then AAA; within a level, by guideline number. A first audit numbers them in
that order, F-001 the first of level A. A later audit keeps each finding's id
from the last report and numbers new ones on from its highest, so ids don't
follow the order: the order is by level all the same.)

## Possible problems in the Agent Object Model

Findings where the page's markup is right and what `agent-om-audit view` shows of it
isn't: the same fields as above, to report to the Agent Object Model, not to fix in the app.

## Withdrawn since audit NNN-1    ← after a first audit only

Findings of the last audit judged not to be failures after all, with why.

## Fixed since audit NNN-1        ← after a first audit only

- F-004 <guideline>: <key> on <page>.

## Not checked since audit NNN-1  ← after a first audit only

Findings of the last audit on screens this one didn't reach.

## Screens covered

| Page | Screen | How it was reached |
|---|---|---|
| /campaigns | the page | open |
| /campaigns | Filter menu open | click `button "Filter"` |
| /campaigns | Row actions | hover over the first row; click --selector `.row-menu` (no ref: an agent couldn't) |

## Looked at

Review findings judged fine, and fails judged wrong, each with why.

## Not covered

What the audit didn't reach, and why: pages out of scope, screens it couldn't bring up,
iframes and shadow DOM (the audit doesn't enter them).
```

- **Ids** (`F-001`) stay with a finding from one audit to the next: one finding
  is another audit's when the guideline and the page are the same and they
  share a key (a finding of many elements has a key for each: list them all).
- **Element:** the key, or the keys, exactly as `agent-om-audit check --json` gives them
  (`element.key`; a finding of many elements has each one's in `element.keys`, which
  plain `check` doesn't print).
  A finding no rule found (from reading the screen) has no key: give its role
  and name as `agent-om-audit view` shows them (`button "Filter"`), marked "(node)",
  or, for what has no ref, its selector. Never a ref: it lasts only as long as
  the page that drew it.
- **Page:** one page, or, for a finding on many pages (the frame every page
  shares), each page it's on, or "every page".
- **Every finding stands on its own:** what's wrong, the evidence and the fix,
  for one still open since the last audit too, never "as in audit NNN".
- **Level** comes from the guideline (`guidelines.md`).
- A finding counted many times (`12×`) is one finding: say how many elements.
