<!-- Generated from the audit package's rules (packages/audit/src/rules) in the agent-om repository (pnpm --filter @agent-om/audit skill). Don't edit: change the source. -->

# What `agent-om-audit check` finds

Each rule, the guidelines its findings fall under, and what it finds. A rule that would have to guess (from a cursor, a class name, a word) says **review**, never fail: judge each review.

| Rule | Guidelines | Finds |
|---|---|---|
| `lost-control` | 1.1 | Something a person can use has no role that says so |
| `nested-control` | 1.1 | A control inside another control |
| `unnamed-control` | 1.3 | An actionable node with no name |
| `placeholder-name` | 1.3 | A field named only by its placeholder |
| `figure-in-name` | 1.3 | A control named from all it holds, a figure among it |
| `alike-names` | 1.3 | Controls of one role and name in the same part of the page |
| `label-in-name` | 1.3 | A control's name holds the words it shows |
| `class-state` | 1.4 | A class says a state its node lacks |
| `hidden-usable` | 1.5 | Something usable inside content the projection leaves out |
| `undrawn-control` | 1.5 | An actionable node that isn't drawn |
| `image-text` | 1.6, 1.12 | An image with no text alternative |
| `broken-reference` | 1.8 | A reference to an id no element has |
| `invalid-unexplained` | 1.8 | An invalid field with nothing saying why |
| `modal-unmarked` | 1.9 | A layer over the page, with the page under it, and no modal |
| `unnamed-dialog` | 1.9 | A dialog with no name |
| `link-acts` | 1.11 | A link that goes nowhere and acts |
| `shared-label-id` | 1.12 | A name or description taken from an id two elements have |
| `text-lost` | 1.12 | Drawn text the projection doesn't hold |
| `div-table` | 1.7 | Rows and cells with no table roles |
| `search-undescribed` | 1.15 | A search field with no description |
| `popup-undescribed` | 1.16 | A control that opens choices, with nothing naming them |
| `hover-shown` | 1.20 | Controls shown on hover that nothing declares |
| `bare-notice` | 1.18 | A notice that doesn't say what it's about |
| `risk-words` | 4.1, 4.3 | An action whose words say a risk it isn't marked with |
| `secret-shown` | 4.5 | Text that looks like a secret the app doesn't mark |
| `password-token` | 4.5 | A field that isn't a password field, marked a password by its autocomplete |
| `projector-warning` | 2.3, 3.1, 3.2, 3.7, 4.1, 4.2, 4.3, 4.5 | A problem with the app's metadata |
| `screen-context` | 5.2 | No screen declared |
| `sitemap` | 6.1, 6.2 | No valid sitemap, or this page not on it |

`bare-notice` and `risk-words` go by English words: in an app in another language they find nothing, so read their guidelines (1.18, 4.1, 4.3) on every screen yourself.

## Guidelines no rule checks

For these, read each screen's `agent-om-audit view` and screenshot against `guidelines.md`. A guideline a rule covers can still have problems no rule sees (a name that doesn't say what the control does): read those too.

- 1.2 Custom widgets follow the ARIA patterns (A)
- 1.10 Status and loading are exposed (AA)
- 1.13 Navigation names the pages it doesn't list (AA)
- 1.14 Partial and remote data says what it shows (AA)
- 1.17 Figures people read are shown settled (AA)
- 1.19 Editable areas say whether their changes are saved (AA)
- 2.2 Ids describe meaning and are stable (AA)
- 2.6 Repeated items are a declared collection (AA)
- 3.3 Significant actions declare what they do (AA)
- 3.4 A drawn chart says what it shows in words (AA)
- 3.5 An exact value where the shown one loses it (AAA)
- 3.6 One vocabulary across the app (AAA)
- 3.8 A chart's values are a step away as a table (AAA)
- 4.4 Risk is marked on the control itself (A)
- 5.1 The page title is meaningful and current (A)
- 6.3 A page's path or name says what it is (AA)
- 6.4 Views with distinct content are in the URL and declared (AAA)
- 6.5 The map says what a page holds, when people look for it elsewhere (AA)
- 6.6 Every page on the map opens at its address (AA)
