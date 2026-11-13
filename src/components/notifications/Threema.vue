<template>
    <div class="mb-3">
        <label class="form-label" for="threema-recipient">{{ $t("threemaRecipientType") }}</label>
        <select id="threema-recipient" v-model="$parent.notification.threemaRecipientType" required class="form-select">
            <option value="identity">{{ $t("threemaRecipientTypeIdentity") }}</option>
            <option value="phone">{{ $t("threemaRecipientTypePhone") }}</option>
            <option value="email">{{ $t("threemaRecipientTypeEmail") }}</option>
        </select>
    </div>
    <div v-if="$parent.notification.threemaRecipientType === 'identity'" class="mb-3">
        <label class="form-label" for="threema-recipient">
            {{ $t("threemaRecipient") }} {{ $t("threemaRecipientTypeIdentity") }}
        </label>
        <input
            id="threema-recipient"
            v-model="$parent.notification.threemaRecipient"
            class="form-control"
            minlength="8"
            maxlength="8"
            pattern="[A-Z0-9]{8}"
            required
            type="text"
            aria-describedby="threema-recipient-identity-hint"
        />
        <div id="threema-recipient-identity-hint" class="form-text">
            <p>{{ $t("threemaRecipientTypeIdentityFormat") }}</p>
        </div>
    </div>
    <div v-else-if="$parent.notification.threemaRecipientType === 'phone'" class="mb-3">
        <label class="form-label" for="threema-recipient">
            {{ $t("threemaRecipient") }} {{ $t("threemaRecipientTypePhone") }}
        </label>
        <input
            id="threema-recipient"
            v-model="$parent.notification.threemaRecipient"
            class="form-control"
            maxlength="15"
            pattern="\d{1,15}"
            required
            type="text"
            aria-describedby="threema-recipient-phone-hint"
        />
        <div id="threema-recipient-phone-hint" class="form-text">
            <p>{{ $t("threemaRecipientTypePhoneFormat") }}</p>
        </div>
    </div>
    <div v-else-if="$parent.notification.threemaRecipientType === 'email'" class="mb-3">
        <label class="form-label" for="threema-recipient">
            {{ $t("threemaRecipient") }} {{ $t("threemaRecipientTypeEmail") }}
        </label>
        <input
            id="threema-recipient"
            v-model="$parent.notification.threemaRecipient"
            class="form-control"
            maxlength="254"
            required
            type="email"
        />
    </div>
    <div class="mb-3">
        <label class="form-label" for="threema-sender">{{ $t("threemaSenderIdentity") }}</label>
        <input
            id="threema-sender"
            v-model="$parent.notification.threemaSenderIdentity"
            class="form-control"
            minlength="8"
            maxlength="8"
            pattern="^\*[A-Z0-9]{7}$"
            required
            type="text"
            aria-describedby="threema-sender-hint"
        />
        <div id="threema-sender-hint" class="form-text">
            <p>{{ $t("threemaSenderIdentityFormat") }}</p>
        </div>
    </div>
    <div class="mb-3">
        <label id="threema-secret-label" class="form-label" for="threema-secret">
            {{ $t("threemaApiAuthenticationSecret") }}
        </label>
        <HiddenInput
            id="threema-secret"
            v-model="$parent.notification.threemaSecret"
            labelledby="threema-secret-label"
            required
            autocomplete="false"
        ></HiddenInput>
    </div>
    <i18n-t class="form-text" keypath="wayToGetThreemaGateway" tag="div">
        <a href="https://threema.ch/en/gateway" target="_blank">{{ $t("here") }}</a>
    </i18n-t>
    <i18n-t class="form-text" keypath="threemaBasicModeInfo" tag="div">
        <a href="https://gateway.threema.ch/en/developer/api" target="_blank">{{ $t("here") }}</a>
    </i18n-t>
</template>
<script lang="ts" setup>
import HiddenInput from "../HiddenInput.vue";
</script>
