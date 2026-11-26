import { createRouter, createWebHistory } from "vue-router";

import EmptyLayout from "./layouts/EmptyLayout.vue";
import Layout from "./layouts/Layout.vue";
import Dashboard from "./pages/Dashboard.vue";
import DashboardHome from "./pages/DashboardHome.vue";
import Details from "./pages/Details.vue";
import EditMonitor from "./pages/EditMonitor.vue";
import EditMaintenance from "./pages/EditMaintenance.vue";
import List from "./pages/List.vue";
const Settings = () => import("./pages/Settings.vue");
import Setup from "./pages/Setup.vue";
import StatusPage from "./pages/StatusPage.vue";
import Entry from "./pages/Entry.vue";
import ManageStatusPage from "./pages/ManageStatusPage.vue";
import AddStatusPage from "./pages/AddStatusPage.vue";
import NotFound from "./pages/NotFound.vue";
import DockerHosts from "./components/settings/Docker.vue";
import ManageMaintenance from "./pages/ManageMaintenance.vue";
import APIKeys from "./components/settings/APIKeys.vue";
import SetupDatabase from "./pages/SetupDatabase.vue";

// Settings - Sub Pages
import Appearance from "./components/settings/Appearance.vue";
import General from "./components/settings/General.vue";
const Notifications = () => import("./components/settings/Notifications.vue");
import ReverseProxy from "./components/settings/ReverseProxy.vue";
import Tags from "./components/settings/Tags.vue";
import MonitorHistory from "./components/settings/MonitorHistory.vue";
const Security = () => import("./components/settings/Security.vue");
import Proxies from "./components/settings/Proxies.vue";
import About from "./components/settings/About.vue";
import RemoteBrowsers from "./components/settings/RemoteBrowsers.vue";

const routes = [
    {
        path: "/",
        component: Entry,
    },
    {
        // If it is "/dashboard", the active link is not working
        // If it is "", it overrides the "/" unexpectedly
        // Give a random name to solve the problem.
        path: "/empty",
        component: Layout,
        children: [
            {
                path: "",
                component: Dashboard,
                children: [
                    {
                        name: "DashboardHome",
                        path: "/dashboard",
                        component: DashboardHome,
                        meta: { screen: "dashboard" },
                        children: [
                            {
                                path: "/dashboard/:id",
                                component: EmptyLayout,
                                meta: { sitemap: { params: { id: "monitorId" } } },
                                children: [
                                    {
                                        path: "",
                                        component: Details,
                                        meta: { screen: "monitor.details", sitemap: { name: "Monitor details" } },
                                    },
                                    {
                                        path: "/edit/:id",
                                        component: EditMonitor,
                                        meta: { screen: "monitor.edit", sitemap: { name: "Edit monitor" } },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "/add",
                        component: EditMonitor,
                        meta: { screen: "monitor.add", sitemap: { name: "Add monitor" } },
                        children: [
                            {
                                path: "/clone/:id",
                                component: EditMonitor,
                                meta: { screen: "monitor.clone", sitemap: { name: "Clone monitor" } },
                            },
                        ],
                    },
                    {
                        path: "/list",
                        component: List,
                        meta: { screen: "monitor.list", sitemap: { name: "Monitor list" } },
                    },
                    {
                        path: "/settings",
                        component: Settings,
                        meta: { screen: "settings" },
                        children: [
                            {
                                path: "general",
                                component: General,
                                meta: { screen: "settings.general" },
                            },
                            {
                                path: "appearance",
                                component: Appearance,
                                meta: { screen: "settings.appearance" },
                            },
                            {
                                path: "notifications",
                                component: Notifications,
                                meta: { screen: "settings.notifications" },
                            },
                            {
                                path: "reverse-proxy",
                                component: ReverseProxy,
                                meta: { screen: "settings.reverse-proxy" },
                            },
                            {
                                path: "tags",
                                component: Tags,
                                meta: { screen: "settings.tags" },
                            },
                            {
                                path: "monitor-history",
                                component: MonitorHistory,
                                meta: { screen: "settings.monitor-history" },
                            },
                            {
                                path: "docker-hosts",
                                component: DockerHosts,
                                meta: { screen: "settings.docker-hosts" },
                            },
                            {
                                path: "remote-browsers",
                                component: RemoteBrowsers,
                                meta: { screen: "settings.remote-browsers" },
                            },
                            {
                                path: "security",
                                component: Security,
                                meta: { screen: "settings.security" },
                            },
                            {
                                path: "api-keys",
                                component: APIKeys,
                                meta: { screen: "settings.api-keys" },
                            },
                            {
                                path: "proxies",
                                component: Proxies,
                                meta: { screen: "settings.proxies" },
                            },
                            {
                                path: "about",
                                component: About,
                                meta: { screen: "settings.about" },
                            },
                        ],
                    },
                    {
                        path: "/manage-status-page",
                        component: ManageStatusPage,
                        meta: { screen: "status-page.list", sitemap: { name: "Status pages" } },
                    },
                    {
                        path: "/add-status-page",
                        component: AddStatusPage,
                        meta: { screen: "status-page.add", sitemap: { name: "New status page" } },
                    },
                    {
                        path: "/maintenance",
                        component: ManageMaintenance,
                        meta: { screen: "maintenance.list" },
                    },
                    {
                        path: "/add-maintenance",
                        component: EditMaintenance,
                        meta: { screen: "maintenance.add", sitemap: { name: "Schedule maintenance" } },
                    },
                    {
                        path: "/maintenance/edit/:id",
                        component: EditMaintenance,
                        meta: { screen: "maintenance.edit", sitemap: { params: { id: "maintenanceId" } } },
                    },
                    {
                        path: "/maintenance/clone/:id",
                        component: EditMaintenance,
                        meta: { screen: "maintenance.clone", sitemap: { params: { id: "maintenanceId" } } },
                    },
                ],
            },
        ],
    },
    {
        path: "/setup",
        component: Setup,
        meta: { screen: "setup", sitemap: false },
    },
    {
        path: "/setup-database",
        component: SetupDatabase,
        meta: { screen: "setup.database", sitemap: false },
    },
    {
        path: "/status-page",
        component: StatusPage,
    },
    {
        path: "/status",
        component: StatusPage,
    },
    {
        path: "/status/:slug",
        component: StatusPage,
        meta: { screen: "status-page.view", sitemap: { name: "Status page" } },
    },
    {
        path: "/:pathMatch(.*)*",
        component: NotFound,
    },
];

export const router = createRouter({
    linkActiveClass: "active",
    history: createWebHistory(),
    routes,
});
