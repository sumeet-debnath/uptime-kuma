<template>
    <div class="mb-3">
        <label id="line-channel-access-token-label" for="line-channel-access-token" class="form-label">
            {{ $t("Channel access token (Long-lived)") }}
        </label>
        <HiddenInput
            id="line-channel-access-token"
            v-model="$parent.notification.lineChannelAccessToken"
            labelledby="line-channel-access-token-label"
            describedby="line-channel-access-token-hint"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
    </div>
    <i18n-t id="line-channel-access-token-hint" tag="div" keypath="lineDevConsoleTo" class="form-text">
        <b>{{ $t("Messaging API") }}</b>
    </i18n-t>
    <div class="mb-3" style="margin-top: 12px">
        <label for="line-user-id" class="form-label">{{ $t("Your User ID") }}</label>
        <input
            id="line-user-id"
            v-model="$parent.notification.lineUserID"
            type="text"
            class="form-control"
            aria-describedby="line-user-id-hint"
            required
        />
    </div>
    <i18n-t id="line-user-id-hint" tag="div" keypath="lineDevConsoleTo" class="form-text">
        <b>{{ $t("Basic Settings") }}</b>
    </i18n-t>
    <i18n-t tag="div" keypath="wayToGetLineChannelToken" class="form-text" style="margin-top: 8px">
        <a href="https://developers.line.biz/console/" target="_blank">{{ $t("Line Developers Console") }}</a>
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
