<template>
    <div class="mb-3">
        <label id="spugpush-templateKey-label" for="spugpush-templateKey" class="form-label">
            {{ $t("SpugPush Template Code") }}
        </label>
        <HiddenInput
            id="spugpush-templateKey"
            v-model="$parent.notification.templateKey"
            labelledby="spugpush-templateKey-label"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
    </div>
    <i18n-t tag="p" keypath="More info on:" style="margin-top: 8px">
        <a href="https://push.spug.cc/guide/plugin/kuma" rel="noopener noreferrer" target="_blank">
            https://push.spug.cc
        </a>
    </i18n-t>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";

export default {
    components: {
        HiddenInput,
    },
};
</script>
