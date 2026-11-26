<template>
    <div
        class="shadow-box alert mb-4 p-4 incident"
        role="alert"
        :class="'bg-' + modelValue.style"
        data-testid="incident-edit"
    >
        <strong>{{ $t("Title") }}:</strong>
        <Editable
            :model-value="modelValue.title"
            tag="h4"
            :contenteditable="true"
            :noNL="true"
            class="alert-heading"
            role="textbox"
            :aria-label="$t('incidentTitleField')"
            data-testid="incident-title"
            @update:model-value="updateField('title', $event)"
        />

        <strong>{{ $t("Content") }}:</strong>
        <Editable
            :model-value="modelValue.content"
            tag="div"
            :contenteditable="true"
            class="content"
            role="textbox"
            aria-multiline="true"
            :aria-label="$t('incidentContentField')"
            data-testid="incident-content-editable"
            @update:model-value="updateField('content', $event)"
        />
        <div class="form-text">
            {{ $t("markdownSupported") }}
        </div>

        <div class="mt-3">
            <button
                class="btn btn-light me-2"
                data-testid="post-incident-button"
                data-agentom-risk="sensitive"
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
                    aria-haspopup="menu"
                >
                    {{ $t("Style") }}: {{ $t(modelValue.style) }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" role="menu">
                    <li role="none">
                        <a
                            class="dropdown-item"
                            href="#"
                            role="menuitemradio"
                            :aria-checked="String(modelValue.style === 'info')"
                            @click.prevent="updateField('style', 'info')"
                        >
                            {{ $t("info") }}
                        </a>
                    </li>
                    <li role="none">
                        <a
                            class="dropdown-item"
                            href="#"
                            role="menuitemradio"
                            :aria-checked="String(modelValue.style === 'warning')"
                            @click.prevent="updateField('style', 'warning')"
                        >
                            {{ $t("warning") }}
                        </a>
                    </li>
                    <li role="none">
                        <a
                            class="dropdown-item"
                            href="#"
                            role="menuitemradio"
                            :aria-checked="String(modelValue.style === 'danger')"
                            @click.prevent="updateField('style', 'danger')"
                        >
                            {{ $t("danger") }}
                        </a>
                    </li>
                    <li role="none">
                        <a
                            class="dropdown-item"
                            href="#"
                            role="menuitemradio"
                            :aria-checked="String(modelValue.style === 'primary')"
                            @click.prevent="updateField('style', 'primary')"
                        >
                            {{ $t("primary") }}
                        </a>
                    </li>
                    <li role="none">
                        <a
                            class="dropdown-item"
                            href="#"
                            role="menuitemradio"
                            :aria-checked="String(modelValue.style === 'light')"
                            @click.prevent="updateField('style', 'light')"
                        >
                            {{ $t("light") }}
                        </a>
                    </li>
                    <li role="none">
                        <a
                            class="dropdown-item"
                            href="#"
                            role="menuitemradio"
                            :aria-checked="String(modelValue.style === 'dark')"
                            @click.prevent="updateField('style', 'dark')"
                        >
                            {{ $t("dark") }}
                        </a>
                    </li>
                </ul>
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
