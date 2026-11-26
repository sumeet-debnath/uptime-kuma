// Attributes on markup that libraries write and that takes none from the app. Each part
// only sets or removes ARIA attributes, in step with the library's own classes: it adds,
// moves and draws nothing, and adds no Tab stop or event handler.

/**
 * Set an attribute, or remove it when the value is null or false; unchanged values aren't written again.
 * @param {Element} el the element
 * @param {string} name the attribute's name
 * @param {string|boolean|null|undefined} value its value
 * @returns {void}
 */
function set(el, name, value) {
    if (value == null || value === false) {
        el.removeAttribute(name);
    } else if (el.getAttribute(name) !== String(value)) {
        el.setAttribute(name, String(value));
    }
}

/**
 * Run apply now and whenever a class or a child changes under target.
 * @param {Element} target what to watch
 * @param {() => void} apply what sets the attributes
 * @returns {MutationObserver} the observer
 */
function keepInStep(target, apply) {
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(target, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    return observer;
}

let multiselectCount = 0;

/** vue-multiselect: v-multiselect-a11y="{ label?, labelledby?, removeLabel?: (text) => string }" */
export const multiselectA11y = {
    mounted(el, binding) {
        el.__a11yOptions = binding.value ?? {};
        el.__a11yObserver = keepInStep(el, () => {
            const o = el.__a11yOptions;
            const input = el.querySelector(".multiselect__input");
            const box = input ?? el;
            if (input) {
                // the combobox is the field people type in; the list of options sits beside it
                set(el, "role", null);
                set(el, "aria-owns", null);
                set(input, "role", "combobox");
            }
            set(box, "aria-expanded", el.classList.contains("multiselect--active") ? "true" : "false");
            // the choices are drawn beside the field (a single select's in a span, a multiple one's as
            // tags): the field's name says them after the label, as the library's own combobox said
            // them in its value
            const chosen = [...el.querySelectorAll(".multiselect__single, .multiselect__tag > span")].filter((c) =>
                c.textContent.trim()
            );
            if (chosen.length) {
                el.__a11yId ??= `multiselect-${++multiselectCount}`;
                chosen.forEach((c, i) => set(c, "id", `${el.__a11yId}-chosen-${i}`));
            }
            const choices = chosen.map((c) => c.textContent.trim()).join(", ");
            const labelText = o.label ?? (o.labelledby ? null : input?.labels?.[0]?.textContent.trim());
            set(box, "aria-label", labelText && choices ? `${labelText} ${choices}` : o.label);
            set(
                box,
                "aria-labelledby",
                o.labelledby && chosen.length ? [o.labelledby, ...chosen.map((c) => c.id)].join(" ") : o.labelledby
            );
            const list = el.querySelector(".multiselect__content");
            if (list) {
                set(list, "aria-labelledby", o.labelledby);
                set(
                    list,
                    "aria-label",
                    o.labelledby ? null : (o.label ?? (input?.labels?.[0]?.textContent.trim() || null))
                );
            }
            for (const li of el.querySelectorAll("li.multiselect__element[role=option]")) {
                set(li, "aria-selected", li.querySelector(".multiselect__option--selected") ? "true" : null);
            }
            for (const icon of el.querySelectorAll(".multiselect__tag-icon")) {
                set(icon, "role", "button");
                if (o.removeLabel) {
                    set(icon, "aria-label", o.removeLabel(icon.previousElementSibling?.textContent.trim() ?? ""));
                }
            }
        });
    },
    updated(el, binding) {
        el.__a11yOptions = binding.value ?? {};
    },
    unmounted(el) {
        el.__a11yObserver?.disconnect();
    },
};

/** v-pagination-3: v-pagination-a11y="{ label, previous, next, page: (n) => string }" */
export const paginationA11y = {
    mounted(el, binding) {
        el.__a11yObserver = keepInStep(el, () => {
            const o = binding.value ?? {};
            const nav = el.querySelector("nav");
            if (nav) {
                set(nav, "aria-label", o.label);
            }
            for (const li of el.querySelectorAll(".VuePagination__pagination-item")) {
                const button = li.querySelector(".page-link");
                if (!button) {
                    continue;
                }
                const text = button.textContent.trim();
                if (li.classList.contains("VuePagination__pagination-item-prev-page")) {
                    set(button, "aria-label", o.previous);
                } else if (li.classList.contains("VuePagination__pagination-item-next-page")) {
                    set(button, "aria-label", o.next);
                } else if (/^\d+$/.test(text)) {
                    set(button, "aria-label", o.page?.(text));
                }
                set(button, "aria-current", li.classList.contains("active") ? "page" : null);
            }
        });
    },
    unmounted(el) {
        el.__a11yObserver?.disconnect();
    },
};

/** vue-datepicker's field: v-datepicker-a11y="{ label }" */
export const datepickerA11y = {
    mounted(el, binding) {
        el.__a11yObserver = keepInStep(el, () => {
            const input = el.querySelector("input.dp__input");
            const wrapper = input?.closest("[role=textbox]");
            if (wrapper && wrapper !== input) {
                // one text field, not one inside another
                for (const name of ["role", "aria-label", "aria-multiline", "aria-disabled", "aria-readonly"]) {
                    set(wrapper, name, null);
                }
            }
            if (input) {
                set(input, "aria-label", binding.value?.label);
            }
        });
    },
    unmounted(el) {
        el.__a11yObserver?.disconnect();
    },
};

/** vue-prism-editor: v-prism-a11y="{ labelledby }" names the textarea it writes */
export const prismA11y = {
    mounted(el, binding) {
        el.__a11yObserver = keepInStep(el, () => {
            const textarea = el.querySelector("textarea");
            if (textarea) {
                set(textarea, "aria-labelledby", binding.value?.labelledby);
            }
        });
    },
    unmounted(el) {
        el.__a11yObserver?.disconnect();
    },
};

/**
 * vue-datepicker's menu, which it teleports to <body>: its Cancel and Select are buttons, and
 * in a range time picker each side's controls say which side they set.
 * @param {(key: string, values?: object) => string} t the app's translation function
 * @returns {void}
 */
export function datepickerMenuA11y(t) {
    keepInStep(document.body, () => {
        for (const action of document.querySelectorAll(".dp__menu .dp__action")) {
            set(action, "role", "button");
        }
        for (const menu of document.querySelectorAll(".dp__menu")) {
            const sides = menu.querySelectorAll(".dp__time_input");
            if (sides.length !== 2) {
                continue;
            }
            sides.forEach((side, index) => {
                const which = t(index === 0 ? "timeRangeStart" : "timeRangeEnd");
                for (const control of side.querySelectorAll("[aria-label]")) {
                    const own = control.dataset.a11yLabel ?? control.getAttribute("aria-label");
                    control.dataset.a11yLabel = own;
                    set(control, "aria-label", t("timeRangeControl", [which, own]));
                }
            });
        }
    });
}
