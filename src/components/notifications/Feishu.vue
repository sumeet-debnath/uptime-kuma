<template>
    <div class="mb-3">
        <label for="Feishu-WebHookUrl" class="form-label">
            {{ $t("Feishu WebHookUrl") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <input
            id="Feishu-WebHookUrl"
            v-model="$parent.notification.feishuWebHookUrl"
            type="text"
            class="form-control"
            required
            data-agentom-redact
            aria-describedby="feishu-webhook-url-hint feishu-webhook-url-hint-2"
        />
        <div id="feishu-webhook-url-hint" class="form-text">
            <p>
                <span style="color: red"><sup>*</sup></span>
                {{ $t("Required") }}
            </p>
        </div>
        <i18n-t id="feishu-webhook-url-hint-2" tag="div" keypath="wayToGetTeamsURL" class="form-text">
            <a href="https://www.feishu.cn/hc/zh-CN/articles/360024984973" target="_blank">{{ $t("here") }}</a>
        </i18n-t>
    </div>
</template>
