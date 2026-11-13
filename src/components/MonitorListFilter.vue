<template>
    <MonitorListFilterDropdown
        filter-name="status"
        :filterActive="filterState.status?.length > 0 || filterState.active?.length > 0"
    >
        <template #status>
            <Status
                v-if="filterState.status?.length === 1 && !filterState.active?.length"
                :status="filterState.status[0]"
            />
            <span
                v-else-if="!filterState.status?.length && filterState.active?.length === 1"
                class="badge status-pill"
                :class="filterState.active[0] ? 'running' : 'paused'"
            >
                <font-awesome-icon :icon="filterState.active[0] ? 'play' : 'pause'" class="icon-small" />
                {{ filterState.active[0] ? $t("Running") : $t("filterActivePaused") }}
            </span>
            <span v-else>
                {{ $t("Status") }}
            </span>
        </template>
        <template #dropdown>
            <li>
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="checkbox"
                    :aria-checked="filterState.status?.includes(1) ? 'true' : 'false'"
                    :aria-label="$t('Up')"
                    aria-describedby="monitor-filter-status-up-count"
                    data-agentom-id="monitors.filter.status.up"
                    @click.stop="toggleStatusFilter(1)"
                >
                    <span id="monitor-filter-status-up-count" hidden>{{ $t("Monitors", $root.stats.up) }}</span>
                    <div class="d-flex align-items-center justify-content-between">
                        <Status :status="1" />
                        <span class="ps-3">
                            {{ $root.stats.up }}
                            <span v-if="filterState.status?.includes(1)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li>
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="checkbox"
                    :aria-checked="filterState.status?.includes(0) ? 'true' : 'false'"
                    :aria-label="$t('Down')"
                    aria-describedby="monitor-filter-status-down-count"
                    data-agentom-id="monitors.filter.status.down"
                    @click.stop="toggleStatusFilter(0)"
                >
                    <span id="monitor-filter-status-down-count" hidden>{{ $t("Monitors", $root.stats.down) }}</span>
                    <div class="d-flex align-items-center justify-content-between">
                        <Status :status="0" />
                        <span class="ps-3">
                            {{ $root.stats.down }}
                            <span v-if="filterState.status?.includes(0)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li>
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="checkbox"
                    :aria-checked="filterState.status?.includes(2) ? 'true' : 'false'"
                    :aria-label="$t('Pending')"
                    aria-describedby="monitor-filter-status-pending-count"
                    data-agentom-id="monitors.filter.status.pending"
                    @click.stop="toggleStatusFilter(2)"
                >
                    <span id="monitor-filter-status-pending-count" hidden>
                        {{ $t("Monitors", $root.stats.pending) }}
                    </span>
                    <div class="d-flex align-items-center justify-content-between">
                        <Status :status="2" />
                        <span class="ps-3">
                            {{ $root.stats.pending }}
                            <span v-if="filterState.status?.includes(2)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li>
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="checkbox"
                    :aria-checked="filterState.status?.includes(3) ? 'true' : 'false'"
                    :aria-label="$t('statusMaintenance')"
                    aria-describedby="monitor-filter-status-maintenance-count"
                    data-agentom-id="monitors.filter.status.maintenance"
                    @click.stop="toggleStatusFilter(3)"
                >
                    <span id="monitor-filter-status-maintenance-count" hidden>
                        {{ $t("Monitors", $root.stats.maintenance) }}
                    </span>
                    <div class="d-flex align-items-center justify-content-between">
                        <Status :status="3" />
                        <span class="ps-3">
                            {{ $root.stats.maintenance }}
                            <span v-if="filterState.status?.includes(3)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li>
                <hr class="dropdown-divider" />
            </li>
            <li>
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="checkbox"
                    :aria-checked="filterState.active?.includes(true) ? 'true' : 'false'"
                    :aria-label="$t('Running')"
                    aria-describedby="monitor-filter-status-running-count"
                    data-agentom-id="monitors.filter.status.running"
                    @click.stop="toggleActiveFilter(true)"
                >
                    <span id="monitor-filter-status-running-count" hidden>
                        {{ $t("Monitors", $root.stats.active) }}
                    </span>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="badge status-pill running">
                            <font-awesome-icon icon="play" class="icon-small" />
                            {{ $t("Running") }}
                        </span>
                        <span class="ps-3">
                            {{ $root.stats.active }}
                            <span v-if="filterState.active?.includes(true)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li>
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="checkbox"
                    :aria-checked="filterState.active?.includes(false) ? 'true' : 'false'"
                    :aria-label="$t('filterActivePaused')"
                    aria-describedby="monitor-filter-status-paused-count"
                    data-agentom-id="monitors.filter.status.paused"
                    @click.stop="toggleActiveFilter(false)"
                >
                    <span id="monitor-filter-status-paused-count" hidden>{{ $t("Monitors", $root.stats.pause) }}</span>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="badge status-pill paused">
                            <font-awesome-icon icon="pause" class="icon-small" />
                            {{ $t("filterActivePaused") }}
                        </span>
                        <span class="ps-3">
                            {{ $root.stats.pause }}
                            <span v-if="filterState.active?.includes(false)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
        </template>
    </MonitorListFilterDropdown>
    <MonitorListFilterDropdown
        filter-name="tags"
        :filterActive="filterState.tags?.length > 0"
        @open-menu="getExistingTags"
    >
        <template #status>
            <span
                v-if="filterState.tags?.length === 1"
                class="selected-tag-wrapper"
                :title="tagsList.find((tag) => tag.id === filterState.tags[0])?.name"
            >
                <Tag :item="tagsList.find((tag) => tag.id === filterState.tags[0])" :size="'sm'" :constrained="true" />
            </span>
            <span v-else>
                {{ $t("Tags") }}
            </span>
        </template>
        <template #dropdown>
            <li class="list-unstyled m-0 p-0">
                <div class="tags-dropdown-scroll">
                    <ul class="list-unstyled m-0 p-0">
                        <li v-for="tag in tagsList" :key="tag.id">
                            <div
                                class="dropdown-item"
                                tabindex="0"
                                role="checkbox"
                                :aria-checked="filterState.tags?.includes(tag.id) ? 'true' : 'false'"
                                :aria-label="tag.name"
                                :aria-describedby="`monitor-filter-tag-${tag.id}-count`"
                                :data-agentom-id="`monitors.filter.tag.${tag.id}`"
                                @click.stop="toggleTagFilter(tag)"
                            >
                                <span :id="`monitor-filter-tag-${tag.id}-count`" hidden>
                                    {{ $t("Monitors", getTaggedMonitorCount(tag)) }}
                                </span>
                                <div class="d-flex align-items-center justify-content-between">
                                    <span class="tag-name-wrapper" :title="tag.name">
                                        <Tag :item="tag" :size="'sm'" :scrollable="true" :constrained="true" />
                                    </span>
                                    <span class="ps-3">
                                        {{ getTaggedMonitorCount(tag) }}
                                        <span v-if="filterState.tags?.includes(tag.id)" class="px-1 filter-active">
                                            <font-awesome-icon icon="check" />
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </li>
                        <li v-if="tagsList.length === 0">
                            <div class="dropdown-item disabled px-3">
                                {{ $t("No tags found.") }}
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
        </template>
    </MonitorListFilterDropdown>
    <button
        v-if="hasGroups"
        type="button"
        class="btn btn-outline-normal btn-collapse-all"
        data-agentom-id="monitors.groups.toggle-all"
        :title="allCollapsed ? $t('Expand All Groups') : $t('Collapse All Groups')"
        @click="$emit('toggle-collapse-all')"
    >
        <font-awesome-icon :icon="allCollapsed ? 'folder' : 'folder-open'" fixed-width />
    </button>
    <span id="monitor-filter-status-choices" hidden>
        {{ $t("statusFilterAria") }}.
        {{
            $t("choicesAria", [
                [
                    $t("Up"),
                    $t("Down"),
                    $t("Pending"),
                    $t("statusMaintenance"),
                    $t("Running"),
                    $t("filterActivePaused"),
                ].join(", "),
            ])
        }}
    </span>
    <span id="monitor-filter-tags-choices" hidden>
        {{ $t("tagsFilterAria") }}.
        {{ tagsList.length ? $t("choicesAria", [tagsList.map((t) => t.name).join(", ")]) : $t("No tags found.") }}
    </span>
</template>

<script>
import MonitorListFilterDropdown from "./MonitorListFilterDropdown.vue";
import Status from "./Status.vue";
import Tag from "./Tag.vue";

export default {
    components: {
        MonitorListFilterDropdown,
        Status,
        Tag,
    },
    props: {
        filterState: {
            type: Object,
            required: true,
        },
        allCollapsed: {
            type: Boolean,
            default: true,
        },
        hasGroups: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["updateFilter", "toggle-collapse-all"],
    data() {
        return {
            tagsList: [],
        };
    },
    computed: {
        numFiltersActive() {
            let num = 0;

            Object.values(this.filterState).forEach((item) => {
                if (item != null && item.length > 0) {
                    num += 1;
                }
            });

            return num;
        },
    },
    mounted() {
        this.getExistingTags();
    },
    methods: {
        toggleStatusFilter(status) {
            let newFilter = {
                ...this.filterState,
            };

            if (newFilter.status == null) {
                newFilter.status = [status];
            } else {
                if (newFilter.status.includes(status)) {
                    newFilter.status = newFilter.status.filter((item) => item !== status);
                } else {
                    newFilter.status.push(status);
                }
            }
            this.$emit("updateFilter", newFilter);
        },
        toggleActiveFilter(active) {
            let newFilter = {
                ...this.filterState,
            };

            if (newFilter.active == null) {
                newFilter.active = [active];
            } else {
                if (newFilter.active.includes(active)) {
                    newFilter.active = newFilter.active.filter((item) => item !== active);
                } else {
                    newFilter.active.push(active);
                }
            }
            this.$emit("updateFilter", newFilter);
        },
        toggleTagFilter(tag) {
            let newFilter = {
                ...this.filterState,
            };

            if (newFilter.tags == null) {
                newFilter.tags = [tag.id];
            } else {
                if (newFilter.tags.includes(tag.id)) {
                    newFilter.tags = newFilter.tags.filter((item) => item !== tag.id);
                } else {
                    newFilter.tags.push(tag.id);
                }
            }
            this.$emit("updateFilter", newFilter);
        },
        clearFilters() {
            this.$emit("updateFilter", {
                status: null,
            });
        },
        getExistingTags() {
            this.$root.getSocket().emit("getTags", (res) => {
                if (res.ok) {
                    this.tagsList = res.tags;
                }
            });
        },
        getTaggedMonitorCount(tag) {
            return Object.values(this.$root.monitorList).filter((monitor) => {
                return monitor.tags.find((monitorTag) => monitorTag.tag_id === tag.id);
            }).length;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.dropdown-item {
    cursor: pointer;
}

.simple-status {
    min-width: 64px;
    border: 1px solid #d1d5db;
    background-color: transparent !important;
    color: inherit !important;

    .dark & {
        border-color: #6b7280;
    }
}

.clear-filters-btn {
    font-size: 0.8em;
    margin-right: 5px;
    display: flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 16px;
    background-color: transparent;

    .dark & {
        color: $dark-font-color;
        border: 1px solid $dark-font-color2;
    }

    &.active {
        border: 1px solid $highlight;
        background-color: $highlight-white;

        .dark & {
            background-color: $dark-font-color2;
        }
    }
}

.dropdown-divider {
    margin: 0.5rem 0;
    border-top: 1px solid #d1d5db;

    .dark & {
        border-top-color: #6b7280;
    }
}

.status-pill {
    min-width: 64px;
    display: inline-block;
    text-align: center;

    &.running,
    &.paused {
        background-color: white !important;
        border: 1px solid #d1d5db;
        color: inherit;

        .dark & {
            background-color: transparent !important;
            border-color: #6b7280;
            color: $dark-font-color;
        }

        .icon-small {
            font-size: 0.75em;
            margin-right: 4px;
        }
    }
}

.btn-collapse-all {
    transition: none !important;
}

.tags-dropdown-scroll {
    max-height: min(50vh, 320px);
    max-width: 45vw;
    overflow-y: auto;
}

.tag-name-wrapper {
    min-width: 0;
    overflow: hidden;
    max-width: min(800px, 38vw);
    display: flex;
    align-items: center;
}

.selected-tag-wrapper {
    max-width: 120px;
    display: flex;
    align-items: center;
}
</style>
