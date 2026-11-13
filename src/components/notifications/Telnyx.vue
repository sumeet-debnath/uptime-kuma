<template>
    <div class="mb-3">
        <label id="telnyx-api-key-label" for="telnyx-api-key" class="form-label">{{ $t("telnyxApiKey") }}</label>
        <HiddenInput
            id="telnyx-api-key"
            v-model="$parent.notification.telnyxApiKey"
            labelledby="telnyx-api-key-label"
            describedby="telnyx-api-key-hint"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
        <div id="telnyx-api-key-hint" class="form-text">{{ $t("telnyxApiKeyHelptext") }}</div>
    </div>

    <div class="mb-3">
        <label for="telnyx-phone-number" class="form-label">{{ $t("telnyxPhoneNumber") }}</label>
        <input
            id="telnyx-phone-number"
            v-model="$parent.notification.telnyxPhoneNumber"
            type="text"
            class="form-control"
            placeholder="+15551234567"
            required
            aria-describedby="telnyx-phone-number-hint"
        />
        <div id="telnyx-phone-number-hint" class="form-text">{{ $t("telnyxPhoneNumberHelptext") }}</div>
    </div>

    <div class="mb-3">
        <label for="telnyx-to-number" class="form-label">{{ $t("telnyxToNumber") }}</label>
        <input
            id="telnyx-to-number"
            v-model="$parent.notification.telnyxToNumber"
            type="text"
            class="form-control"
            placeholder="+15559876543"
            required
            aria-describedby="telnyx-to-number-hint"
        />
        <div id="telnyx-to-number-hint" class="form-text">{{ $t("telnyxToNumberHelptext") }}</div>
    </div>

    <div class="mb-3">
        <label for="telnyx-messaging-profile-id" class="form-label">{{ $t("telnyxMessagingProfileId") }}</label>
        <input
            id="telnyx-messaging-profile-id"
            v-model="$parent.notification.telnyxMessagingProfileId"
            type="text"
            class="form-control"
            aria-describedby="telnyx-messaging-profile-id-hint"
        />
        <div id="telnyx-messaging-profile-id-hint" class="form-text">{{ $t("telnyxMessagingProfileIdHelptext") }}</div>
    </div>

    <div class="mb-3">
        <i18n-t tag="p" keypath="More info on:" style="margin-top: 8px">
            <a href="https://developers.telnyx.com/docs/messaging/messages/send-sms-mms" target="_blank">
                https://developers.telnyx.com/docs/messaging
            </a>
        </i18n-t>
    </div>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";

export default {
    components: {
        HiddenInput,
    },
};
</script>
