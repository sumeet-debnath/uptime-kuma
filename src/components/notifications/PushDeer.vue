<template>
    <div class="mb-3">
        <label for="pushdeer-server" class="form-label">{{ $t("PushDeer Server URL") }}</label>
        <input
            id="pushdeer-server"
            v-model="$parent.notification.pushdeerServer"
            aria-describedby="pushdeer-server-hint"
            type="text"
            class="form-control"
            placeholder="https://api2.pushdeer.com"
        />
        <div id="pushdeer-server-hint" class="form-text">{{ $t("pushDeerServerDescription") }}</div>
    </div>
    <div class="mb-3">
        <label id="pushdeer-key-label" for="pushdeer-key" class="form-label">{{ $t("PushDeer Key") }}</label>
        <HiddenInput
            id="pushdeer-key"
            v-model="$parent.notification.pushdeerKey"
            labelledby="pushdeer-key-label"
            :required="true"
            autocomplete="new-password"
            placeholder="PDUxxxx"
        ></HiddenInput>
    </div>

    <i18n-t tag="p" keypath="More info on:" style="margin-top: 8px">
        <a href="http://www.pushdeer.com/" rel="noopener noreferrer" target="_blank">http://www.pushdeer.com/</a>
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
