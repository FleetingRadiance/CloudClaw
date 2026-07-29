<template>
    <div class="skill-card-list">
        <div v-if="loading && displaySkills.length === 0" class="skill-card-wrap">
            <div
                v-for="n in 6"
                :key="'skel-' + n"
                class="skill-card skill-card-skeleton"
                :style="{ animationDelay: n * 0.08 + 's' }"
            >
                <div class="card-header">
                    <div class="skel-title"></div>
                </div>
                <div class="card-content">
                    <div class="skel-line"></div>
                    <div class="skel-line"></div>
                </div>
                <div class="card-bottom">
                    <div class="skel-btn"></div>
                    <div class="skel-btn"></div>
                </div>
            </div>
        </div>

        <div v-else-if="displaySkills.length === 0" class="skill-empty">
            <t-icon name="extension" size="48px" class="empty-icon" />
            <span class="empty-text">{{ $t('skill.emptyText') }}</span>
            <span class="empty-sub">{{ $t('skill.subtitle') }}</span>
            <t-button theme="primary" @click="$emit('upload')" class="empty-action">
                <template #icon><t-icon name="upload" /></template>
                {{ $t('skill.uploadFirst') }}
            </t-button>
        </div>

        <div v-else class="skill-card-wrap">
            <div
                v-for="skill in displaySkills"
                :key="getSkillKey(skill)"
                class="skill-card"
                :class="{
                    'is-user': isUserSkill(skill),
                    'is-preloaded': !isUserSkill(skill)
                }"
            >
                <t-tooltip
                    :content="getSkillDesc(skill)"
                    placement="top"
                    theme="default"
                    :show-arrow="true"
                    destroy-on-close
                    overlay-class-name="skill-tooltip"
                >
                    <div class="tooltip-wrap">
                        <div class="card-header">
                            <span class="card-title">{{ getSkillName(skill) }}</span>
                            <div class="card-tags">
                                <span v-if="isUserSkill(skill)" class="skill-tag user">
                                    {{ $t('skill.sourceUser') }}
                                </span>
                                <span v-else class="skill-tag preloaded">
                                    {{ $t('skill.sourcePreloaded') }}
                                </span>
                                <t-tag v-if="isReadOnly(skill)" theme="default" size="small" variant="light">
                                    {{ $t('skill.sharedReadOnly') }}
                                </t-tag>
                            </div>
                        </div>

                        <div class="card-content">
                            <p class="card-description">{{ getSkillDesc(skill) }}</p>
                        </div>

                        <div v-if="getFileCount(skill) > 0" class="card-meta">
                            <span class="meta-pill">
                                <t-icon name="folder" size="12px" />
                                {{ $t('skill.fileCount', { n: getFileCount(skill) }) }}
                            </span>
                            <span v-if="getTotalSize(skill)" class="meta-pill">
                                <t-icon name="storage" size="12px" />
                                {{ formatSize(getTotalSize(skill)) }}
                            </span>
                        </div>
                    </div>
                </t-tooltip>

                <div class="card-bottom">
                    <t-button v-if="!isReadOnly(skill)" variant="outline" size="small" @click="$emit('view', skill)">
                        <template #icon><t-icon name="browse" /></template>
                        {{ $t('skill.viewContent') }}
                    </t-button>
                    <t-button
                        v-if="props.canShare && !isUserSkill(skill)"
                        variant="outline"
                        size="small"
                        theme="warning"
                        @click="$emit('share', skill)"
                    >
                        <template #icon><t-icon name="share" /></template>
                        {{ $t('skill.share') }}
                    </t-button>
                    <t-button
                        v-if="showDelete && (isUserSkill(skill) || props.isAdmin)"
                        variant="outline"
                        size="small"
                        theme="danger"
                        @click="$emit('delete', skill)"
                    >
                        <template #icon><t-icon name="delete" /></template>
                        {{ $t('common.delete') }}
                    </t-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SkillInfo, UserSkillInfo } from '@/api/skill';

const { t } = useI18n();

const props = defineProps<{
    skills: SkillInfo[] | UserSkillInfo[];
    loading: boolean;
    showDelete?: boolean;
    showLdap?: boolean;
    isAdmin?: boolean;
    canShare?: boolean;
}>();

defineEmits<{
    delete: [skill: SkillInfo | UserSkillInfo];
    upload: [];
    view: [skill: SkillInfo | UserSkillInfo];
    share: [skill: SkillInfo | UserSkillInfo];
}>();

type DisplaySkill = SkillInfo | UserSkillInfo;

const displaySkills = computed(() => props.skills as DisplaySkill[]);

function isUserSkill(skill: DisplaySkill): boolean {
    return 'source' in skill ? skill.source === 'user' : !('is_preloaded' in skill && skill.is_preloaded);
}

function isReadOnly(skill: DisplaySkill): boolean {
    return 'read_only' in skill && (skill as SkillInfo).read_only === true;
}

function getSkillKey(skill: DisplaySkill): string {
    return 'full_name' in skill ? skill.full_name : skill.name;
}

function getSkillName(skill: DisplaySkill): string {
    return 'full_name' in skill ? skill.full_name : skill.name;
}

function getSkillDesc(skill: DisplaySkill): string {
    return skill.description || t('skill.noDescription');
}

function getLdapName(skill: DisplaySkill): string {
    return 'ldap_login_name' in skill ? skill.ldap_login_name : '';
}

function getFileCount(skill: DisplaySkill): number {
    return 'file_count' in skill ? (skill as UserSkillInfo).file_count : 0;
}

function getTotalSize(skill: DisplaySkill): number {
    return 'total_size' in skill ? (skill as UserSkillInfo).total_size : 0;
}

function formatSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
</script>

<style scoped lang="less">
.skill-card-wrap {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

@media (min-width: 900px) {
    .skill-card-wrap {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1250px) {
    .skill-card-wrap {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1600px) {
    .skill-card-wrap {
        grid-template-columns: repeat(4, 1fr);
    }
}

.skill-card {
    border: 1px solid var(--td-component-stroke);
    border-radius: 8px;
    overflow: visible;
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    background: var(--td-bg-color-container);
    position: relative;
    transition: all 0.25s ease;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    height: 136px;
    min-height: 136px;
    cursor: default;

    .tooltip-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
    }

    &.is-user {
        background: linear-gradient(135deg, var(--td-bg-color-container) 0%, rgba(7, 192, 95, 0.04) 100%);

        &:hover {
            border-color: var(--td-brand-color);
            box-shadow: 0 4px 12px rgba(7, 192, 95, 0.12);
            background: linear-gradient(135deg, var(--td-bg-color-container) 0%, rgba(7, 192, 95, 0.08) 100%);
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, rgba(7, 192, 95, 0.08) 0%, transparent 100%);
            border-radius: 0 8px 0 100%;
            pointer-events: none;
            z-index: 0;
        }
    }

    &.is-preloaded {
        background: linear-gradient(135deg, var(--td-bg-color-container) 0%, rgba(0, 82, 217, 0.04) 100%);

        &:hover {
            border-color: var(--td-brand-color);
            box-shadow: 0 4px 12px rgba(0, 82, 217, 0.12);
            background: linear-gradient(135deg, var(--td-bg-color-container) 0%, rgba(0, 82, 217, 0.08) 100%);
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, rgba(0, 82, 217, 0.08) 0%, transparent 100%);
            border-radius: 0 8px 0 100%;
            pointer-events: none;
            z-index: 0;
        }
    }

    &:hover {
        border-color: var(--td-brand-color);
        box-shadow: 0 4px 12px rgba(7, 192, 95, 0.12);
    }

    .card-header,
    .card-content,
    .card-meta,
    .card-bottom {
        position: relative;
        z-index: 1;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 6px;
    }

    .card-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--td-text-color-primary);
        font-family: var(--app-font-family);
        letter-spacing: 0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
    }

    .card-tags {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
    }

    .skill-tag {
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;

        &.preloaded {
            background: rgba(0, 82, 217, 0.08);
            color: #1d4ed8;
        }

        &.user {
            background: var(--td-brand-color-light);
            color: var(--td-brand-color-active);
        }
    }

    .card-content {
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    .card-description {
        margin: 0;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: var(--td-text-color-secondary);
        font-family: var(--app-font-family);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
    }

    .card-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 4px;
    }

    .meta-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--td-text-color-secondary);
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--td-bg-color-secondarycontainer);
    }

    .card-bottom {
        display: flex;
        align-items: center;
        gap: 6px;
        padding-top: 8px;
        border-top: 0.5px solid var(--td-component-stroke);
        margin-top: auto;
        flex-wrap: wrap;

        :deep(.t-button) {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
        }
    }
}

.skill-card-skeleton {
    pointer-events: none;

    .skel-title {
        width: 60%;
        height: 16px;
        background: linear-gradient(
            90deg,
            var(--td-bg-color-secondarycontainer) 25%,
            var(--td-bg-color-container-hover) 50%,
            var(--td-bg-color-secondarycontainer) 75%
        );
        background-size: 200% 100%;
        border-radius: 4px;
        animation: skeleton-loading 1.5s infinite;
    }

    .skel-line {
        height: 12px;
        background: linear-gradient(
            90deg,
            var(--td-bg-color-secondarycontainer) 25%,
            var(--td-bg-color-container-hover) 50%,
            var(--td-bg-color-secondarycontainer) 75%
        );
        background-size: 200% 100%;
        border-radius: 4px;
        margin-bottom: 6px;
        animation: skeleton-loading 1.5s infinite;

        &:nth-child(2) {
            width: 80%;
        }
    }

    .skel-btn {
        width: 50px;
        height: 24px;
        background: linear-gradient(
            90deg,
            var(--td-bg-color-secondarycontainer) 25%,
            var(--td-bg-color-container-hover) 50%,
            var(--td-bg-color-secondarycontainer) 75%
        );
        background-size: 200% 100%;
        border-radius: 4px;
        animation: skeleton-loading 1.5s infinite;
        margin-right: 8px;
    }
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.skill-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    gap: 8px;

    .empty-icon {
        color: var(--td-brand-color);
        margin-bottom: 16px;
    }

    .empty-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--td-text-color-primary);
    }

    .empty-sub {
        font-size: 14px;
        color: var(--td-text-color-placeholder);
        margin-bottom: 20px;
    }

    .empty-action :deep(.t-button) {
        border-radius: 8px;
    }
}
</style>

<style>
.skill-tooltip {
    max-width: 320px !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
    line-height: 1.5 !important;
}
</style>
