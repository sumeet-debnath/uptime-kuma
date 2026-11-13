<template>
    <div class="mb-3">
        <label for="ooredoo-username" class="form-label">{{ $t("Username") }}</label>
        <input
            id="ooredoo-username"
            v-model="$parent.notification.ooredooUsername"
            type="text"
            class="form-control"
            aria-describedby="ooredoo-username-hint"
            required
        />
        <div id="ooredoo-username-hint" class="form-text">{{ $t("ooredooUsernameDescription") }}</div>
    </div>
    <div class="mb-3">
        <label id="ooredoo-access-key-label" for="ooredoo-access-key" class="form-label">{{ $t("Access Key") }}</label>
        <HiddenInput
            id="ooredoo-access-key"
            v-model="$parent.notification.ooredooAccessKey"
            labelledby="ooredoo-access-key-label"
            describedby="ooredoo-access-key-hint"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
        <div id="ooredoo-access-key-hint" class="form-text">{{ $t("ooredooAccessKeyDescription") }}</div>
    </div>
    <div class="mb-3">
        <label id="ooredoo-bearer-token-label" for="ooredoo-bearer-token" class="form-label">
            {{ $t("Bearer Token") }}
        </label>
        <HiddenInput
            id="ooredoo-bearer-token"
            v-model="$parent.notification.ooredooBearerToken"
            labelledby="ooredoo-bearer-token-label"
            describedby="ooredoo-bearer-token-hint"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
        <div id="ooredoo-bearer-token-hint" class="form-text">{{ $t("ooredooBearerTokenDescription") }}</div>
    </div>
    <div class="mb-3">
        <label for="ooredoo-to-number" class="form-label">{{ $t("Recipient Number") }}</label>
        <input
            id="ooredoo-to-number"
            v-model="$parent.notification.ooredooToNumber"
            type="text"
            class="form-control"
            aria-describedby="ooredoo-to-number-hint"
            required
        />
        <div id="ooredoo-to-number-hint" class="form-text">{{ $t("ooredooRecipientDescription") }}</div>
    </div>
    <div class="mb-3">
        <label for="ooredoo-server-url" class="form-label">{{ $t("API URL") }}</label>
        <input
            id="ooredoo-server-url"
            v-model="$parent.notification.ooredooServerUrl"
            type="text"
            class="form-control"
            aria-describedby="ooredoo-server-url-hint"
            placeholder="https://o-papi1-lb01.ooredoo.mv/bulk_sms/v2"
        />
        <div id="ooredoo-server-url-hint" class="form-text">
            {{ $t("Leave blank to use the default Ooredoo endpoint.") }}
        </div>
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
