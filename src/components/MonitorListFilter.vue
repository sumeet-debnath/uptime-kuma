<template>
    <MonitorListFilterDropdown
        :filterActive="filterState.status?.length > 0 || filterState.active?.length > 0"
        :menu-label="$t('filterByStatus')"
        :button-label="statusButtonLabel"
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
            <li role="none">
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="menuitemcheckbox"
                    :aria-checked="String(!!filterState.status?.includes(1))"
                    aria-labelledby="status-filter-1"
                    aria-describedby="status-filter-1-count"
                    @click.stop="toggleStatusFilter(1)"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <Status id="status-filter-1" :status="1" />
                        <span id="status-filter-1-count" class="ps-3">
                            {{ $root.stats.up }}
                            <span v-if="filterState.status?.includes(1)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li role="none">
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="menuitemcheckbox"
                    :aria-checked="String(!!filterState.status?.includes(0))"
                    aria-labelledby="status-filter-0"
                    aria-describedby="status-filter-0-count"
                    @click.stop="toggleStatusFilter(0)"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <Status id="status-filter-0" :status="0" />
                        <span id="status-filter-0-count" class="ps-3">
                            {{ $root.stats.down }}
                            <span v-if="filterState.status?.includes(0)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li role="none">
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="menuitemcheckbox"
                    :aria-checked="String(!!filterState.status?.includes(2))"
                    aria-labelledby="status-filter-2"
                    aria-describedby="status-filter-2-count"
                    @click.stop="toggleStatusFilter(2)"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <Status id="status-filter-2" :status="2" />
                        <span id="status-filter-2-count" class="ps-3">
                            {{ $root.stats.pending }}
                            <span v-if="filterState.status?.includes(2)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li role="none">
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="menuitemcheckbox"
                    :aria-checked="String(!!filterState.status?.includes(3))"
                    aria-labelledby="status-filter-3"
                    aria-describedby="status-filter-3-count"
                    @click.stop="toggleStatusFilter(3)"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <Status id="status-filter-3" :status="3" />
                        <span id="status-filter-3-count" class="ps-3">
                            {{ $root.stats.maintenance }}
                            <span v-if="filterState.status?.includes(3)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li role="none">
                <hr class="dropdown-divider" />
            </li>
            <li role="none">
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="menuitemcheckbox"
                    :aria-checked="String(!!filterState.active?.includes(true))"
                    aria-labelledby="status-filter-running"
                    aria-describedby="status-filter-running-count"
                    @click.stop="toggleActiveFilter(true)"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <span id="status-filter-running" class="badge status-pill running">
                            <font-awesome-icon icon="play" class="icon-small" />
                            {{ $t("Running") }}
                        </span>
                        <span id="status-filter-running-count" class="ps-3">
                            {{ $root.stats.active }}
                            <span v-if="filterState.active?.includes(true)" class="px-1 filter-active">
                                <font-awesome-icon icon="check" />
                            </span>
                        </span>
                    </div>
                </div>
            </li>
            <li role="none">
                <div
                    class="dropdown-item"
                    tabindex="0"
                    role="menuitemcheckbox"
                    :aria-checked="String(!!filterState.active?.includes(false))"
                    aria-labelledby="status-filter-paused"
                    aria-describedby="status-filter-paused-count"
                    @click.stop="toggleActiveFilter(false)"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <span id="status-filter-paused" class="badge status-pill paused">
                            <font-awesome-icon icon="pause" class="icon-small" />
                            {{ $t("filterActivePaused") }}
                        </span>
                        <span id="status-filter-paused-count" class="ps-3">
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
        :filterActive="filterState.tags?.length > 0"
        :menu-label="$t('filterByTag')"
        :button-label="tagButtonLabel"
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
            <li class="list-unstyled m-0 p-0" role="none">
                <div class="tags-dropdown-scroll" role="none">
                    <ul class="list-unstyled m-0 p-0" role="none">
                        <li v-for="tag in tagsList" :key="tag.id" role="none">
                            <div
                                class="dropdown-item"
                                tabindex="0"
                                role="menuitemcheckbox"
                                :aria-checked="String(!!filterState.tags?.includes(tag.id))"
                                :aria-labelledby="`tag-filter-${tag.id}`"
                                :aria-describedby="`tag-filter-${tag.id}-count`"
                                @click.stop="toggleTagFilter(tag)"
                            >
                                <div class="d-flex align-items-center justify-content-between">
                                    <span class="tag-name-wrapper" :title="tag.name">
                                        <Tag
                                            :id="`tag-filter-${tag.id}`"
                                            :item="tag"
                                            :size="'sm'"
                                            :scrollable="true"
                                            :constrained="true"
                                        />
                                    </span>
                                    <span :id="`tag-filter-${tag.id}-count`" class="ps-3">
                                        {{ getTaggedMonitorCount(tag) }}
                                        <span v-if="filterState.tags?.includes(tag.id)" class="px-1 filter-active">
                                            <font-awesome-icon icon="check" />
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </li>
                        <li v-if="tagsList.length === 0" role="none">
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
        :title="allCollapsed ? $t('Expand All Groups') : $t('Collapse All Groups')"
        @click="$emit('toggle-collapse-all')"
    >
        <font-awesome-icon :icon="allCollapsed ? 'folder' : 'folder-open'" fixed-width />
    </button>
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
        // the Status button's name when it shows one chosen status: "Down, Status filter"
        statusButtonLabel() {
            const words = {
                0: this.$t("Down"),
                1: this.$t("Up"),
                2: this.$t("Pending"),
                3: this.$t("statusMaintenance"),
            };
            if (this.filterState.status?.length === 1 && !this.filterState.active?.length) {
                return this.$t("chosenFilterAria", [words[this.filterState.status[0]], this.$t("Status")]);
            }
            if (!this.filterState.status?.length && this.filterState.active?.length === 1) {
                const word = this.filterState.active[0] ? this.$t("Running") : this.$t("filterActivePaused");
                return this.$t("chosenFilterAria", [word, this.$t("Status")]);
            }
            return undefined;
        },
        // the Tags button's name when it shows one chosen tag
        tagButtonLabel() {
            if (this.filterState.tags?.length === 1) {
                const tag = this.tagsList.find((t) => t.id === this.filterState.tags[0]);
                return tag ? this.$t("chosenFilterAria", [tag.name, this.$t("Tags")]) : undefined;
            }
            return undefined;
        },
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
