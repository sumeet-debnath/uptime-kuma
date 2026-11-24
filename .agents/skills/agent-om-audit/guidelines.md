<!-- Generated from docs/guidelines.md in the agent-om repository (pnpm --filter @agent-om/audit skill). Don't edit: change the source. -->

# Agent Object Model Authoring Guidelines

How to build a web app so the Agent Object Model describes it accurately,
and so whatever reads the projection can understand it and act on it safely.

Like [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/), these are
**guidelines for authors**. The projection is the reader: it reports what the
page actually expresses through HTML, ARIA and metadata, as Chrome's
accessibility tree reads it, and it never guesses.
How you meet each criterion is up to you.

**They change what a page says about itself, never what people see or do.**
Meeting a criterion adds or corrects roles, names, states, relationships,
descriptions (in hidden elements where the screen doesn't show them) and
`data-agentom-*` metadata. What the page looks like, its visible text, its
focus order and Tab stops, its timing, and what the mouse, keyboard and touch
do stay as they are.

Some markup that reads as semantics changes what people get too. Where an
element doesn't have it already, use what's on the right:

| Changes what people get | Instead |
|---|---|
| `tabindex="0"` (a Tab stop where Enter and Space do nothing, unless a key handler comes with it) | the role alone (`role="button"`); keyboard access is the app's own decision |
| a `<label for>` that now names a field (a click on the label focuses or toggles it) | `aria-labelledby` on the field, pointing at the label (an id on the label) |
| `type="search"` (the browser draws a clear button, and Escape empties the field) | `role="searchbox"`, or `role="search"` on the form around it |
| `required` (the browser stops the submit and shows its own message) | `aria-required="true"` |
| an `autocomplete` token (the browser and password managers fill or offer to save the field) | `data-agentom-redact` |
| an element moved, or its tag changed (a `div` made a `button` takes keys and a Tab stop) | the role and name on the element as it is |
| an element added inside a group styled by position (Bootstrap's `.input-group` and `.btn-group`, a `:first-child` or `:last-child` rule), even hidden | the hidden text inside the control itself, or outside the group |

An element that has one of these already keeps it.

Where a library writes the markup and takes no attributes from the app, a
script that only sets attributes on what it wrote is a markup change too: a
role, a name, a relationship, a state kept in step with the library's own
classes. It adds, moves and draws nothing, and adds no Tab stop or event
handler. (Uptime Kuma's multiselects: the library put `role="combobox"` on the
whole widget, its choices inside it; a script moved the role to the box
people click and left the list of options beside it.)

Each criterion has a **level**:

| Level | Meaning |
|---|---|
| **A** | Minimum. The app projects correctly and dangerous actions are marked. |
| **AA** | Reliable to act on. Explicit relationships, unique ids, the screen declared. |
| **AAA** | Rich. Named sections, exact values where the display loses them, declared actions and purposes everywhere. |

**Conformance:** a screen conforms at a level when it meets every criterion at
that level and below. An app conforms when every screen does.

Each criterion lists how to check it. **Automatic** means the projection
warns of it, the audit reports it, or a snippet from
[How to check](#how-to-check) finds it. **Manual** means reviewing the view an
agent reads (`agent-om-audit view`, or `agent-om snapshot` with the agent-om
command-line tool).

Criteria are numbered for good: a criterion that no longer applies is removed
and its number isn't used again.

For how the projection is read, see [semantic-projection.md](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/semantic-projection.md).
Every fixed value in this document (attribute names, risk levels, secret
tokens, warning codes) comes from core's
[`vocabulary.ts`](https://github.com/TheAsyncLooop/agent-om/blob/master/packages/core/src/vocabulary.ts), and the
sitemap's (its path, link and warning codes) from the sitemap entry's
[`vocabulary.ts`](https://github.com/TheAsyncLooop/agent-om/blob/master/packages/core/src/sitemap/vocabulary.ts); tests fail
if they disagree.

---

## Principle 1: Perceivable to the projection

The projection only sees what HTML, ARIA and metadata express.

### 1.1 Native semantics first (A)
Use native elements for controls and structure: `<button>`, `<a href>`,
`<input>`, `<select>`, `<form>`, `<nav>`, `<main>`, `<table>`, `<h1>`–`<h6>`.
Use ARIA roles only when HTML has no element for the job.

- **Why:** a `<div onClick>` with no role has no role in the tree. At best it
  sets a pointer cursor and reads as `clickable "Save"`, a fact with no role,
  state or meaning; without one it's only text. Click handlers aren't
  detected.
- **Pass:** `<button>Save</button>`; on a `div` that acts as a button already,
  `<div role="button" onclick="save()">Save</div>`.
- **Fail:** `<div onclick="save()">Save</div>`.
- **Check:** manual. The control is missing from what can be acted on
  (`snapshot -i`), or shows only as `clickable`; the audit reports what sets a
  pointer cursor with no role.

### 1.2 Custom widgets follow the ARIA patterns (A)
Build tabs, menus, comboboxes, trees, grids, dialogs, accordions and similar
widgets with the roles, states and properties of the
[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/).

- **Why:** Chrome's accessibility tree reads these patterns. A tab with
  `role="tab"` and `aria-selected`, or a tree item with `aria-expanded`, becomes
  a node with the right role and state. An improvised widget doesn't.
- **Pass:** `<div role="tablist"><button role="tab" aria-selected="true" aria-controls="p1">…`
- **Fail:** a row of styled `<span>`s that act as tabs.
- **Check:** manual. Compare against the pattern; the projection shows the role and state.

### 1.3 Every actionable element has an accessible name (A)
Buttons, links, inputs and other controls need a name, from visible text,
`<label>`, `aria-label` or `aria-labelledby`.

- **Why:** the name is how a control is described. An unnamed control reads as
  `button [e44]`, at best with a `hint` from its markup (`hint="trash-2"`), and
  nothing to tell it apart from the next.
- **Pass:** `<button aria-label="Close dialog">×</button>`, `<label>Email <input></label>`.
- **Fail:** `<button><svg>…</svg></button>` with no label; two "Retry" buttons on
  one page (one for a table, one for a chart). Name each by what it acts on:
  "Retry loading campaigns". A checkbox in a list of values named "Mobile
  2,627,393": the name is the value ("Mobile"), the figure its description.
- **Note:** a name that differs from the visible text starts with it (WCAG 2.5.3),
  e.g. a "View report" link named "View report: top channels". A radio card whose
  label wraps a title and an explanation is named by the title
  (`aria-labelledby`) and described by the explanation; otherwise the whole card
  is its name. The same for an option or a row that shows a title and
  secondary text (a channel and its team, a handle and a full name): named by
  the title, described by the rest, wherever the title is drawn (a monitor's
  row that shows its uptime, then its name: named by the name, described by
  the uptime). Text in neither is lost.
- **Note:** a text field with only a placeholder is named by it, as browsers
  name it, but that isn't a label: the placeholder goes as soon as something is
  typed, and a generic one ("Select an item") says nothing. Give the field a
  `<label>` or an `aria-label`; the placeholder can stay as a hint.
- **Check:** automatic: the audit reports it, and a snippet finds it (How to check).

### 1.4 State is exposed, not just shown (A)
Express state through HTML or ARIA: `disabled`, `aria-expanded`,
`aria-pressed`, `aria-checked`, `aria-selected`, `aria-current`, `required`,
`aria-invalid`, `aria-readonly`, `aria-sort`. Don't rely on colour, icons or CSS
classes alone. A native element's own state counts: an open `<details>`, an
indeterminate checkbox, a field the browser's validation rejects.

A toggle button keeps its label and shows its state with `aria-pressed`. A
button whose label says what it will do next ("Pause" ↔ "Resume") has no
`aria-pressed`. Use one or the other, never both
([APG button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)).

- **Why:** Chrome reads these into the node's `states`. A "selected" tab that
  is only styled bold is projected as unselected. With both a changing label and
  `aria-pressed`, a reader can't tell whether "pressed" refers to the old label
  or the new one: an agent kept flipping such a toggle, never sure it was on.
- `aria-current="page"` marks only a link to the page shown. A link to the
  section or list the page sits in gets `aria-current="true"`; breadcrumb
  ancestors and back links get neither. Routers may mark every link whose path
  is a prefix of the current one, or whose query is a subset of it, as the
  current page (TanStack Router's default): match exactly. Otherwise a reader
  sees several "current" pages, such as a sibling tab or "Page 1" while on page 4.
  A view of a page (a breakdown, a sort, a filter, a tab in the query) is not the
  plain page: on `/acquisition?dim=campaign` the sidebar's "Acquisition" link is
  `"true"`, and so is a link to a record's parent when you're on the record.
- **Pass:** `<button aria-pressed="true">Bold</button>`; on `/engagement/events`,
  the Events tab is `aria-current="page"` and the sidebar's Engagement is `"true"`.
- **Fail:** `<button class="is-active">Bold</button>`; `<button aria-pressed="true">Show chart</button>`
  that read "Show table" before it was pressed; a "Channels" tab linking to
  `/engagement` marked `aria-current="page"` while on `/engagement/events`.
- **Check:** manual. The node's `states` match what the screen shows.

### 1.5 Hidden means hidden (A)
Content the user can't currently see or use must be removed from rendering or
from the accessibility tree: `hidden`, `display: none`, `inert`, or
`aria-hidden="true"`. Never put `aria-hidden` on content that is visible and
usable.

- **Why:** Chrome keeps content hidden only visually: `opacity: 0`,
  positioned off-screen, `.sr-only`. A closed panel that is just faded out is
  projected as present. And `aria-hidden` removes everything inside it,
  including focusable controls.
- **Pass:** a collapsed accordion panel with `hidden`; a closed menu with `display: none`.
- **Fail:** a closed menu at `opacity: 0`; `aria-hidden="true"` on a visible toolbar.
- **Check:** manual. Hidden things are absent from the projection, visible things present.
- **Note:** controls shown only while the pointer is over something (a row's
  toolbar, a card's edit button) are hidden until then, and the projection
  rightly leaves them out. Don't render them always: say what shows them
  (1.20).

### 1.6 Decorative and visual-only content is excluded (AA)
Mark decorative icons and images `aria-hidden="true"` (or `alt=""`). Put
`data-agentom-ignore` on purely visual subtrees whose meaning is provided some
other way, such as a chart's drawing when what it shows is said in words
(3.4).

- **Why:** this keeps the view small. Everything inside `data-agentom-ignore`
  is left out, so its changes, such as a chart's animation, aren't reported
  either.
- **Pass:** `<svg aria-hidden="true">…</svg>`; `<div data-agentom-ignore><canvas>…</canvas></div>`.
- **Fail:** icon fonts or SVGs with stray text that ends up in a control's name.
- **Check:** manual. No decorative text in names or `text`.

### 1.7 Tables have headers; sortable columns say so (AA)
Use `<th>` in a `<thead>` for column headers (in an ARIA table, a first row of
`role="columnheader"` cells), and `aria-sort` on the column the table is sorted
by.

- **Why:** a table is read as rows of cells under its column headers. Without
  `<th>` or `role="columnheader"` there are none, and a header row is read as
  data. `aria-sort` is what assistive technology reads for the order, but
  Chrome's tree doesn't carry it to the projection, so a table sorted by a
  column also says so in its caption (1.14).
- **Pass:** `<thead><tr><th aria-sort="ascending"><button>Date</button></th>…`
- **Fail:** a header row made of `<td>`s with bold styling.
- **Check:** manual. The table's first row is `columnheader`s, and its caption names the sort.

### 1.8 Popups and disclosures declare their relationships (AA)
A control that opens or shows something has `aria-expanded`, plus
`aria-controls` pointing at what it controls. Menu buttons add
`aria-haspopup`, valued by what the popup is (`menu` only for a `role="menu"`;
`listbox`, `dialog` and the rest for theirs). Comboboxes and listboxes with virtual focus use
`aria-activedescendant`. Fields with errors use `aria-errormessage` or
`aria-describedby`.

- **Why:** `aria-expanded` and `aria-haspopup` become the trigger's `expanded`
  and `haspopup` states, so a closed popup still shows there is something to
  open. With `aria-activedescendant`, the option it points at is `selected`
  while the field has the focus.
- **Pass:** `<button aria-expanded="false" aria-controls="faq-1">What is it?</button>`.
- **Fail:** a toggle that only flips a CSS class on a sibling.
- **Note:** the projection doesn't carry `aria-controls` or
  `aria-errormessage` as links. Name a field's error message in
  `aria-describedby` too, and it's the field's `description` while the field is
  invalid.
- **Check:** manual. Triggers have `expanded`.

### 1.9 Modal dialogs are marked modal (AA)
Give modal dialogs `role="dialog"` (or `alertdialog`) and `aria-modal="true"`,
name each by its title (`aria-labelledby`), and make the rest of the page
inert while they're open. A native `<dialog>` opened with `showModal()` is
modal and inert already; it still needs its name.

- **Why:** the dialog's node reads `modal`, and with the rest of the page
  inert (as `showModal()` makes it), what's behind it is out of the projection,
  so nothing behind it is offered to act on. `aria-modal` alone doesn't take
  the page behind out of Chrome's tree.
- **Pass:** `<div role="dialog" aria-modal="true" aria-labelledby="t">…</div>`;
  `<dialog aria-labelledby="t">…</dialog>` opened with `showModal()`.
- **Fail:** a dialog `<div>` drawn over the page with no role.
- **Check:** automatic: while it's open, the audit reports a dialog with no
  name, and a layer over the page with the page usable under it and nothing
  marked modal.

### 1.10 Status and loading are exposed (AA)
Announce results and messages with `role="status"` or `role="alert"`. Mark a
region being updated with `aria-busy="true"` until it's done.

- **Why:** live regions are kept with their text, and `aria-busy` becomes the
  node's `busy` state. The tool, an app's own agent and the audit wait while
  anything on the page is `aria-busy="true"` before they read it, so loading
  that makes no request (a timer, a worker) is waited for too. A spinner with
  no ARIA tells a reader nothing.
- **Pass:** `<div role="status">Link saved</div>` (it names what it's about, 1.18); `<section aria-busy="true">…`.
- **Note:** for a live feed, announce what changes the meaning (connected,
  reconnecting, paused), not every update; keep the feed itself out of live
  regions and let it be paused (WCAG 2.2.2).
- **Fail:** a toast that is only a styled `<div>`.
- **Check:** manual.

### 1.11 Links navigate, buttons act (A)
Use `<a href>` for anything that takes the user somewhere (another screen, a
page, a section), and `<button>` for anything that does something on the
current screen (apply, save, open a dialog, toggle).

- **Why:** a link is projected with its destination (`href: "/checkout"`), so
  where it leads is known before using it. A `<button>` that navigates in script
  has no destination a reader can see.
- **Pass:** `<a href="/checkout" data-agentom-id="cart.checkout" data-agentom-action="checkout">Checkout</a>`.
- **Fail:** `<button onclick="router.push('/checkout')">Checkout</button>`; the
  other way round, `<a href="#" @click.prevent="pause">Pause</a>`, which reads
  as a link to the top of the page.
- **Check:** automatic for a link that goes nowhere and acts (`href="#"` with a
  click listener, a `javascript:` address: the audit's `link-acts`); otherwise
  manual. Navigation controls have `role: link` and an `href`.

### 1.12 Content people ask about is named and readable (AA)
Cards and panels that show information (a metric, a chart, a summary) have an
accessible name, e.g. `role="group"` or `role="region"` with `aria-labelledby`
pointing at their title, and its value as shown in its description
(`aria-describedby`).

- **Why:** a reader answering "what's the bounce rate?" finds the element by
  its name and reads its description. Generic fields (name, value,
  description, text) mean the same on every app.
- **Pass:** `<div role="group" aria-labelledby="l" aria-describedby="v" data-agentom-id="kpi.bounce">`
  with `<dt id="l">Bounce rate</dt><dd id="v">45.9%</dd>` inside.
- **Fail:** a metric card whose label is only drawn, with no name an agent or a screen reader gets.
- **Check:** manual. Content nodes have a `name` and, where they show a value, a `description`.

### 1.13 Navigation names the pages it doesn't list (AA)
A navigation item whose sub-pages aren't currently listed (shown only once
you're in the section, or behind a collapsed disclosure) names them with
`aria-describedby`, pointing at an element that lists them. That element can be
`hidden`: a description may reference hidden content.

- **Why:** sub-pages that aren't rendered are absent from the projection (1.5),
  so nothing says "Events" is under "Engagement" until each section has been
  opened. The description is projected as the link's `description`. WCAG
  doesn't ask for this (a collapsed disclosure only exposes its state, 4.1.2);
  it's for readers that plan a route before taking it.
- **Pass:** `<a href="/engagement" aria-describedby="nav-pages-engagement">Engagement</a>`
  with `<span id="nav-pages-engagement" hidden>Pages: Pages, Entry and exit pages, Events</span>`.
- **Fail:** an "Engagement" link whose Pages, Entry and exit pages and Events links
  appear only after going to `/engagement`, with nothing naming them before.
- **Note:** drop the description while the sub-pages are listed, and build it
  from the same data as the sub-menu so the two can't drift.
- **Note:** the same holds for collapsed breadcrumbs (a "…" menu: its button names
  the hidden levels) and for a page that is also a branch of a tree: give it a
  link and a separate disclosure button (APG disclosure navigation, "hybrid"),
  and keep the button's label constant: `aria-expanded` says open or closed (1.4).
- **Check:** manual. On every screen, each section link with sub-pages either has
  them listed or names them in its `description`.

### 1.14 Partial and remote data says what it shows (AA)
A table that shows one page of a larger, server-side result names the slice in
its caption: what narrows it (the search text and the filters), what is
sorted, which page, which rows of how many ("Campaigns matching 'newsletter'
where Status is Active, sorted by Revenue (descending), page 2 of 3 (26–50 of
61)"). From the moment a change is made until its result is shown, the table
(or its region) is `aria-busy="true"` and a `role="status"` line says so
("Updating campaigns…"); a search that runs once typing pauses is pending from
the first keystroke, not only while its request runs. Then the status line
states the result, naming what narrows it too ("Showing 26–50 of 61 campaigns
matching 'newsletter' where Status is Active"). A failed request is a
`role="alert"` with a control to retry it. Search, sort, filters and page are
in the URL, so pages and views are links (1.11).

- **Why:** the projection only sees the rows rendered, and the view cuts a long
  run of rows to its first and last with a count of the rest, so the total and
  the order exist only if the page says them. Without `aria-busy`, rows from before a sort or a filter look current
  while the new ones load, and a search waiting for typing to pause looks like
  one that found the old rows. Without the search and filters in the caption,
  "31 campaigns" and a search box reading "newsletter" are two separate facts:
  nothing says the one is the result of the other.
- **Pass:** the dashboard's campaign list (`ReportTable`): caption with the
  slice and what narrows it, `aria-sort` on the sorted header, `aria-busy` from
  the keystroke until the rows arrive with the previous rows kept, a status
  line, an alert with "Retry loading campaigns". The same holds for any list a
  search or filter narrows (the help search: "4 pages found for 'match type'").
- **Fail:** a table that swaps in a spinner and back with no `aria-busy`; a
  caption "Campaigns" on page 7 of 24; "Showing 1–25 of 31 campaigns" with the
  search that narrowed it named nowhere; a search box that waits for typing to
  pause with nothing busy meanwhile; an error shown only as a red border.
- **Virtual lists** (only the rows in view rendered): `aria-rowcount` on the
  table and `aria-rowindex` on each row, the size in the caption, and the space
  of the rows not rendered as space (padding or margins), never as empty rows.
  The scrolling container is a named, focusable region so the keyboard can
  scroll it.
- **Check:** manual. Change the sort or page with a slow network (dashboard
  Settings → Network simulation) and compare the projection while loading and after.

### 1.15 Search fields say what they match (AA)
A field whose text searches or narrows a list has a description
(`aria-describedby`) that says what it searches and how text matches: which
items and which of their fields, the rule (contains every word, starts with,
exact phrase, fuzzy), and whether results update as you type or on Enter.

- **Why:** whoever uses the field has to choose the text. The label says what
  the field is ("Search campaigns by name"); only the rule says what's worth
  typing. When every word has to appear, "open source" finds "Open Source
  Sponsorship" and "any open source" finds nothing.
- **Pass:** `<input role="searchbox" aria-label="Search campaigns by name"
  aria-describedby="campaign-search-hint">` with `<span id="campaign-search-hint"
  hidden>Shows campaigns whose name contains every word you type, in any order,
  ignoring case. Results update as you type.</span>`.
- **Fail:** a search box with only a placeholder ("Search…"); a description that
  names the items but not the fields or the rule.
- **Note:** visible help text or a `hidden` element referenced by
  `aria-describedby` both work (a description is read even when its element is
  hidden). Write the rule from the code that does the matching, so the two can't
  disagree.
- **Check:** automatic for presence: every `searchbox`, and every text field
  inside a `search` landmark, has a `description` (How to check). Manual for
  whether it states the rule correctly.

### 1.16 Controls that open choices name them (AA)
A control that opens a popup of choices (a custom select, a menu button, a
filter popover) names what it offers in a description (`aria-describedby`),
pointing at an element that lists them: "Choices: Last 7 days, Last 30 days,
Last 90 days", "Actions: Edit settings, Pause, Archive". For choices that aren't
a list, say what's asked: "Range: a minimum and a maximum ROAS". A native
`<select>` needs nothing: its options are in the tree, and the view lists them
as `choices:`. A control that
opens a dialog does this when the dialog holds choices (a filter, a date
picker); one that opens a dialog for a task (a form: "Create team") needs
nothing beyond its name.

- **Why:** the choices are only rendered once the popup opens, so they're
  absent from the projection until then (1.5). Without them, whoever plans has
  to open each popup to find out what's in it, or guesses: a filter that only
  says "Filter by Status" can't be told apart from one that would match the
  goal. The description is projected as the control's `description`. WCAG
  doesn't ask for this; like 1.13, it's for readers that plan before acting.
- **Pass:** `<button aria-haspopup="menu" aria-label="Colour theme: system" aria-describedby="theme-choices">`
  with `<span id="theme-choices" hidden>Choices: Light, Dark, System</span>`.
- **Fail:** a "Filter by Status" popover button with nothing saying it offers
  Active, Paused, Scheduled and Ended; a "More actions" menu button that names
  none of its actions.
- **Note:** build the description from the same data as the popup's choices, so
  the two can't drift. Leave out what changes with every use (a search's
  results); name the kind of choice instead.
- **Check:** automatic for presence: every node with a `haspopup` other than
  `dialog`, and every `combobox` with no options inside it, has a `description`
  (How to check). Manual for a control that opens a dialog (choices, or a
  task?), and for whether a description lists what the popup offers.

### 1.17 Figures people read are shown settled (AA)
A figure people read (a total, a rate, a count in a table) shows its value as
soon as it has it, not counting up or easing towards it.

- **Why:** a reader that takes the page as it is, a screenshot or the text of
  the page, reads the figure while it moves and reports a number that was
  never the value: 29% for a rate of 31%. The page gives no sign it's still
  moving, and a settled value in a tooltip or a `title` isn't the text that's
  read. WCAG 2.3.3 (Animation from Interactions) asks that motion can be
  turned off; here it's off for the figures themselves.
- **Pass:** a metric card that renders "31%" when its data arrives; motion
  kept for what isn't read (a bar growing to its width beside its figure).
- **Fail:** a spring-animated number that counts from 0 to 13,241 over a
  second, with the final value only in its `title`.
- **Check:** manual: load a page, and read its figures in the first frame after
  the data arrives.

### 1.18 Notices name what they report (AA)
A notice (a toast, a status message) says what happened to what: "Board
created", "Link saved", not a bare "Saved".

- **Why:** a notice outlives its action. It stays up for seconds, often across
  a page change, so a reader that takes the page as it is (the projection, the
  page's text, a screenshot) finds it next to whatever comes after. A bare
  "Saved" beside a board editor whose changes aren't saved yet reads as "this
  is saved": an agent then skips the editor's own Save. A person remembers
  which action it followed; a reader of the page as it is can't. WCAG 4.1.3
  (Status Messages) asks that status messages are announced; this asks that
  they say what they're about.
- **Pass:** `<div role="status">Board created</div>`, shown on the board's new
  editor page.
- **Fail:** one "Saved" message for every form in the app.
- **Check:** manual: list the app's notices, and read each away from the action
  that shows it.

### 1.19 Editable areas say whether their changes are saved (AA)
An area whose changes are kept only when they're saved (a layout editor, a
form saved as a whole) is a named region whose description says whether it
has unsaved changes, and the control that saves it says what it keeps.

- **Why:** an editor shows its changes as soon as they're made, saved or not,
  so a reader of the page can't tell them apart: an agent that had built a
  board's layout took it for kept and left without the editor's own Save, and
  another reloaded the page to check, losing it. ARIA has no state for unsaved
  changes, so the region's description carries it. The markup is required;
  whether the screen shows it too is a design decision.
- **Pass:** `<section role="region" aria-label="Board layout"
  aria-describedby="s">` with `<span id="s" hidden>Unsaved changes: the rows
  and components here are kept only when the board is saved.</span>`, which
  reads "No unsaved changes" once saved; its Save described by "Saves the
  board's rows and components".
- **Fail:** an editor whose only sign of unsaved changes is the user's memory
  of having made them.
- **Check:** manual: change something in the area and read its description;
  save, and read it again.

### 1.20 Controls shown on hover are declared by what reveals them (AA)
An element whose hover shows controls that aren't rendered otherwise (a
message's actions, a row's options menu) has a `data-agentom-id` and
`data-agentom-reveals` naming those controls by their accessible names,
separated by commas; a name that carries the row's own name ("Channel options
for Town Square") by its fixed words ("Channel options"), since a row's name
can hold commas. The controls stay as the app shows them. A menu item
whose submenu opens on hover has `aria-haspopup="menu"`.

- **Why:** until the pointer is there, those controls are in no
  accessibility tree and no projection, and nothing says they exist: an agent
  looking for "Reply" finds nothing to click. Rendering them always changes
  what people see and do (the Tab order of every row, what the mouse covers).
  Declared, an agent hovers over the element as a person does, with a real
  pointer, and the controls appear in the projection under the names it was
  told.
- **Pass:** `<div role="article" aria-label="Message from Ada"
  data-agentom-id="post.k3x9" data-agentom-reveals="Reply, Add reaction,
  Message actions">`, its toolbar rendered on hover as before; a message the
  user can't react to doesn't list "Add reaction".
- **Fail:** the same toolbar with nothing saying it's there; or rendered
  always and faded in on hover, which puts its buttons in every message's Tab
  order.
- **Check:** automatic for the form (`invalid-value`, `metadata-without-id`);
  manual: hover over each element that declares it, and compare what appears
  with its `reveals`.

---

## Principle 2: Identifiable

What the app means by a thing has a name that lasts, and things of one kind
can be told apart.

### 2.2 Ids describe meaning and are stable (AA)
Where an element has a `data-agentom-id` (it carries metadata, or something
requires it), write it as dot-separated, lowercase, kebab-case segments:
`area.thing` (`cart.checkout`, `payment.card-number`, `account.logout`).
Never use positions, indexes, generated values or framework names.

- **Why:** an id is a contract with whatever reads the page: a requirement
  points at it (3.7), an app's own agent or tests name it. `row-17`, `btn-3` or
  `CartButton` break when the UI changes, or leak implementation. (A ref, the
  handle an agent acts on, is the reader's own and lasts while the element
  does; an id says what the element is, on every visit.)
- **Pass:** `coupon.apply`, `orders.export-csv`.
- **Fail:** `btn-3`, `order-row-17`, `handleSubmit`, `react-cart-button`.
- **Check:** manual (not validated).

### 2.3 Explicit ids are unique on a screen (AA)
Don't use the same `data-agentom-id` twice on one screen. For repeated items, put
the item's own identity in the id (`order.1042.edit`), not its position.

- **Why:** an id on two elements names neither: a requirement on it can't say
  which, and it's reported (`duplicate-id`).
- **Note:** content the app didn't write (a comment, a user's profile, an email
  shown as HTML) mustn't carry `data-agentom-*` attributes: strip them when you
  sanitise it (sanitisers keep `data-*` attributes by default), or it can give
  itself an id your controls use, and the metadata that goes with it.
- **Check:** automatic (`duplicate-id`).

### 2.6 Repeated items are a declared collection (AA)
A list of things of one kind (messages, products, search results, a
sidebar's channels) is a `list` or `feed` with a name, each item a `listitem`
or `article` named by what tells it apart (its author and time, its title). A
control repeated in every item sits inside its item, and where it's named on
its own, it's named for its item ("Reply to Ada's message"). What hovering
over an item shows is declared on the item (1.20).

- **Why:** the view reads a list item by item, cuts a long run of alike items
  to its first and last with a count of the rest, and says of every change
  which item it's in ("in article "Message from Ada, 9:12 AM""). Unnamed `div`s
  give none of that: thirty "Save" buttons with nothing saying whose.
- **Note:** an item has the controls it has: a message has Edit only if it's
  yours, a reply count only when it has replies. Give an item a
  `data-agentom-id` from its own identity (`post.<id>`) where something points
  at it or the app's own tools need it.
- **Pass:** `<div role="feed" aria-label="Messages"><article aria-label="Message from Ada, 9:12 AM">…<button aria-label="Save Ada's message">…`
- **Fail:** messages in an unnamed `div`; items named only "Message"; a
  "Save" button in every message with nothing saying whose.
- **Check:** manual. The view shows the list by its name and each item by what
  it is.

---

## Principle 3: Meaningful

Say what things mean, so nothing has to be inferred.

### 3.1 Metadata describes meaning, not implementation (A)
`data-agentom-kind`, `-action` and `-purpose` (and their `useSemantic`
equivalents) state meaning in kebab-case. Never use function,
component or library names.

- **Why:** whatever reads the projection knows nothing about your code. The
  readers don't check kebab-case: a value is projected as written.
- **Pass:** `data-agentom-action="cancel-subscription"`, `data-agentom-kind="metric"`.
- **Fail:** `data-agentom-action="handleCancel"`, `data-agentom-kind="CartButton"`, `action="click-this-button"`.
- **Check:** manual (review the values in use).

### 3.2 Metadata sits on an element with an id (A)
Every metadata attribute (`data-agentom-kind`, `data-agentom-desc`,
`data-agentom-value`, `data-agentom-action`, `data-agentom-purpose`,
`data-agentom-risk`, `data-agentom-confirmation`, `data-agentom-requires`,
`data-agentom-reveals`) goes on an
element that also has `data-agentom-id`. (The safety attributes
`data-agentom-ignore` and `data-agentom-redact` are the exception: they work on any
element.)

- **Why:** the readers read metadata on any element, but an id is what names
  the thing the metadata describes: what a requirement points at (3.7), what
  stays the same on every visit while refs don't.
- **Check:** automatic (the audit's `metadata-without-id`).

### 3.3 Significant actions declare what they do (AA)
Give important actions `data-agentom-action` with a verb phrase. Add
`data-agentom-purpose` where the goal isn't obvious from the action.

- **Pass:** `<button data-agentom-id="cart.checkout" data-agentom-action="checkout" data-agentom-purpose="proceed-to-payment">Checkout</button>`.
- **Check:** manual.

### 3.4 A drawn chart says what it shows in words (AA)
Charts, graphs, maps and other drawn data say what they show in a sentence or
two that every reader gets, assistive technology too: the main facts (the
peak, the low, the trend, the total), as the chart's description
(`aria-describedby`, or a `<figcaption>`). The drawing itself is marked
`data-agentom-ignore` (1.6); the summary never is.

- **Why:** SVG and canvas pixels carry nothing an agent or a screen reader can
  use, and most questions about a chart are about its main facts. A summary is
  a few lines of code from data the app already has, read by every reader and
  every agent's tool, and it costs a reader a line, not the chart's every
  point.
- **Pass:** a chart card named by its title and described by "Visitors peaked
  on Sep 23 at 129,648 and was lowest on Sep 20 at 98,123; 3,525,831 in all",
  its drawing in `data-agentom-ignore`.
- **Fail:** a chart whose meaning is only in its pixels.
- **Check:** manual.

### 3.5 An exact value where the shown one loses it (AAA)
A shown value is the data: an agent reads "1,286,172", "28.4%" and "Oct 21, 2026"
as they are. Only where the display loses something (a shortened number,
"112.9k", "$7.2M"; a time shown in part or relative to now, "3 days ago", "Tue") give the exact
value, on the element that shows it, with HTML's own elements:
`<time datetime="2026-11-19T14:02Z">3 days ago</time>`,
`<data value="112934">112.9k</data>`. `data-agentom-value` is for an element
that can't be one of those. Don't copy what's already shown elsewhere.

- **Why:** the exact value can be compared and computed with; the view shows it
  beside the element's own text (`time "3 days ago" … data="2026-11-19T14:02Z"`),
  which keeps what the user sees. A copy of what's shown says it twice, in more
  of the model's context, and a long one is cut short.
- **Pass:** `<td><data value="112934">112.9k</data></td>`; `<time datetime="2026-11-19">3 days ago</time>`.
- **Fail:** a `data-agentom-value` that only repeats what the element shows
  ("1,286,172" and 1286172); "3 days ago" with no date behind it.
- **Check:** manual.

### 3.6 One vocabulary across the app (AAA)
Use the same `kind` and `action` words for the same things everywhere: one
`metric`, not `metric`/`kpi`/`stat`.

- **Check:** manual (review the set of kinds and actions in use).

### 3.7 Task dependencies are declared (AA)
When an action only makes sense after other things are done, say so. Within one
form, use a real `<form>` with `required` (or, on a field that hasn't got it,
`aria-required="true"`) fields: that's already projected (`form` on every
member, `state.required` on the fields). For anything a form
can't express (across sections, across steps, non-field prerequisites), use
`data-agentom-requires` with the ids it depends on.

- **Why:** a long task (checkout, onboarding, setup) can then be followed step
  by step: what's required, and which of it is done, comes straight from the
  projection instead of being guessed.
- **Pass:** `<button data-agentom-id="order.place" data-agentom-requires="shipping.address payment.card-number">Place order</button>`.
- **Fail:** a "Place order" button that silently stays disabled until an
  unnamed set of things elsewhere on the page is filled in.
- **Multi-step flows:** the fields of earlier steps are gone by the last one, so a
  requirement on them can't resolve. Show what they set on the last step, each
  value as a node with an id (and `data-agentom-value`), and require those:
  `<button data-agentom-requires="goal-wizard.review.kind goal-wizard.review.name">Create goal</button>`.
- **Check:** automatic for typos and ids that don't exist on the current screen
  (`unresolved-requirement`); manual for completeness.

---

### 3.8 A chart's values are a step away as a table (AAA)
Where people need a chart's exact values (a day's figure, a row of a
breakdown), give them as a data table (`<table>` with a `<caption>` and
`<th scope>`) one step away: a table view the chart switches to, or a control
that shows it. Not always on the page: a chart's every point, on every read,
costs a reader far more than it usually needs.

- **Why:** the summary (3.4) answers most questions; a table answers the
  rest, to an agent and to a screen reader alike, the same accessible
  alternative Chrome's Modern Web Guidance gives for charts. Behind a control,
  a reader takes it only when a task needs it, as a person does.
- **Pass:** a chart card with a "Table" toggle (`aria-pressed`) that shows its
  days and values as a table.
- **Check:** manual.

## Principle 4: Safe

Safety must never be left to inference.

### 4.1 Destructive actions are marked (A)
Actions that delete data, cancel things, spend money or can't be undone carry
`data-agentom-risk="destructive"`.

- **Why:** `risk` is the only signal that an action is dangerous. Nothing
  infers it from words like "Delete".
- **Pass:** `<button data-agentom-id="account.delete" data-agentom-risk="destructive">Delete account</button>`.
- **Fail:** the same button with no `risk`.
- **Check:** manual. Review every action that changes data.

### 4.2 Actions that need confirmation say so (A)
If an action must be confirmed before it runs, add
`data-agentom-confirmation="required"`, projected as `confirm`.

- **Why:** a reader that acts on the page asks the user first: the tool
  refuses the action until it's told the user asked for it, an app's own agent
  asks through the app.
- **Check:** manual.

### 4.3 Consequential or sensitive actions are marked sensitive (AA)
Use `data-agentom-risk="sensitive"` for actions that are consequential or touch
sensitive data but can be recovered: paying, sending a message, publishing,
sharing personal data, changing a setting that affects others. (`safe` is the
default and needs no marking.)

- **Check:** manual.

### 4.4 Risk is marked on the control itself (A)
Put `risk` and `confirmation` on each risky control, not on a surrounding
container.

- **Why:** metadata isn't inherited. A destructive "danger zone" section doesn't
  make the buttons inside it destructive.
- **Check:** manual.

### 4.5 Secrets are never exposed (A)
Password fields use `type="password"`. Card numbers, security codes and one-time
codes use the matching `autocomplete` tokens (`cc-number`, `cc-csc`, `cc-exp`,
`cc-exp-month`, `cc-exp-year`, `one-time-code`, `current-password`,
`new-password`), on an `<input>`, a `<select>` or a `<textarea>`. Any other
secret field the app has (account numbers, national ids) gets
`data-agentom-redact`, on the field or on an element around its fields.
Sensitive text shown on the page that shouldn't be projected goes inside
`data-agentom-ignore`; `data-agentom-redact` on text is kept out too, but
the audit reports it.

- **Why:** a projection may be sent to a model or a server. A secret field's
  value is never projected (`secret=filled` instead), and taken out of every
  other string, but only if the field can be told to be secret.
- **Pass:** `<input type="password">`; `<input autocomplete="cc-number">`;
  `<input data-agentom-redact aria-label="Account number">`.
- **Fail:** a card-number field as a plain `<input>` with no `autocomplete`.
- **Note:** a "show password" toggle switches the field to `type="text"`. A
  field with `autocomplete="current-password"` (or `new-password`) stays
  redacted while shown; one without it gets `data-agentom-redact`, which keeps
  it out without changing what the browser offers to fill or save.
- **Note:** `current-password` and `new-password` make a field a password to
  every reader, whatever its type: an agent can't read what it holds, and only
  the user can fill it in. On a field that isn't a password (a server address
  given `new-password` to keep the browser from filling it in), they keep the
  field from agents too.
- **Note:** the page's address is projected as it is (`url`), so a secret in
  it, such as a reset link's token or a sign-in code, is projected too. Keep
  secrets out of URLs.
- **Check:** automatic for `type="password"` and `autocomplete` secrets (built
  in), the audit's `password-token` for a password token on a field that isn't a
  password field, and its `redact-without-field` for the attribute on text;
  manual for app-specific fields.

---

## Principle 5: Contextual

Individual controls aren't enough; say where the user is.

### 5.1 The page title is meaningful and current (A)
Keep `document.title` describing the current screen, and update it on
client-side navigation.

- **Why:** it's the projection's `title`, the first thing a reader is told of a page.
- **Check:** manual.

### 5.2 Screen and state are declared in markup (AA)
Declare the screen (a stable, dotted name for the current screen) and its
state (`loading`, `ready` or `error`) as attributes: `data-agentom-screen` and
`data-agentom-state`, on `<html>`, `<body>` or the element that holds the
screen (the first in the document counts). Derive the screen from something
stable, such as a route id, not a visible label. Every reader sees them: an
agent's tool reading the page from outside, an extension, the audit.

- **Why:** a reader waits for `loading` to pass before it trusts what the page
  says, and knows which screen it's on whatever the page's address.
- **Pass:** `<main data-agentom-screen="checkout" data-agentom-state="ready">`;
  `data-agentom-state="error"` while the screen shows a failure to load.
- **Check:** automatic, every screen declares `data-agentom-screen`.

---

## Principle 6: Navigable

A page's projection shows that page. What lies elsewhere in the app, and where,
comes from a **semantic sitemap**: the app's pages as a tree of path templates
([sitemap.md](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/sitemap.md)). A reader in the page gets to a page through the
links on the pages in between; one that can load a page by its address goes
straight there (6.6).

### 6.1 The app publishes a semantic sitemap, generated from its routes (AA)
Produce the map from the source of truth for your pages (your router's route
config, your server routes, a build step over your page files), not by hand.
Publish it at `/semantic-sitemap.json` and link it from every page with
`<link rel="semantic-sitemap" href="/semantic-sitemap.json" type="application/json">`.
How you generate it is up to you; its shape, rules and location are fixed
([sitemap.md](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/sitemap.md)).

- **Why:** a hand-written map drifts from the app. A generated one can't list a
  page that doesn't exist or miss one that does. A fixed, linked location lets
  any consumer find it, as with `sitemap.xml`.
- **Pass:** the dashboard generates `public/semantic-sitemap.json` from its TanStack
  route tree whenever the routes change, and fails its build on an invalid map.
- **Fail:** a `semantic-sitemap.json` maintained by hand next to the routes; a map
  only available to code running in the page.
- **Check:** automatic for the format: `validateSitemap(map)` returns no warnings
  (How to check). Manual for how it's produced.

### 6.2 Every page a user can reach is on the map; the app's own tooling isn't (AA)
Each page appears once, as a template: `campaigns/{campaignId}`, never one entry
per campaign. Leave out pages that aren't part of the app a user works in: the
host's own agent or developer controls.

- **Pass:** `/campaigns/c-12/ad-groups/g-3` is located at
  `campaigns › {campaignId} › ad-groups/{adGroupId}`; the dashboard's
  network-simulation settings are left out.
- **Note:** the file is public. Leave out pages whose existence shouldn't be
  advertised; whether a user may open a page is for that page to show, not the map.
- **Fail:** a page that's linked from the app but missing from the map; a map that
  lists every campaign.
- **Check:** automatic. On every screen, `locate(map, path, query)` finds a node,
  except for the pages you leave out on purpose.

### 6.3 A page's path or name says what it is (AA)
Use path segments that are words (`billing`, `ad-groups`), and give a page a
`name` when its path doesn't say what it is: an index page shown under another
title (`conversions` is "Key events"), an opaque segment (`/p/{id}`). Name params
by what they identify (`{campaignId}`), unless the segment before them already
does (`blog/{slug}`).

- **Why:** the map has no descriptions. A reader matches the words of a goal
  ("edit my profile") against paths and names.
- **Pass:** `settings: Profile`; `users: Users & teams`; `{userId}`.
- **Fail:** `/settings` showing a profile page with no name; `/x/{id}/{id2}`.
- **Check:** manual.

### 6.4 Views with distinct content are in the URL and declared (AAA)
When a page has views that show different content (tabs, a "break down by"
choice, an archived list), keep the choice in a query param and declare its
values as the page's `views`. State that only narrows or orders the same content
(sort, filters, page, search text, date range) is not a view: the page's own
projection shows it.

- **Why:** a view that lives only in component state, or isn't declared, is
  invisible from elsewhere: nothing says an ad group has keywords until you open
  one.
- **Pass:** `ad-groups/{adGroupId} ?tab=ads|keywords|settings`;
  `acquisition ?dim=channel|source|…`, with the declared values taken from the same
  constant the route's search validation uses.
- **Fail:** a Keywords tab held in `useState`; `?sort=` declared as a view.
- **Check:** manual. The dashboard also checks that every declared value passes its
  route's search validation.

### 6.5 The map says what a page holds, when people look for it elsewhere (AA)
When content people ask about lives on pages of one kind, not on a page of its
own (a store's shipping and returns policy, in each product's "Shipping &
Returns" panel), the map's node for that kind of page names it in `holds`.
Hints are names of the page's parts, generated from the rendered pages, a few
words each (at most 40 characters), never one page's data or the frame every
page shares.

- **Why:** the map says a product page exists, not what it holds. Asked for
  "the store's returns policy", a reader looks for a policy page, finds none,
  and answers there is no policy. A hint costs a few words per kind of page; a
  description per page would be prose to keep true.
- **Pass:** `products/{handle} — holds: Product Information, Shipping & Returns, Size choices`,
  generated by projecting two products and keeping the names both show.
- **Fail:** hints written by hand next to the route; "Medusa T-Shirt" (one
  product's title); "Every order ships within three to five business days" (a
  sentence, not a name).
- **Check:** automatic for length and emptiness (`long-hint`, `empty-field`);
  manual for whether content people look for elsewhere is named.

### 6.6 Every page on the map opens at its address (AA)
Load each page on the map whole from its address, its views' query included,
as when someone opens a bookmark: signed in, it shows the page, not a blank
screen or a redirect to the start. What the page needs comes from the server
or the browser's storage, not from a page visited before.

- **Why:** an agent that can open a page by its address (as browser agents
  can) goes from the map straight to the page it needs. A page that only
  renders after the app was entered elsewhere fails it, and a person's
  bookmark too.
- **Pass:** `/campaigns/c-12/ad-groups/g-3?tab=keywords`, opened in a new
  tab, shows that ad group's keywords.
- **Fail:** `/reports/{reportId}` showing "Not found" unless the reports list
  was opened first (the report held only in memory); a route that 404s on the
  server and works only after a client-side navigation.
- **Check:** manual: open each page on the map in a new tab, its params filled
  with real ids, and see that it shows that page.

---

## How to check

**The audit.** `@agent-om/audit` checks the screen a live page shows against
these criteria: it reads what an agent's tool reads (the projection from
outside, with Chrome's tree and the DOM), and reports each finding under its
criterion. Start a browser on the app (`npx @agent-om/audit start`, in the
app's folder), open a screen, and `check`; its skill
(`agent-om-audit`) goes through an app's screens and writes a report, and the
apply skill (`agent-om-apply`) turns one into markup changes.

**Warnings.** The projection carries warnings about the app's metadata; the
audit adds two it finds in the markup. Treat them as failures in development
and tests:

| Code | From | Criterion |
|---|---|---|
| `invalid-value` | the projection | 4.1–4.3 for `risk` and `confirmation`; 5.2 for a `data-agentom-state` that isn't one of its values |
| `duplicate-id` | the projection | 2.3 |
| `unresolved-requirement` | the projection | 3.7 |
| `metadata-without-id` | the audit | 3.2 |
| `redact-without-field` | the audit | 4.5 |

The sitemap has its own check, `validateSitemap(map)` ([sitemap.md](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/sitemap.md)):
`invalid-path`, `duplicate-path`, `empty-field` and `invalid-field` all fail
6.1; `long-hint` fails 6.5.

**Snippets** on the projection, read in the page with core's walk
(`walk()` from `@agent-om/core`; read from outside, as the agent-om tool and
the audit read it, the projection is the same):

```ts
import { walk } from '@agent-om/core'
import { CONTROLS, type OmNode } from '@agent-om/core/view'
import { locate } from '@agent-om/core/sitemap'

const page = walk()
const all = (n: OmNode): OmNode[] => [n, ...(n.children ?? []).flatMap(all)]
const nodes = all(page.root)

// 2.3, 3.7, 4.1–4.3: what's wrong with the metadata
const problems = page.warnings ?? []

// 1.3: controls without a name
const unnamed = nodes.filter((n) => CONTROLS.has(n.role) && !n.name)

// 1.15: search fields without a description of what they match
const searchFields = (n: OmNode, inSearch = false): OmNode[] => [
  ...(n.role === 'searchbox' || (inSearch && n.role === 'textbox') ? [n] : []),
  ...(n.children ?? []).flatMap((c) => searchFields(c, inSearch || n.role === 'search')),
]
const undescribed = searchFields(page.root).filter((n) => !n.description)

// 1.16: controls that open choices without naming them
// (a dialog is manual: choices, or a task?)
const hasOptions = (n: OmNode) => all(n).some((c) => c.role === 'option' || c.role === 'MenuListOption')
const opensChoices = (n: OmNode) => (typeof n.states?.haspopup === 'string' && n.states.haspopup !== 'dialog') || (n.role === 'combobox' && !hasOptions(n))
const unlisted = nodes.filter((n) => opensChoices(n) && !n.description)

// 1.9: a modal dialog, named, while one is open
const modal = nodes.find((n) => n.states?.modal)

// 5.2: the screen declared
const hasScreen = typeof page.context?.screen === 'string'

// 6.2: the current page is on the sitemap (`map` is your app's)
const url = new URL(page.url)
const onMap = !!locate(map, url.pathname, Object.fromEntries(url.searchParams))
```

**Review.** Read the view an agent reads: `agent-om-audit view` on a screen of
the app, or `agent-om snapshot` on any page with the agent-om command-line
tool.

**Tests.** Render a screen in a browser test, read it with `walk()`, and
assert the ids, states and context you depend on, and that the projection
carries no metadata warnings.

---

## Pitfalls in real apps

Met while applying these guidelines to eight open-source apps built with
Next.js, React Router, Vite, Laravel and PHP, on Ant Design, Mantine and
Headless UI, and to Umami (Next.js, on react-zen, built on Base UI). Each is a way a
common library or pattern breaks a criterion, and what fixed it.

**Libraries that drop or bend what you give them**
- **Mantine:** an input (`TextInput`, `NumberInput`, `Select`) replaces an
  `aria-describedby` you pass with its own. Give the text as its
  `description` prop, hidden with `styles` when it shouldn't show (1.15,
  1.16). A `Modal` is named only by a mounted `Modal.Title`; an
  `aria-labelledby` you pass is overwritten (1.9).
- **Headless UI:** `ListboxButton` drops an `aria-describedby`; use its
  `Field` and `Description` (1.16).
- **Ant Design:** icons put their names into control names (hide them, 1.6);
  custom pickers drop the `id` their form label points at, leaving the field
  unnamed (1.3); `Content` is already a `main` (1.1); virtual lists render
  options without a role and keep hidden copies of them (`virtual={false}`,
  1.2, 1.5).
- **Drag and drop:** a handle's listeners spread over a whole container make
  it one button holding everything inside it. Put them on a handle (1.1).
- **Tag inputs** that can't name their remove buttons often can through a
  custom tag renderer (1.3).

**Loading and settling** (1.10, 5.2)
- Say loading for everything not yet done: a fade, modules still loading, a
  navigation pending. A reader that waits for the page to settle sees only
  the projection.
- **Server-rendered apps:** the server's HTML is there before the app has
  hydrated and can be used. A React Router route without a loader is
  `initialized` at once, so report loading until the app has hydrated.
- A render error caught by a route's error element never reaches the
  router's state: have the error page report `error` itself.
- **Next.js server actions:** an action's promise resolves before the router
  shows its refresh, so run it in a transition and count the transition as
  loading. A `redirect()` from an action commits the new address with an
  empty page before fetching it, with no loading boundary shown: navigate
  from the client instead.

**Structure and naming**
- **Repeated labels:** a form with the buyer's and each attendee's "First
  Name" names each field for whom ("First Name: Attendee 2"), not only by
  its group: readers address a field by its name (1.3).
- **Long prose:** the view cuts a line at 300 characters. A description
  written with headings becomes regions named by them, so each part is found
  by its name (1.12).
- **What only a control says** (a disclosure's name, a radio's value, a
  drop-down's description) is easy to miss for a reader judging whether it has
  found the answer. When people ask about it, list it as content too: a
  visually hidden "Size choices: S, M, L, XL" (1.12).
- **Covering panels:** a backdrop or a welcome panel that takes every click is
  a modal dialog; otherwise what's behind it is offered and clicks on it
  fail (1.9).
- **Toolbars shown on hover:** a board editor's row and column buttons,
  rendered on `mouseenter`, were out of every agent's reach: nothing said they
  were there. Declare them on what shows them (1.20); rendering them always
  changes what people see and do.
- **Menu toggles written as links to `#`** are buttons (1.11): readers tell
  links apart by their address, and several `#` links look like one.
- **Content that lives on pages of one kind** (a store's policies, in each
  product's panel) needs a sitemap hint, or readers answer that it doesn't
  exist (6.5).

---

## Quick reference

| # | Criterion | Level | Check |
|---|---|---|---|
| 1.1 | Native semantics first | A | manual |
| 1.2 | Custom widgets follow the ARIA patterns | A | manual |
| 1.3 | Actionable elements have names | A | automatic |
| 1.4 | State is exposed, not just shown | A | manual |
| 1.5 | Hidden means hidden | A | manual |
| 1.6 | Decorative and visual-only content excluded | AA | manual |
| 1.7 | Tables have headers; sort is declared | AA | manual |
| 1.8 | Popups and disclosures declare relationships | AA | manual |
| 1.9 | Modal dialogs are marked modal | AA | automatic |
| 1.10 | Status and loading are exposed | AA | manual |
| 1.11 | Links navigate, buttons act | A | manual |
| 1.12 | Content people ask about is named and readable | AA | manual |
| 1.13 | Navigation names the pages it doesn't list | AA | manual |
| 1.14 | Partial and remote data says what it shows | AA | manual |
| 1.15 | Search fields say what they match | AA | automatic (presence) / manual |
| 1.16 | Controls that open choices name them | AA | automatic (presence) / manual |
| 1.17 | Figures people read are shown settled | AA | manual |
| 1.18 | Notices name what they report | AA | manual |
| 1.19 | Editable areas say whether their changes are saved | AA | manual |
| 1.20 | Controls shown on hover are declared by what reveals them | AA | automatic (format) / manual |
| 2.2 | Ids describe meaning and are stable | AA | manual |
| 2.3 | Explicit ids are unique | AA | automatic |
| 2.6 | Repeated items are a declared collection | AA | manual |
| 3.1 | Metadata describes meaning | A | manual |
| 3.2 | Metadata has an id | A | automatic |
| 3.3 | Significant actions declare what they do | AA | manual |
| 3.4 | A drawn chart says what it shows in words | AA | manual |
| 3.5 | An exact value where the shown one loses it | AAA | manual |
| 3.6 | One vocabulary | AAA | manual |
| 3.7 | Task dependencies are declared | AA | automatic (unknown ids) / manual |
| 3.8 | A chart's values are a step away as a table | AAA | manual |
| 4.1 | Destructive actions marked | A | manual |
| 4.2 | Confirmation declared | A | manual |
| 4.3 | Sensitive actions marked | AA | manual |
| 4.4 | Risk on the control itself | A | manual |
| 4.5 | Secrets are never exposed | A | automatic (passwords, autocomplete) / manual |
| 5.1 | Meaningful page title | A | manual |
| 5.2 | Screen and state declared in markup | AA | automatic |
| 6.1 | A generated, published semantic sitemap | AA | automatic (format) / manual |
| 6.2 | Every reachable page on the map, tooling left out | AA | automatic |
| 6.3 | Paths or names say what pages are | AA | manual |
| 6.4 | Views in the URL and declared | AAA | manual |
| 6.5 | The map says what a page holds | AA | automatic (length) / manual |
| 6.6 | Every page on the map opens at its address | AA | manual |
