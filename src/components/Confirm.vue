<template>
    <div
        ref="modal"
        class="modal fade"
        tabindex="-1"
        :aria-labelledby="`confirm-title-${$.uid}`"
        :aria-describedby="`confirm-body-${$.uid}`"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 :id="`confirm-title-${$.uid}`" class="modal-title">
                        {{ title || $t("Confirm") }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="$t('Close')" />
                </div>
                <div :id="`confirm-body-${$.uid}`" class="modal-body">
                    <slot />
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn"
                        :class="btnStyle"
                        data-bs-dismiss="modal"
                        :aria-label="action ? `${yesText || $t('Yes')}: ${action}` : undefined"
                        :data-agentom-id="yesId || undefined"
                        :data-agentom-risk="yesId && risk ? risk : undefined"
                        @click="yes"
                    >
                        {{ yesText || $t("Yes") }}
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="no">
                        {{ noText || $t("No") }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
    props: {
        /** Style of button */
        btnStyle: {
            type: String,
            default: "btn-primary",
        },
        /** Text to use as yes */
        yesText: {
            type: String,
            default: null,
        },
        /** Text to use as no */
        noText: {
            type: String,
            default: null,
        },
        /** Title to show on modal. Defaults to translated version of "Config" */
        title: {
            type: String,
            default: null,
        },
        /** What "Yes" does, as a phrase ("delete monitor Kuma backend"): read by assistive technology only */
        action: {
            type: String,
            default: null,
        },
        /** data-agentom-id of the "Yes" button */
        yesId: {
            type: String,
            default: null,
        },
        /** data-agentom-risk of the "Yes" button: "destructive" or "sensitive" */
        risk: {
            type: String,
            default: null,
        },
    },
    emits: ["yes", "no"],
    data: () => ({
        modal: null,
    }),
    mounted() {
        this.modal = new Modal(this.$refs.modal);
    },
    methods: {
        /**
         * Show the confirm dialog
         * @returns {void}
         */
        show() {
            this.modal.show();
        },
        /**
         * @fires string "yes" Notify the parent when Yes is pressed
         * @returns {void}
         */
        yes() {
            this.$emit("yes");
        },
        /**
         * @fires string "no" Notify the parent when No is pressed
         * @returns {void}
         */
        no() {
            this.$emit("no");
        },
    },
};
</script>
