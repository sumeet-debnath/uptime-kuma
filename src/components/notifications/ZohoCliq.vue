<template>
    <div class="mb-3">
        <label for="zcliq-webhookurl" class="form-label">{{ $t("Webhook URL") }}</label>
        <input
            id="zcliq-webhookurl"
            v-model="$parent.notification.webhookUrl"
            type="text"
            class="form-control"
            required
            aria-describedby="zohocliq-webhookurl-hint"
            data-agentom-redact
        />
        <i18n-t id="zohocliq-webhookurl-hint" tag="div" keypath="wayToGetZohoCliqURL" class="form-text">
            <a href="https://www.zoho.com/cliq/help/platform/webhook-tokens.html" target="_blank">{{ $t("here") }}</a>
        </i18n-t>
    </div>
</template>
