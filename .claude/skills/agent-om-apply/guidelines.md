<!-- Generated from docs/guidelines.md in the agent-om repository (pnpm --filter @agent-om/audit skill). Don't edit: change the source. -->

# Agent Object Model Authoring Guidelines

How to build a web app so the Agent Object Model describes it accurately,
and so whatever reads the projection can understand it and act on it safely.

Like [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/), these are
**guidelines for authors**. The projector is the reader: it reports what the
page actually expresses through HTML, ARIA and metadata, and it never guesses.
How you meet each criterion is up to you.

**They change what a page says about itself, never what people see or do.**
Meeting a criterion adds or corrects roles, names, states, relationships,
descriptions (in hidden elements where the screen doesn't show them) and
`data-agentom-*` metadata. What the page looks like, its visible text, its
focus order and Tab stops, its timing, and what the mouse, keyboard and touch
do stay as they are.

Each criterion has a **level**:

| Level | Meaning |
|---|---|
| **A** | Minimum. The app projects correctly and dangerous actions are marked. |
| **AA** | Reliable to act on. Stable ids, explicit relationships, app context. |
| **AAA** | Rich. Named sections, raw values, declared actions and purposes everywhere. |

**Conformance:** a screen conforms at a level when it meets every criterion at
that level and below. An app conforms when every screen does.

Each criterion lists how to check it. **Automatic** means the projector reports
it (an `onWarning` code) or a snippet from [How to check](#how-to-check)
finds it. **Manual** means reviewing the projection, for example in the
dashboard's inspector.

For how the projector works, see [semantic-projection.md](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/semantic-projection.md).
Every fixed value in this document (attribute names, risk levels, secret
tokens, warning codes, reserved keys) comes from the projector's
[`vocabulary.ts`](https://github.com/TheAsyncLooop/agent-om/blob/master/packages/core/src/vocabulary.ts), and the
sitemap's (its path, link and warning codes) from the sitemap entry's
[`vocabulary.ts`](https://github.com/TheAsyncLooop/agent-om/blob/master/packages/core/src/sitemap/vocabulary.ts); tests fail
if they disagree.

---

## Principle 1: Perceivable to the projector

The projector only sees what HTML, ARIA and metadata express.

### 1.1 Native semantics first (A)
Use native elements for controls and structure: `<button>`, `<a href>`,
`<input>`, `<select>`, `<form>`, `<nav>`, `<main>`, `<table>`, `<h1>`–`<h6>`.
Use ARIA roles only when HTML has no element for the job.

- **Why:** a `<div onClick>` with no role produces no node. Its text becomes
  loose text on the parent and nothing can act on it. The projector doesn't
  detect click handlers.
- **Pass:** `<button>Save</button>`, or `<div role="button" tabindex="0">Save</div>`.
- **Fail:** `<div onclick="save()">Save</div>`.
- **Check:** manual. The control is missing from `actionableNodes(state)`.

### 1.2 Custom widgets follow the ARIA patterns (A)
Build tabs, menus, comboboxes, trees, grids, dialogs, accordions and similar
widgets with the roles, states and properties of the
[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/).

- **Why:** the projector is tested against these patterns. A tab with
  `role="tab"` and `aria-selected`, or a tree item with `aria-expanded`, becomes
  a node with the right role and state. An improvised widget doesn't.
- **Pass:** `<div role="tablist"><button role="tab" aria-selected="true" aria-controls="p1">…`
- **Fail:** a row of styled `<span>`s that act as tabs.
- **Check:** manual. Compare against the pattern; the projection shows the role and state.

### 1.3 Every actionable element has an accessible name (A)
Buttons, links, inputs and other controls need a name, from visible text,
`<label>`, `aria-label` or `aria-labelledby`.

- **Why:** the name is how a control is described. An unnamed control gets an id
  like `button` and nothing to tell it apart.
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
  the title, described by the rest. Text in neither is lost.
- **Note:** a text field with only a placeholder is named by it, as browsers
  name it, but that isn't a label: the placeholder goes as soon as something is
  typed, and a generic one ("Select an item") says nothing. Give the field a
  `<label>` or an `aria-label`; the placeholder can stay as a hint.
- **Check:** automatic, `actionableNodes(state).filter((n) => !n.name)`.

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

- **Why:** the projector reads these into `state`. A "selected" tab that is only
  styled bold is projected as unselected. With both a changing label and
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
- **Check:** manual. The node's `state` matches what the screen shows.

### 1.5 Hidden means hidden (A)
Content the user can't currently see or use must be removed from rendering or
from the accessibility tree: `hidden`, `display: none`, `inert`, or
`aria-hidden="true"`. Never put `aria-hidden` on content that is visible and
usable.

- **Why:** the projector keeps content hidden only visually: `opacity: 0`,
  positioned off-screen, `.sr-only`. A closed panel that is just faded out is
  projected as present. And `aria-hidden` removes everything inside it,
  including focusable controls.
- **Pass:** a collapsed accordion panel with `hidden`; a closed menu with `display: none`.
- **Fail:** a closed menu at `opacity: 0`; `aria-hidden="true"` on a visible toolbar.
- **Check:** manual. Hidden things are absent from the projection, visible things present.
- **Note:** on large pages, hide with an attribute or class on the content or
  one of its ancestors rather than with `:has()` or a container query in the
  hiding rule. Either way the projection is right, but such a rule makes every
  live update re-project the whole page ([semantic-projection.md §7](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/semantic-projection.md#7-real-time-model), CSS reach).
- **Note:** controls shown only while the pointer is over something (a row's
  toolbar, a card's edit button) are hidden until then, and the projection
  rightly leaves them out. Don't render them always: say what shows them
  (1.20).

### 1.6 Decorative and visual-only content is excluded (AA)
Mark decorative icons and images `aria-hidden="true"` (or `alt=""`). Put
`data-agentom-ignore` on purely visual subtrees whose meaning is provided some
other way, such as a chart's rendering when its data is exposed as metadata
(3.4).

- **Why:** this keeps the projection small. Changes inside `data-agentom-ignore`,
  such as chart animations, also don't trigger updates.
- **Pass:** `<svg aria-hidden="true">…</svg>`; `<div data-agentom-ignore><canvas>…</canvas></div>`.
- **Fail:** icon fonts or SVGs with stray text that ends up in a control's name.
- **Check:** manual. No decorative text in names or `text`.

### 1.7 Tables have headers; sortable columns say so (AA)
Use `<th>` in a `<thead>` for column headers (in an ARIA table, a first row of
`role="columnheader"` cells), and `aria-sort` on the column the table is sorted
by.

- **Why:** a table is projected as `columns` plus `rows` (up to 50 by default),
  with the sorted column header as its own node. The column names come from a
  `<thead>`'s row or, without one, from a first row whose every cell is a column
  header; without either there are none, and a header row is read as data.
  Without `aria-sort` the sort order is invisible.
- **Pass:** `<thead><tr><th aria-sort="ascending"><button>Date</button></th>…`
- **Fail:** a header row made of `<td>`s with bold styling.
- **Check:** manual. The table node has `columns`, and the sorted header has `state.sort`.

### 1.8 Popups and disclosures declare their relationships (AA)
A control that opens or shows something has `aria-expanded`, plus
`aria-controls` pointing at what it controls. Menu buttons add
`aria-haspopup`. Comboboxes and listboxes with virtual focus use
`aria-activedescendant`. Fields with errors use `aria-errormessage` or
`aria-describedby`.

- **Why:** these become `controls`, `activeDescendant` and `errorMessage` links
  between nodes. A closed popup still appears as `controls: ["#id"]`, so it's
  clear something is there to open.
- **Pass:** `<button aria-expanded="false" aria-controls="faq-1">What is it?</button>`.
- **Fail:** a toggle that only flips a CSS class on a sibling.
- **Note:** `aria-errormessage` links to its message only when the message is a
  node of its own (a `role="alert"`, or an element with a `data-agentom-id`). A
  plain `<p>` is folded into its parent's text, and the link points nowhere
  (`"#<domId>"`). Name the message in `aria-describedby` too, and it's the
  field's `description` while the field is invalid.
- **Check:** manual. Triggers have `state.expanded` and `controls`.

### 1.9 Modal dialogs are marked modal (AA)
Give modal dialogs `role="dialog"` (or `alertdialog`) and `aria-modal="true"`,
name each by its title (`aria-labelledby`), and make the rest of the page
inert while they're open. A native `<dialog>` opened with `showModal()` is
modal and inert already; it still needs its name.

- **Why:** the projector sets `context.modalId` from `aria-modal` (or a
  `<dialog>` opened with `showModal()`), and the
  actionable list is limited to the modal. Without `aria-modal`, a modal is only
  detected when everything else is `aria-hidden`/`inert` and the popup is at
  the top level of the page.
- **Pass:** `<div role="dialog" aria-modal="true" aria-labelledby="t">…</div>`;
  `<dialog aria-labelledby="t">…</dialog>` opened with `showModal()`.
- **Fail:** a dialog `<div>` drawn over the page with no role.
- **Check:** automatic, `snapshot().context.modalId` is set while it's open, and
  its node has a `name`.

### 1.10 Status and loading are exposed (AA)
Announce results and messages with `role="status"` or `role="alert"`. Mark a
region being updated with `aria-busy="true"` until it's done.

- **Why:** live regions are kept with their text, and `aria-busy` becomes
  `state.busy`. A spinner with no ARIA tells the projector nothing.
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
  has no destination the projector can see.
- **Pass:** `<a href="/checkout" data-agentom-id="cart.checkout" data-agentom-action="checkout">Checkout</a>`.
- **Fail:** `<button onclick="router.push('/checkout')">Checkout</button>`.
- **Check:** manual. Navigation controls have `role: link` and an `href`.

### 1.12 Content people ask about is named and readable (AA)
Cards and panels that show information (a metric, a chart, a summary) have an
accessible name, e.g. `role="group"` or `role="region"` with `aria-labelledby`
pointing at their title. If the element also has structured `data`, point
`aria-describedby` at the value as shown, since the projection drops the
formatted text of nodes with `data` (3.5).

- **Why:** a consumer answering "what's the bounce rate?" finds the element by
  its name and shows its description. It reads only generic fields (name,
  value, description, text), never an app's own `data` shape, which differs per
  app.
- **Pass:** `<div role="group" aria-labelledby="l" aria-describedby="v" data-agentom-id="kpi.bounce">`
  with `<dt id="l">Bounce rate</dt><dd id="v">45.9%</dd>` inside.
- **Fail:** a metric card whose label is only inside its `data` (`{ label: 'Bounce rate' }`).
- **Check:** manual. Content nodes have a `name`; nodes with `data` also have a `description`.

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

- **Why:** the projection only sees rendered rows (`table.totalRows`, at most 50
  of them projected), so the total and the order exist only if the page says
  them. Without `aria-busy`, rows from before a sort or a filter look current
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
- **Pass:** `<input type="search" aria-label="Search campaigns by name"
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
`<select>` needs nothing: its options are projected as `items`. A control that
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
- **Note:** build the description from the same data as the popup's items, so
  the two can't drift. Leave out what changes with every use (a search's
  results); name the kind of choice instead.
- **Check:** automatic for presence: every actionable node with a `haspopup`
  other than `dialog`, and every `combobox` without `items`, has a `description`
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

Anything that will be acted on needs a handle that survives re-renders.

### 2.1 Elements that will be acted on have a `data-agentom-id` (AA)
Give an explicit id to every control, section and data display that matters to
the app's tasks.

- **Why:** without one, the id is derived from role and name (`button:save`),
  scoped under the nearest annotated ancestor. That's stable, but it changes if
  the name changes and doesn't say what the thing *is*.
- **Pass:** `<button data-agentom-id="cart.checkout">Checkout</button>`.
- **Fail:** relying on `button:checkout~3`.
- **Check:** manual. Key actions have explicit ids.

### 2.2 Ids describe meaning and are stable (AA)
Write ids as dot-separated, lowercase, kebab-case segments: `area.thing`
(`cart.checkout`, `payment.card-number`, `account.logout`). Never use
positions, indexes, generated values or framework names. Don't use `/`, `:`
or `~`: the projector uses them in derived ids.

- **Why:** an id is a contract. `row-17`, `btn-3` or `CartButton` break when the
  UI changes, or leak implementation.
- **Pass:** `coupon.apply`, `orders.export-csv`.
- **Fail:** `btn-3`, `order-row-17`, `handleSubmit`, `react-cart-button`.
- **Check:** manual (not validated).

### 2.3 Explicit ids are unique on a screen (AA)
Don't use the same `data-agentom-id` twice on one screen. For repeated items, put
the item's own identity in the id (`order.1042.edit`), not its position.

- **Why:** an id on two elements names neither: they become `cart.checkout~1`
  and `cart.checkout~2`, so nothing answers to `cart.checkout`.
  Derived ids collide too: they are cut to 40 characters, so "Select Whitepaper:
  Privacy-first Analytics – US" and "… – UK" become the same id plus `~2`. Rows
  get explicit ids from their item (`campaign.<id>.select`).
- **Note:** content the app didn't write (a comment, a user's profile, an email
  shown as HTML) mustn't carry `data-agentom-*` attributes: strip them when you
  sanitise it (sanitisers keep `data-*` attributes by default), or it can give
  itself an id your controls use, and the metadata that goes with it.
- **Check:** automatic (`duplicate-id`).

### 2.4 Controls whose label changes have a pinned id (AA)
If a control's visible label depends on state ("Pause" ↔ "Resume", or a menu
button showing its value, "Theme: dark"), give it a `data-agentom-id`.

- **Why:** a derived id follows the name, so it would change every time the
  label flips.
- **Pass:** `<button data-agentom-id="live.toggle">Pause</button>` (becomes "Resume"; no
  `aria-pressed`, see 1.4).
- **Check:** manual. The id is unchanged after toggling.

### 2.5 Screens are divided into named sections (AAA)
Mark the main areas of a screen as sections:
`data-agentom-id="payment" data-agentom-kind="section"`, ideally on a landmark or
named region.

- **Why:** derived ids inside get scoped (`payment/textbox:expiry`), so a
  same-named control elsewhere can't shift them, and the projection gets the
  shape of the task (`checkout → shipping, payment`).
- **Pass:** `<section data-agentom-id="payment" data-agentom-kind="section" aria-label="Payment">…`
- **Check:** manual.

### 2.6 Repeated items are a declared collection (AA)
A list of things of one kind (messages, products, search results, a
sidebar's channels) is a `list` or `feed` with a name, each item a `listitem`
or `article` with a `data-agentom-id` of its own (`post.<id>`,
`channel.<name>`), and each control inside an item has an id relative to it:
the item's id, a dot, and a key that is the same on every item for the same
control (`post.<id>.save`, `post.<id>.author`, `post.<id>.time`). A set of
controls of one kind inside an item (its reactions, its participants) shares
a key, with each one's own name after it (`post.<id>.reaction.plus1`). What
hovering over an item shows is declared on the item (1.20).

- **Why:** a list of 30 messages repeats the same few controls on every
  message: read one by one, three quarters of the page is the same buttons
  again. Declared, an agent can read the kind of item once (every control an
  item can have, and what it does) and then each item as a line of what it
  is and what it has of them; and it can search the list for an item without
  reading it all (the agent's `find_items`). The ids are what make it a kind:
  the same key on two items is the same control. Nothing is grouped because
  it looks alike.
- **Note:** an item has the controls it has: a message has Edit only if it's
  yours, a reply count only when it has replies. That's the item's state, not
  another kind of item, so the keys stay the same. A control whose id is
  derived from its label (`button:ashley-berry`, `link:3-14-pm`) isn't
  relative to its item: give it a key.
- **Pass:** `<div role="feed" aria-label="Messages"><article data-agentom-id="post.abc" …><button data-agentom-id="post.abc.save">…</button>…`
- **Fail:** messages in an unnamed `div`; items without ids; an author's name
  as a button with no id, so its id is the name.
- **Check:** manual. read_page shows the list as a kind once (`each item ({id}
  is its id): …`), then one line per item.

---

## Principle 3: Meaningful

Say what things mean, so nothing has to be inferred.

### 3.1 Metadata describes meaning, not implementation (A)
`data-agentom-kind`, `-action` and `-purpose` (and their `useSemantic` /
`registerMeta` equivalents) state meaning in kebab-case. Never use function,
component or library names.

- **Why:** whatever reads the projection knows nothing about your code. Invalid
  values (not kebab-case) are dropped and reported.
- **Pass:** `data-agentom-action="cancel-subscription"`, `data-agentom-kind="metric"`.
- **Fail:** `data-agentom-action="handleCancel"`, `data-agentom-kind="CartButton"`, `action="click-this-button"`.
- **Check:** automatic for format (`invalid-value`); manual for meaning.

### 3.2 Metadata sits on an element with an id (A)
Every metadata attribute (`data-agentom-kind`, `data-agentom-desc`,
`data-agentom-value`, `data-agentom-action`, `data-agentom-purpose`,
`data-agentom-risk`, `data-agentom-confirmation`, `data-agentom-requires`,
`data-agentom-reveals`) goes on an
element that also has `data-agentom-id`. (The safety attributes
`data-agentom-ignore` and `data-agentom-redact` are the exception: they work on any
element.)

- **Why:** without an id, the fields are ignored. Nothing could address the element.
- **Check:** automatic (`metadata-without-id`).

### 3.3 Significant actions declare what they do (AA)
Give important actions `data-agentom-action` with a verb phrase. Add
`data-agentom-purpose` where the goal isn't obvious from the action.

- **Pass:** `<button data-agentom-id="cart.checkout" data-agentom-action="checkout" data-agentom-purpose="proceed-to-payment">Checkout</button>`.
- **Check:** manual.

### 3.4 Visual data has a data equivalent (AA)
Charts, graphs, maps and other visual-only data expose the underlying values as
structured metadata (`useSemantic` / `registerMeta` `data`), with the rendering
marked `data-agentom-ignore` (1.6). Ignore only the rendering: a table view of the
same data, while it's shown, stays outside `data-agentom-ignore`.

- **Why:** SVG and canvas pixels carry nothing usable. Rows and values do. A
  shown table is real content: hidden, nothing in the projection says the data
  is being shown as a table.
- **Pass:** a chart card registering `{ kind: 'chart', data: { columns, rows } }`,
  its drawing in `data-agentom-ignore` and its table view, when on, outside it.
- **Fail:** one `data-agentom-ignore` wrapper around both the drawing and the table view.
- **Check:** manual.

### 3.5 Values are raw, not just formatted (AAA)
Where a displayed value is formatted ("$1,234", "12.4%", "2m 05s"), also expose
the raw value: `data-agentom-value="1234"`, or `value` / `data` in metadata.

- **Why:** the raw value (`value: 1234`, numeric strings become numbers) can be
  compared and computed with. The formatted text is kept beside it, since it
  carries the label and unit (`text: "Total: $1,234"`). Nodes with structured
  `data` drop the formatted text, since the data is meant to be complete.
- **Check:** manual.

### 3.6 One vocabulary across the app (AAA)
Use the same `kind` and `action` words for the same things everywhere: one
`metric`, not `metric`/`kpi`/`stat`.

- **Check:** manual (review the set of kinds and actions in use).

### 3.7 Task dependencies are declared (AA)
When an action only makes sense after other things are done, say so. Within one
form, use a real `<form>` with `required` fields: that's already projected
(`form` on every member, `state.required` on the fields). For anything a form
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

## Principle 4: Safe

Safety must never be left to inference.

### 4.1 Destructive actions are marked (A)
Actions that delete data, cancel things, spend money or can't be undone carry
`data-agentom-risk="destructive"`.

- **Why:** `risk` is the only signal that an action is dangerous. The projector
  doesn't infer it from words like "Delete".
- **Pass:** `<button data-agentom-id="account.delete" data-agentom-risk="destructive">Delete account</button>`.
- **Fail:** the same button with no `risk`.
- **Check:** manual. Review every action that changes data.

### 4.2 Actions that need confirmation say so (A)
If an action must be confirmed before it runs, add
`data-agentom-confirmation="required"`, projected as `confirmationRequired: true`.

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
reported.

- **Why:** a projection may be sent to a model or a server. The projector never
  projects these values (`redacted: true` instead), but only if it can tell the
  field is secret.
- **Pass:** `<input type="password">`; `<input autocomplete="cc-number">`;
  `<input data-agentom-redact aria-label="Account number">`.
- **Fail:** a card-number field as a plain `<input>` with no `autocomplete`.
- **Note:** a "show password" toggle switches the field to `type="text"`. Keep
  `autocomplete="current-password"` (or `new-password`) on the field so it stays
  redacted while shown.
- **Note:** the page's address is projected as it is (`context.url`, `query`),
  so a secret in it, such as a reset link's token or a sign-in code, is
  projected too. Keep secrets out of URLs; where a flow puts one there, pass
  the projector a `location` without it.
- **Check:** automatic for `type="password"` and `autocomplete` secrets (built
  in), and `redact-without-field` for the attribute on text; manual for
  app-specific fields.

---

## Principle 5: Contextual

Individual controls aren't enough; say where the user is.

### 5.1 The page title is meaningful and current (A)
Keep `document.title` describing the current screen, and update it on
client-side navigation.

- **Why:** it's projected as `context.title`.
- **Check:** manual.

### 5.2 Screen and state are supplied as context (AA)
Supply `screen` (a stable, dotted name for the current screen) and `state`
(`loading`, `ready`, `error`…) through the projector's `context` option. Derive
`screen` from something stable, such as a route id, not a visible label.

- **Pass:** `context: () => ({ screen: 'checkout', state: 'ready' })`; `state: 'error'`
  while the screen shows a failure to load.
- **Note:** if the route isn't the address bar's path (hash routing, an
  in-memory router), also pass the projector's `location` option, so
  `context.path` and `query` are the app's route, not the page's address.
- **Check:** automatic, `snapshot().context.screen` is set on every screen.

### 5.3 Context changes outside the DOM trigger a refresh (AA)
When app context changes without a DOM change (for example a router going from
pending to idle), call `projector.refresh()`.

- **Why:** the projector updates on DOM and input events. It can't see state
  that lives only in your app.
- **Check:** manual. `context.state` reaches `ready` without other interaction.

### 5.4 Context is serializable and doesn't use reserved keys (AA)
Context values are JSON-serializable. Don't use `url`, `path`, `query`,
`title`, `focusedId` or `modalId`: the projector owns them.

- **Check:** automatic (`reserved-context-key`, `context-error`).

### 5.5 App state that matters to tasks is in context (AAA)
Expose app-level facts a task depends on and the DOM doesn't show (signed-in
role, plan, cart size, active workspace) as context.

- **Check:** manual.

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
  `campaigns › {campaignId} › ad-groups/{adGroupId}`; the dashboard's decision-model
  and network-simulation settings are left out.
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

**Warnings.** Pass `onWarning` and treat warnings as failures in development
and tests:

| Code | Criterion |
|---|---|
| `invalid-value` | 3.1 (and `risk`/`confirmation` values, 4.1–4.3) |
| `metadata-without-id` | 3.2 |
| `duplicate-id` | 2.3 |
| `redact-without-field` | 4.5 |
| `unresolved-requirement` | 3.7 |
| `reserved-context-key` | 5.4 |
| `context-error` | 5.4 |

`fast-path-mismatch` is not about the app: it means one of the projector's own
live updates (fast path or region re-walk) disagreed with a full projection
(seen only with the `verify` debugging option on) and should be reported as a
projector bug.

The sitemap has its own check, `validateSitemap(map)` ([sitemap.md](https://github.com/TheAsyncLooop/agent-om/blob/master/docs/sitemap.md)):
`invalid-path`, `duplicate-path`, `empty-field` and `invalid-field` all fail
6.1; `long-hint` fails 6.5.

**Snippets** using the public API:

```ts
import { actionableNodes, createSemanticProjector, type SemanticNode } from '@agent-om/core'

const projector = createSemanticProjector({ onWarning: (w) => console.error(w.message) })
const state = projector.snapshot()

// 1.3: actionable elements without a name
const unnamed = actionableNodes(state).filter((n) => !n.name)

// 1.15: search fields without a description of what they match
const searchFields = (n: SemanticNode, inSearch = false): SemanticNode[] => [
  ...(n.role === 'searchbox' || (inSearch && n.role === 'textbox') ? [n] : []),
  ...(n.children ?? []).flatMap((c) => searchFields(c, inSearch || n.role === 'search')),
]
const undescribed = searchFields(state.root).filter((n) => !n.description)

// 1.16: controls that open choices without naming them
// (a dialog is manual: choices, or a task?)
const unlisted = actionableNodes(state).filter((n) => ((n.haspopup && n.haspopup !== 'dialog') || n.role === 'combobox') && !n.items && !n.description)

// 1.9: a modal is reported while one is open
const modal = state.context.modalId

// 5.2: screen supplied
const hasScreen = typeof state.context.screen === 'string'

// 6.2: the current page is on the sitemap (`map` is your app's)
const onMap = !!locate(map, state.context.path, state.context.query)
```

**Review.** In development, the dashboard's inspector (bottom-right button)
shows the live projection: node tree, ids, state, context, actionable count,
and an outline of each node's element on hover.

**Tests.** Render a screen in a browser test, take `snapshot()`, and assert the
ids, states and context you depend on. The dashboard's
[`app.test.tsx`](https://github.com/TheAsyncLooop/agent-om/blob/master/apps/dashboard/src/app.test.tsx) asserts zero metadata
warnings, for example.

---

## Pitfalls in real apps

Met while applying these guidelines to eight open-source apps built with
Next.js, React Router, Vite, Laravel and PHP, on Ant Design, Mantine and
Headless UI ([the WindTunnel benchmark](https://github.com/TheAsyncLooop/agent-om/blob/master/eval/apps/windtunnel-benchmark.md)),
and to Umami (Next.js, on react-zen, built on Base UI). Each is a way a
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
- **Long prose:** a node's loose text is cut at 300 characters (`maxText`).
  A description written with headings becomes regions named by them, so each
  part is found by its name (1.12).
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
| 2.1 | Acted-on elements have `data-agentom-id` | AA | manual |
| 2.2 | Ids describe meaning and are stable | AA | manual |
| 2.3 | Explicit ids are unique | AA | automatic |
| 2.4 | State-dependent labels have pinned ids | AA | manual |
| 2.5 | Screens have named sections | AAA | manual |
| 2.6 | Repeated items are a declared collection | AA | manual |
| 3.1 | Metadata describes meaning | A | automatic (format) |
| 3.2 | Metadata has an id | A | automatic |
| 3.3 | Significant actions declare what they do | AA | manual |
| 3.4 | Visual data has a data equivalent | AA | manual |
| 3.5 | Values are raw | AAA | manual |
| 3.6 | One vocabulary | AAA | manual |
| 3.7 | Task dependencies are declared | AA | automatic (unknown ids) / manual |
| 4.1 | Destructive actions marked | A | manual |
| 4.2 | Confirmation declared | A | manual |
| 4.3 | Sensitive actions marked | AA | manual |
| 4.4 | Risk on the control itself | A | manual |
| 4.5 | Secrets are never exposed | A | automatic (passwords, autocomplete) / manual |
| 5.1 | Meaningful page title | A | manual |
| 5.2 | Screen and state in context | AA | automatic |
| 5.3 | Refresh on outside-the-DOM changes | AA | manual |
| 5.4 | Context serializable, no reserved keys | AA | automatic |
| 5.5 | Task-relevant app state in context | AAA | manual |
| 6.1 | A generated, published semantic sitemap | AA | automatic (format) / manual |
| 6.2 | Every reachable page on the map, tooling left out | AA | automatic |
| 6.3 | Paths or names say what pages are | AA | manual |
| 6.4 | Views in the URL and declared | AAA | manual |
| 6.5 | The map says what a page holds | AA | automatic (length) / manual |
| 6.6 | Every page on the map opens at its address | AA | manual |
