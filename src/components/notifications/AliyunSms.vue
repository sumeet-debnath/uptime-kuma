<template>
    <div class="mb-3">
        <label id="accessKeyId-label" for="accessKeyId" class="form-label">
            {{ $t("AccessKeyId") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <HiddenInput
            id="accessKeyId"
            v-model="$parent.notification.accessKeyId"
            labelledby="accessKeyId-label"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>

        <label id="secretAccessKey-label" for="secretAccessKey" class="form-label">
            {{ $t("SecretAccessKey") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <HiddenInput
            id="secretAccessKey"
            v-model="$parent.notification.secretAccessKey"
            labelledby="secretAccessKey-label"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>

        <label id="phonenumber-label" for="phonenumber" class="form-label">
            {{ $t("PhoneNumbers") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <HiddenInput
            id="phonenumber"
            v-model="$parent.notification.phonenumber"
            labelledby="phonenumber-label"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>

        <label for="templateCode" class="form-label">
            {{ $t("TemplateCode") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <input
            id="templateCode"
            v-model="$parent.notification.templateCode"
            type="text"
            class="form-control"
            required
        />

        <label for="signName" class="form-label">
            {{ $t("SignName") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <input id="signName" v-model="$parent.notification.signName" type="text" class="form-control" required />
        <div class="form-check form-switch">
            <label id="aliyunsms-optional-parameters-label" class="form-check-label">
                {{ $t("OptionalParameters") }}
            </label>
            <input
                id="optionalParameters"
                v-model="$parent.notification.optionalParameters"
                class="form-check-input"
                type="checkbox"
                aria-labelledby="aliyunsms-optional-parameters-label"
                aria-describedby="aliyunsms-optional-parameters-hint"
            />
            <div id="aliyunsms-optional-parameters-hint" class="form-text">
                {{ $t("aliyun_enable_optional_variables_at_the_risk_of_non_delivery") }}
            </div>
        </div>
        <br />
        <div class="form-text">
            <i18n-t tag="p" keypath="aliyun-template-requirements-and-parameters">
                <template #parameters>
                    <code>${name} ${time} ${status}</code>
                </template>
            </i18n-t>
            <i18n-t tag="p" keypath="aliyun-template-optional-parameters">
                <template #parameters>
                    <code>${msg}</code>
                </template>
            </i18n-t>
            <i18n-t tag="p" keypath="Read more:">
                <a href="https://help.aliyun.com/document_detail/101414.html" target="_blank">
                    https://help.aliyun.com/document_detail/101414.html
                </a>
            </i18n-t>
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
