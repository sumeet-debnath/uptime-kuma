<template>
    <div class="mb-3">
        <label for="nostr-relays" class="form-label">
            {{ $t("nostrRelays") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <textarea
            id="nostr-relays"
            v-model="$parent.notification.relays"
            class="form-control"
            :required="true"
            aria-describedby="nostr-relays-hint"
            placeholder="wss://127.0.0.1:7777/"
        ></textarea>
        <small id="nostr-relays-hint" class="form-text text-muted">{{ $t("nostrRelaysHelp") }}</small>
    </div>
    <div class="mb-3">
        <label id="nostr-sender-label" for="nostr-sender" class="form-label">
            {{ $t("nostrSender") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <HiddenInput
            id="nostr-sender"
            v-model="$parent.notification.sender"
            labelledby="nostr-sender-label"
            autocomplete="new-password"
            :required="true"
        ></HiddenInput>
    </div>
    <div class="mb-3">
        <label for="nostr-recipients" class="form-label">
            {{ $t("nostrRecipients") }}
            <span style="color: red"><sup>*</sup></span>
        </label>
        <textarea
            id="nostr-recipients"
            v-model="$parent.notification.recipients"
            class="form-control"
            :required="true"
            aria-describedby="nostr-recipients-hint"
            placeholder="npub123...&#10;npub789..."
        ></textarea>
        <small id="nostr-recipients-hint" class="form-text text-muted">{{ $t("nostrRecipientsHelp") }}</small>
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
