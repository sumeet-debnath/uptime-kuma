// vue-multiselect writes its own markup: role="combobox" on the whole widget,
// with its list of choices inside it. A combobox holds no options of its own,
// so whoever reads the page through its accessibility (an assistive technology,
// an agent) reads the open list as the box's text and can't pick a choice.
//
// This keeps the library as it is and corrects its attributes only: the widget
// becomes a group, the box people click becomes the combobox (named as the
// widget is, by its label, or else by its placeholder), its list stays beside
// it with its options, and aria-expanded and aria-selected follow the library's
// own classes. Nothing people see or do changes: no element is added or moved,
// no Tab stop or event handler.

const WIDGET = ".multiselect";

/**
 * The box's name: the widget's own name, else the label of its text field, else its placeholder.
 * @param {HTMLElement} widget the vue-multiselect root
 * @param {HTMLElement} box the box people click
 * @returns {void}
 */
function nameBox(widget, box) {
    for (const attr of ["aria-labelledby", "aria-label"]) {
        const value = widget.getAttribute(attr);
        if (value) {
            box.setAttribute(attr, value);
            return;
        }
    }
    const input = widget.querySelector(".multiselect__input");
    const label = input?.id ? document.querySelector(`label[for="${CSS.escape(input.id)}"]`) : null;
    if (label) {
        if (!label.id) {
            label.id = `${input.id}-label`;
        }
        box.setAttribute("aria-labelledby", label.id);
        return;
    }
    const placeholder = input?.getAttribute("placeholder");
    if (placeholder) {
        box.setAttribute("aria-label", placeholder);
    }
}

/**
 * Correct one widget's attributes; called again whenever it changes.
 * @param {HTMLElement} widget the vue-multiselect root
 * @returns {void}
 */
function fix(widget) {
    const box = widget.querySelector(":scope > .multiselect__tags");
    const list = widget.querySelector(".multiselect__content[role=listbox]");
    if (!box) {
        return;
    }
    if (widget.getAttribute("role") === "combobox") {
        widget.setAttribute("role", "group");
        widget.removeAttribute("aria-owns");
        widget.removeAttribute("aria-expanded");
    }
    box.setAttribute("role", "combobox");
    box.setAttribute("aria-haspopup", "listbox");
    box.setAttribute("aria-expanded", String(widget.classList.contains("multiselect--active")));
    if (list?.id) {
        box.setAttribute("aria-controls", list.id);
    }
    if (!box.hasAttribute("aria-label") && !box.hasAttribute("aria-labelledby")) {
        nameBox(widget, box);
    }
    if (widget.classList.contains("multiselect--disabled")) {
        box.setAttribute("aria-disabled", "true");
    } else {
        box.removeAttribute("aria-disabled");
    }
    for (const option of widget.querySelectorAll(".multiselect__element[role=option]")) {
        const selected = !!option.querySelector(".multiselect__option--selected");
        option.setAttribute("aria-selected", String(selected));
    }
}

/**
 * Correct every vue-multiselect on the page now and whenever one appears or changes.
 * @returns {void}
 */
export function watchMultiselects() {
    let queued = false;
    const run = () => {
        queued = false;
        document.querySelectorAll(WIDGET).forEach(fix);
    };
    // only element and class changes are watched: the attributes set here don't wake it again
    new MutationObserver(() => {
        if (!queued) {
            queued = true;
            queueMicrotask(run);
        }
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    run();
}
