<template>
    <div class="mb-3">
        <label for="egosms-username" class="form-label">{{ $t("API Username") }}</label>
        <i18n-t tag="div" class="form-text" keypath="wayToGetEgoSMSToken">
            <a href="https://www.egosms.co/" target="_blank">{{ $t("here") }}</a>
        </i18n-t>
        <input
            id="egosms-username"
            v-model="$parent.notification.egosmsUsername"
            type="text"
            class="form-control"
            required
        />
    </div>
    <div class="mb-3">
        <label id="egosms-password-label" for="egosms-password" class="form-label">{{ $t("Password") }}</label>
        <HiddenInput
            id="egosms-password"
            v-model="$parent.notification.egosmsPassword"
            labelledby="egosms-password-label"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
    </div>
    <div class="mb-3">
        <label for="egosms-sender" class="form-label">{{ $t("From Name/Number") }}</label>
        <input
            id="egosms-sender"
            v-model="$parent.notification.egosmsSender"
            type="text"
            maxlength="11"
            class="form-control"
            placeholder="EGOSMS"
            aria-describedby="egosms-sender-hint"
        />
        <div id="egosms-sender-hint" class="form-text">{{ $t("egosmsSenderDescription") }}</div>
    </div>
    <div class="mb-3">
        <label for="egosms-phoneNumber" class="form-label">{{ $t("Recipient Number") }}</label>
        <input
            id="egosms-phoneNumber"
            v-model="$parent.notification.egosmsPhoneNumber"
            type="text"
            class="form-control"
            placeholder="2567XXXXXXXX"
            required
            aria-describedby="egosms-phone-number-hint"
        />
        <div id="egosms-phone-number-hint" class="form-text">{{ $t("egosmsPhoneNumberDescription") }}</div>
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
