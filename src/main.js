import "bootstrap";
import { createApp, h } from "vue";
import contenteditable from "vue-contenteditable";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/app.scss";
import "./assets/vue-datepicker.scss";
import { i18n } from "./i18n";
import { FontAwesomeIcon } from "./icon.js";
import datetime from "./mixins/datetime";
import mobile from "./mixins/mobile";
import publicMixin from "./mixins/public";
import socket from "./mixins/socket";
import theme from "./mixins/theme";
import lang from "./mixins/lang";
import { router } from "./router";
import { appName } from "./util.ts";
import dayjs from "dayjs";
import timezone from "./modules/dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { loadToastSettings } from "./util-frontend";
import { watchMultiselects } from "./util-multiselect-a11y";
import DOMPurify from "dompurify";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Content the app shows as HTML (descriptions, footers, incidents) mustn't give itself
// Agent Object Model metadata: drop data-agentom-* wherever DOMPurify sanitises.
DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName.startsWith("data-agentom-")) {
        data.keepAttr = false;
    }
});

const app = createApp({
    mixins: [socket, theme, mobile, datetime, publicMixin, lang],
    data() {
        return {
            appName: appName,
        };
    },
    render: () => h(App),
});

app.use(router);
app.use(i18n);

app.use(Toast, loadToastSettings());
app.component("Editable", contenteditable);
app.component("FontAwesomeIcon", FontAwesomeIcon);

const vm = app.mount("#app");

// vue-multiselect's own markup hides its choices from accessibility: corrected by attributes alone
watchMultiselects();

// The Agent Object Model's projector, with the screen (from the route) and its state
// as context. window.__semanticUI is where agents and the audit find it.
const semanticContext = () => {
    const route = router.currentRoute.value;
    const signedOutPage =
        route.matched.some((record) => record.path === "/empty") && !vm.loggedIn && vm.allowLoginDialog;
    let state = "ready";
    if (!vm.socket.connected && !vm.socket.firstConnect) {
        state = "error";
    } else if (!vm.loggedIn && !vm.allowLoginDialog && !route.path.startsWith("/status")) {
        state = "loading";
    }
    return {
        screen: signedOutPage ? "login" : (route.meta.screen ?? "unknown"),
        state,
    };
};
// Built with AGENT_OM=off (the benchmark's patched-off build), the app has no projector.
if (import.meta.env.VITE_AGENT_OM !== "off") {
    import("@agent-om/core").then(({ createSemanticProjector }) => {
        const semanticProjector = createSemanticProjector({ context: semanticContext });
        window.__semanticUI = semanticProjector;
        router.afterEach(() => semanticProjector.refresh());
        vm.$watch(
            () => [vm.loggedIn, vm.allowLoginDialog, vm.socket.connected, vm.socket.firstConnect],
            () => semanticProjector.refresh()
        );
    });
}

// Service Worker
// Mainly for Webpush notification
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js", { scope: "/" }).catch((error) => {
        console.error("Service worker registration failed:", error);
    });
}

// Expose the vue instance for development
if (process.env.NODE_ENV === "development") {
    console.log("Dev Only: window.app is the vue instance");
    window.app = app._instance;
}
