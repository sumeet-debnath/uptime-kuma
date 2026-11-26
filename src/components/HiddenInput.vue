<template>
    <div class="input-group mb-3">
        <input
            ref="input"
            v-model="model"
            :type="visibility"
            class="form-control"
            :aria-labelledby="labelId"
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
            :aria-labelledby="labelId ? `${uid}-show ${labelId}` : undefined"
            :aria-label="labelId ? undefined : $t('showValue')"
            @click="showInput()"
        >
            <font-awesome-icon icon="eye" />
            <span :id="`${uid}-show`" hidden>{{ $t("showValue") }}</span>
        </a>
        <a
            v-if="visibility == 'text'"
            class="btn btn-outline-primary"
            role="button"
            :aria-labelledby="labelId ? `${uid}-hide ${labelId}` : undefined"
            :aria-label="labelId ? undefined : $t('hideValue')"
            @click="hideInput()"
        >
            <font-awesome-icon icon="eye-slash" />
            <span :id="`${uid}-hide`" hidden>{{ $t("hideValue") }}</span>
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
    },
    emits: ["update:modelValue"],
    data() {
        return {
            visibility: "password",
            uid: `hidden-input-${this.$.uid}`,
            labelId: undefined,
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
    mounted() {
        // the <label for> the caller wrote for this field; give it an id to point at, if it has none
        const id = this.$attrs.id;
        const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
        if (label) {
            label.id ||= `${id}-label`;
            this.labelId = label.id;
        }
    },
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
