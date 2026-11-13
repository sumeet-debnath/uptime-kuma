<template>
    <div class="mb-3">
        <label id="vkteams-bot-token-label" for="vkteams-bot-token" class="form-label">{{ $t("Bot Token") }}</label>
        <HiddenInput
            id="vkteams-bot-token"
            v-model="$parent.notification.vkteamsBotToken"
            labelledby="vkteams-bot-token-label"
            describedby="vkteams-bot-token-hint"
            :required="true"
            autocomplete="new-password"
        ></HiddenInput>
        <i18n-t id="vkteams-bot-token-hint" tag="div" keypath="VKTeams Bot Token Description" class="form-text">
            <a href="https://teams.vk.com/botapi/" target="_blank">https://teams.vk.com/botapi/</a>
        </i18n-t>
    </div>

    <div class="mb-3">
        <label for="vkteams-bot-chat-id" class="form-label">{{ $t("Chat ID") }}</label>
        <input
            id="vkteams-bot-chat-id"
            v-model="$parent.notification.vkteamsChatId"
            type="text"
            class="form-control"
            placeholder="*****@chat.agent"
            required
            aria-describedby="vkteams-chat-id-hint"
        />
        <div id="vkteams-chat-id-hint" class="form-text">
            {{ $t("VKTeams Chat Id Description") }}
        </div>
    </div>

    <div class="mb-3">
        <label for="vkteams-api-url" class="form-label">{{ $t("API URL") }}</label>
        <input
            id="vkteams-api-url"
            v-model="$parent.notification.vkteamsBaseUrl"
            type="text"
            class="form-control"
            required
            aria-describedby="vkteams-api-url-hint"
        />
        <div id="vkteams-api-url-hint" class="form-text">
            {{ $t("VKTeams Base Url Description") }}
        </div>
    </div>

    <div class="mb-3">
        <div class="form-check form-switch">
            <input
                v-model="$parent.notification.vkteamsUseTemplate"
                class="form-check-input"
                type="checkbox"
                aria-labelledby="vkteams-use-template-label"
                aria-describedby="vkteams-use-template-hint"
            />
            <label id="vkteams-use-template-label" class="form-check-label">{{ $t("VKTeams Use Template") }}</label>
        </div>
        <div id="vkteams-use-template-hint" class="form-text">
            {{ $t("VKTeams Use Template Description") }}
        </div>
    </div>

    <template v-if="$parent.notification.vkteamsUseTemplate">
        <div class="mb-3">
            <label class="form-label" for="vkteams-message-format">{{ $t("Message Format") }}</label>
            <select
                id="vkteams-message-format"
                v-model="$parent.notification.vkteamsTemplateFormat"
                class="form-select"
                required
                aria-describedby="vkteams-message-format-hint"
            >
                <option value="plain">{{ $t("Plain Text") }}</option>
                <option value="MarkdownV2">MarkdownV2</option>
                <option value="HTML">HTML</option>
            </select>
            <p id="vkteams-message-format-hint" class="form-text">
                {{ $t("VKTeams Template Format Description") }}
            </p>

            <label class="form-label" for="vkteams-message-template">{{ $t("Message Template") }}</label>
            <TemplatedTextarea
                id="vkteams-message-template"
                v-model="$parent.notification.vkteamsTemplate"
                :required="true"
            ></TemplatedTextarea>
        </div>
    </template>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";
import TemplatedTextarea from "../TemplatedTextarea.vue";

export default {
    components: {
        TemplatedTextarea,
        HiddenInput,
    },
    mounted() {
        this.$parent.notification.vkteamsBaseUrl ||= "https://myteam.mail.ru";
        this.$parent.notification.vkteamsTemplateFormat ||= "plain";
    },
};
</script>
