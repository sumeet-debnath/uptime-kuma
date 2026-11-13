<template>
    <div
        class="shadow-box alert mb-4 p-4 incident"
        role="group"
        :aria-label="$t(modelValue.id ? 'Edit Incident' : 'Create Incident')"
        :class="'bg-' + modelValue.style"
        data-testid="incident-edit"
    >
        <strong id="incident-form-title-label">{{ $t("Title") }}:</strong>
        <Editable
            :model-value="modelValue.title"
            tag="h4"
            :contenteditable="true"
            :noNL="true"
            class="alert-heading"
            data-testid="incident-title"
            role="textbox"
            aria-labelledby="incident-form-title-label"
            data-agentom-id="incident-form.title"
            @update:model-value="updateField('title', $event)"
        />

        <strong id="incident-form-content-label">{{ $t("Content") }}:</strong>
        <Editable
            :model-value="modelValue.content"
            tag="div"
            :contenteditable="true"
            class="content"
            data-testid="incident-content-editable"
            role="textbox"
            aria-multiline="true"
            aria-labelledby="incident-form-content-label"
            aria-describedby="incident-form-content-hint"
            data-agentom-id="incident-form.content"
            @update:model-value="updateField('content', $event)"
        />
        <div id="incident-form-content-hint" class="form-text">
            {{ $t("markdownSupported") }}
        </div>

        <div class="mt-3">
            <button
                class="btn btn-light me-2"
                data-testid="post-incident-button"
                data-agentom-id="incident-form.post"
                data-agentom-risk="sensitive"
                data-agentom-action="post-incident"
                @click="$emit('post')"
            >
                <font-awesome-icon icon="bullhorn" />
                {{ $t("Post") }}
            </button>

            <button class="btn btn-light me-2" @click="$emit('cancel')">
                <font-awesome-icon icon="times" />
                {{ $t("Cancel") }}
            </button>

            <div class="dropdown d-inline-block me-2">
                <button
                    id="dropdownMenuButton1"
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-controls="incident-style-menu"
                    aria-describedby="incident-style-choices"
                    data-agentom-id="incident-form.style"
                >
                    {{ $t("Style") }}: {{ $t(modelValue.style) }}
                </button>
                <ul id="incident-style-menu" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            role="button"
                            :aria-pressed="modelValue.style === 'info' ? 'true' : 'false'"
                            @click.prevent="updateField('style', 'info')"
                        >
                            {{ $t("info") }}
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            role="button"
                            :aria-pressed="modelValue.style === 'warning' ? 'true' : 'false'"
                            @click.prevent="updateField('style', 'warning')"
                        >
                            {{ $t("warning") }}
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            role="button"
                            :aria-pressed="modelValue.style === 'danger' ? 'true' : 'false'"
                            @click.prevent="updateField('style', 'danger')"
                        >
                            {{ $t("danger") }}
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            role="button"
                            :aria-pressed="modelValue.style === 'primary' ? 'true' : 'false'"
                            @click.prevent="updateField('style', 'primary')"
                        >
                            {{ $t("primary") }}
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            role="button"
                            :aria-pressed="modelValue.style === 'light' ? 'true' : 'false'"
                            @click.prevent="updateField('style', 'light')"
                        >
                            {{ $t("light") }}
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            role="button"
                            :aria-pressed="modelValue.style === 'dark' ? 'true' : 'false'"
                            @click.prevent="updateField('style', 'dark')"
                        >
                            {{ $t("dark") }}
                        </a>
                    </li>
                </ul>
                <span id="incident-style-choices" hidden>
                    {{
                        $t("choicesAria", [
                            ["info", "warning", "danger", "primary", "light", "dark"].map((s) => $t(s)).join(", "),
                        ])
                    }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "IncidentEditForm",
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },
    emits: ["update:modelValue", "post", "cancel"],
    methods: {
        updateField(field, value) {
            this.$emit("update:modelValue", {
                ...this.modelValue,
                [field]: value,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.incident {
    .content {
        &[contenteditable="true"] {
            min-height: 60px;
        }
    }
}
</style>
