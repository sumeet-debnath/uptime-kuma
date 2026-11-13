<template>
    <div class="input-group mb-3" data-agentom-redact>
        <input
            ref="input"
            v-model="model"
            :type="visibility"
            class="form-control"
            :aria-labelledby="labelledby || undefined"
            :aria-describedby="describedby || undefined"
            :placeholder="placeholder"
            :maxlength="maxlength"
            :autocomplete="autocomplete"
            :required="required"
            :readonly="readonly"
        />

        <a
            v-if="visibility == 'password'"
            class="btn btn-outline-primary"
            role="button"
            :aria-label="labelledby ? undefined : $t('showValueAria')"
            :aria-labelledby="labelledby ? `hidden-input-${$.uid}-show ${labelledby}` : undefined"
            @click="showInput()"
        >
            <font-awesome-icon icon="eye" />
            <span :id="`hidden-input-${$.uid}-show`" hidden>{{ $t("showValueAria") }}</span>
        </a>
        <a
            v-if="visibility == 'text'"
            class="btn btn-outline-primary"
            role="button"
            :aria-label="labelledby ? undefined : $t('hideValueAria')"
            :aria-labelledby="labelledby ? `hidden-input-${$.uid}-hide ${labelledby}` : undefined"
            @click="hideInput()"
        >
            <font-awesome-icon icon="eye-slash" />
            <span :id="`hidden-input-${$.uid}-hide`" hidden>{{ $t("hideValueAria") }}</span>
        </a>
    </div>
</template>

<script>
export default {
    props: {
        /** The value of the input */
        modelValue: {
            type: String,
            default: "",
        },
        /** A placeholder to use */
        placeholder: {
            type: String,
            default: "",
        },
        /** Maximum length of the input */
        maxlength: {
            type: Number,
            default: 255,
        },
        /** Should the field auto complete */
        autocomplete: {
            type: String,
            default: "new-password",
        },
        /** Is the input required? */
        required: {
            type: Boolean,
        },
        /** Should the input be read only? */
        readonly: {
            type: String,
            default: undefined,
        },
        /** The id of the label that names the field (its `for` names this component's wrapper) */
        labelledby: {
            type: String,
            default: null,
        },
        /** The id of the hint that describes the field */
        describedby: {
            type: String,
            default: null,
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            visibility: "password",
        };
    },
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    created() {},
    methods: {
        /**
         * Show users input in plain text
         * @returns {void}
         */
        showInput() {
            this.visibility = "text";
        },
        /**
         * Censor users input
         * @returns {void}
         */
        hideInput() {
            this.visibility = "password";
        },
    },
};
</script>
