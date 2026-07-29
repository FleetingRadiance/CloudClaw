<template>
    <div class="skill-list-container">
        <div class="header">
            <div class="header-title">
                <h2>{{ $t('skill.title') }}</h2>
                <p class="header-subtitle">{{ $t('skill.subtitle') }}</p>
            </div>
            <div class="header-actions">
                <t-button theme="primary" @click="goToUpload">
                    <template #icon>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 16V4M6 10l6-6 6 6"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                            />
                        </svg>
                    </template>
                    {{ $t('skill.uploadSkill') }}
                </t-button>
            </div>
        </div>

        <div class="skill-list-main">
            <div class="skills-toolbar">
                <div v-if="isAdmin" class="skill-tabs">
                    <button :class="{ active: activeTab === 'mine' }" @click="activeTab = 'mine'">
                        <span class="lbl">{{ $t('skill.tabMine') }}</span>
                        <span class="count">{{ skills.length }}</span>
                    </button>
                    <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
                        <span class="lbl">{{ $t('skill.tabAll') }}</span>
                        <span class="count">{{ allSkills.length }}</span>
                    </button>
                </div>
                <div v-else class="skill-tabs">
                    <button class="active">
                        <span class="lbl">{{ $t('skill.tabMine') }}</span>
                        <span class="count">{{ filteredUserSkills.length }} / {{ skills.length }}</span>
                    </button>
                </div>

                <div class="toolbar-right">
                    <div class="search" v-if="isAdmin && activeTab === 'all'">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
                            <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                        </svg>
                        <input
                            v-model="ldapFilter"
                            :placeholder="$t('skill.filterByLdap')"
                            clearable
                            @change="loadAllSkills"
                        />
                    </div>
                    <div class="search" v-if="!isAdmin">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
                            <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                        </svg>
                        <input v-model="userSkillFilter" :placeholder="$t('skill.searchByName')" clearable />
                    </div>
                </div>
            </div>

            <SkillCardList
                v-if="isAdmin && activeTab === 'mine'"
                :skills="skills"
                :loading="loading"
                :show-delete="true"
                :show-ldap="isAdmin"
                :is-admin="true"
                :can-share="canShare"
                @delete="handleDelete"
                @upload="goToUpload"
                @view="handleViewSkill"
                @share="handleShare"
            />

            <SkillCardList
                v-else-if="isAdmin && activeTab === 'all'"
                :skills="allSkills"
                :loading="loadingAll"
                :show-delete="true"
                :show-ldap="true"
                :is-admin="true"
                :can-share="canShare"
                @delete="handleAdminDelete"
                @upload="goToUpload"
                @view="handleViewSkill"
                @share="handleShare"
            />

            <SkillCardList
                v-else
                :skills="filteredUserSkills"
                :loading="loading"
                :show-delete="true"
                @delete="handleDelete"
                @upload="goToUpload"
                @view="handleViewSkill"
            />
        </div>

        <t-dialog
            v-model:visible="showDeleteConfirm"
            :header="$t('skill.deleteConfirmTitle')"
            :confirm-btn="{ content: $t('common.confirm'), theme: 'danger', loading: deleting }"
            :cancel-btn="{ content: $t('common.cancel') }"
            @confirm="confirmDelete"
        >
            <p>{{ $t('skill.deleteConfirmMsg', { name: deleteTarget?.name }) }}</p>
        </t-dialog>

        <t-dialog
            v-model:visible="showContentDialog"
            :header="$t('skill.contentTitle')"
            :footer="false"
            :width="920"
            :top="'5vh'"
            :close-on-overlay-click="true"
            class="skill-content-dialog"
        >
            <t-loading :loading="contentLoading" size="small" />
            <div v-if="!contentLoading && skillFiles.length === 0" class="content-empty">
                <div class="content-empty-icon"><t-icon name="folder-open" size="36px" /></div>
                {{ $t('skill.noContent') }}
            </div>
            <div v-if="!contentLoading && skillFiles.length > 0" class="skill-content-viewer">
                <t-tabs v-model="activeFileTab" placement="left" class="content-tabs">
                    <t-tab-panel v-for="file in skillFiles" :key="file.name" :value="file.name" :label="file.name">
                        <div class="skill-file-block">
                            <div class="skill-file-bar">
                                <div class="skill-file-name"><t-icon name="file" size="14px" /> {{ file.name }}</div>
                                <t-button
                                    variant="text"
                                    size="small"
                                    class="skill-file-copy"
                                    @click="copyFileContent(file)"
                                >
                                    <template #icon><t-icon name="file-copy" /></template>
                                    {{ $t('common.copy') }}
                                </t-button>
                            </div>
                            <pre class="skill-file-content">{{ file.content }}</pre>
                        </div>
                    </t-tab-panel>
                </t-tabs>
            </div>
        </t-dialog>

        <t-dialog
            v-model:visible="showShareDialog"
            :header="$t('skill.shareTitle')"
            :footer="false"
            :width="580"
            :top="'8vh'"
            :close-on-overlay-click="true"
            @close="closeShareDialog"
        >
            <div class="share-dialog-content">
                <div class="share-skill-info">
                    <h4>{{ getSkillName(shareTarget) }}</h4>
                    <p>{{ getSkillDesc(shareTarget) }}</p>
                </div>

                <t-divider>{{ $t('skill.sharedSpaces') }}</t-divider>

                <div class="share-new-tenant">
                    <t-select
                        v-model="newOrgId"
                        :placeholder="$t('skill.searchSharedSpace')"
                        filterable
                        remote
                        :loading="orgSearchLoading"
                        :options="orgOptions"
                        :disabled="shareNewLoading"
                        style="width: 300px"
                        @search="onOrgSearch"
                        @focus="onOrgFocus"
                    />
                    <t-button
                        theme="primary"
                        size="small"
                        :loading="shareNewLoading"
                        :disabled="!newOrgId"
                        @click="handleShareNewOrg"
                    >
                        {{ $t('skill.shareToSpace') }}
                    </t-button>
                </div>
                <p v-if="orgSearchError" class="tenant-search-error">{{ orgSearchError }}</p>

                <t-loading :loading="shareLoading" size="small">
                    <div v-if="orgShares.length === 0" class="no-shares">
                        {{ $t('skill.noShares') }}
                    </div>
                    <div v-else class="shares-list">
                        <div v-for="share in orgShares" :key="share.id" class="share-item">
                            <div class="share-info">
                                <span class="tenant-id">{{ share.organization_name || share.organization_id }}</span>
                                <span class="share-date">{{ formatDate(share.created_at) }}</span>
                            </div>
                            <t-button
                                variant="text"
                                theme="danger"
                                size="small"
                                :loading="unshareLoading"
                                @click="handleUnshare(share)"
                            >
                                {{ $t('skill.unshare') }}
                            </t-button>
                        </div>
                    </div>
                </t-loading>
            </div>
        </t-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import {
    listSkillsForUser,
    listSkills,
    deleteUserSkill,
    adminListAllSkills,
    getSkillContent,
    shareSkillToOrganization,
    unshareSkillFromOrganization,
    listOrganizationsBySkill,
    listSkillShareOrganizations,
    type SkillInfo,
    type UserSkillInfo,
    type SkillFile,
    type SkillOrgShare
} from '@/api/skill';
import SkillCardList from './SkillCardList.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

// 上传技能已抽离为独立页面 /platform/skills/upload
function goToUpload() {
    router.push({ name: 'skillUpload' });
}

const loading = ref(false);
const loadingAll = ref(false);
const skills = ref<SkillInfo[]>([]);
const allSkills = ref<UserSkillInfo[]>([]);
const activeTab = ref('mine');
const ldapFilter = ref('');
const userSkillFilter = ref('');
const showDeleteConfirm = ref(false);
const deleting = ref(false);
const deleteTarget = ref<{ name: string; fullName?: string } | null>(null);
const showContentDialog = ref(false);
const contentLoading = ref(false);
const skillFiles = ref<SkillFile[]>([]);
const activeFileTab = ref('');

const showShareDialog = ref(false);
const shareTarget = ref<SkillInfo | UserSkillInfo | null>(null);
const orgShares = ref<SkillOrgShare[]>([]);
const shareLoading = ref(false);
const unshareLoading = ref(false);
const newOrgId = ref('');
const shareNewLoading = ref(false);

const orgOptions = ref<{ label: string; value: string }[]>([]);
const orgSearchLoading = ref(false);
const orgSearchError = ref('');

const isAdmin = computed(() => authStore.hasRole('admin'));
const isLdapUser = computed(() => authStore.user?.user_type === 'ldap_user');
const canShare = computed(() => isAdmin.value && !isLdapUser.value);

const filteredUserSkills = computed(() => {
    const kw = userSkillFilter.value.trim().toLowerCase();
    if (!kw) return skills.value;
    return skills.value.filter(
        (s) => (s.name || '').toLowerCase().includes(kw) || (s.description || '').toLowerCase().includes(kw)
    );
});

async function loadSkills() {
    loading.value = true;
    try {
        const res = (await listSkillsForUser()) as any;
        if (res?.success) {
            skills.value = res.data || [];
        }
        if (skills.value.length === 0) {
            const preloadedRes = (await listSkills()) as any;
            if (preloadedRes?.success) {
                skills.value = preloadedRes.data || [];
            }
        }
    } catch {
        MessagePlugin.error(t('skill.loadFailed'));
    } finally {
        loading.value = false;
    }
}

async function loadAllSkills() {
    if (!isAdmin.value) return;
    loadingAll.value = true;
    try {
        const res = (await adminListAllSkills(ldapFilter.value || undefined)) as any;
        if (res?.success) {
            allSkills.value = res.data || [];
        }
    } catch {
        MessagePlugin.error(t('skill.loadFailed'));
    } finally {
        loadingAll.value = false;
    }
}

watch(activeTab, (val) => {
    if (val === 'all') {
        loadAllSkills();
    }
});

function handleDelete(skill: SkillInfo | UserSkillInfo) {
    const fullName = 'full_name' in skill ? skill.full_name : skill.name;
    deleteTarget.value = { name: fullName, fullName };
    showDeleteConfirm.value = true;
}

function handleAdminDelete(skill: SkillInfo | UserSkillInfo) {
    const fullName = 'full_name' in skill ? skill.full_name : skill.name;
    deleteTarget.value = { name: fullName, fullName };
    showDeleteConfirm.value = true;
}

async function confirmDelete() {
    if (!deleteTarget.value) return;
    deleting.value = true;
    try {
        const nameToDelete = deleteTarget.value.fullName || deleteTarget.value.name;
        const res = (await deleteUserSkill(nameToDelete)) as any;
        if (res?.success) {
            MessagePlugin.success(t('skill.deleteSuccess'));
            showDeleteConfirm.value = false;
            deleteTarget.value = null;
            loadSkills();
            if (isAdmin.value) {
                loadAllSkills();
            }
        } else {
            MessagePlugin.error(t('skill.deleteFailed'));
        }
    } catch {
        MessagePlugin.error(t('skill.deleteFailed'));
    } finally {
        deleting.value = false;
    }
}

async function handleViewSkill(skill: SkillInfo | UserSkillInfo) {
    const fullName = 'full_name' in skill ? skill.full_name : skill.name;
    showContentDialog.value = true;
    contentLoading.value = true;
    skillFiles.value = [];
    activeFileTab.value = '';
    try {
        const res = (await getSkillContent(fullName)) as any;
        if (res?.success) {
            skillFiles.value = res.data || [];
            if (skillFiles.value.length > 0) {
                activeFileTab.value = skillFiles.value[0].name;
            }
        }
    } catch {
        MessagePlugin.error(t('skill.loadContentFailed'));
    } finally {
        contentLoading.value = false;
    }
}

async function copyFileContent(file: SkillFile) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(file.content || '');
            MessagePlugin.success(t('common.copied'));
        } else {
            MessagePlugin.warning(t('skill.loadContentFailed'));
        }
    } catch {
        MessagePlugin.error(t('skill.loadContentFailed'));
    }
}

async function handleShare(skill: SkillInfo | UserSkillInfo) {
    shareTarget.value = skill;
    showShareDialog.value = true;
    await loadOrgShares();
}

async function loadOrgShares() {
    if (!shareTarget.value) return;

    const skillName = 'full_name' in shareTarget.value ? shareTarget.value.full_name : shareTarget.value.name;

    shareLoading.value = true;
    try {
        const res = (await listOrganizationsBySkill(skillName)) as any;
        if (res?.success) {
            orgShares.value = res.data || [];
        }
    } catch {
        MessagePlugin.error(t('skill.loadSharesFailed'));
    } finally {
        shareLoading.value = false;
    }
}

async function handleUnshare(share: SkillOrgShare) {
    if (!shareTarget.value) return;

    const skillName = 'full_name' in shareTarget.value ? shareTarget.value.full_name : shareTarget.value.name;

    unshareLoading.value = true;
    try {
        const res = (await unshareSkillFromOrganization(skillName, share.organization_id)) as any;
        if (res?.success) {
            MessagePlugin.success(t('skill.unshareSuccess'));
            await loadOrgShares();
        } else {
            MessagePlugin.error(t('skill.unshareFailed'));
        }
    } catch {
        MessagePlugin.error(t('skill.unshareFailed'));
    } finally {
        unshareLoading.value = false;
    }
}

async function handleShareNewOrg() {
    if (!shareTarget.value) return;
    if (!newOrgId.value) return;

    const skillName = 'full_name' in shareTarget.value ? shareTarget.value.full_name : shareTarget.value.name;

    shareNewLoading.value = true;
    try {
        const res = (await shareSkillToOrganization(skillName, newOrgId.value)) as any;
        if (res?.success) {
            MessagePlugin.success(t('skill.shareSuccess'));
            newOrgId.value = '';
            orgOptions.value = [];
            await loadOrgShares();
        } else {
            MessagePlugin.error(res?.message || t('skill.shareFailed'));
        }
    } catch {
        MessagePlugin.error(t('skill.shareFailed'));
    } finally {
        shareNewLoading.value = false;
    }
}

async function onOrgSearch(keyword: string) {
    orgSearchError.value = '';
    orgSearchLoading.value = true;
    try {
        const res = (await listSkillShareOrganizations()) as any;
        if (res?.success && Array.isArray(res.data)) {
            const kw = (keyword || '').trim().toLowerCase();
            orgOptions.value = res.data
                .filter((o: any) => !kw || String(o.name).toLowerCase().includes(kw) || String(o.id).includes(kw))
                .map((o: any) => ({
                    label: `${o.name}`,
                    value: String(o.id)
                }));
        } else {
            orgOptions.value = [];
        }
    } catch (e: any) {
        orgSearchError.value = e?.message || t('skill.tenantSearchFailed');
        orgOptions.value = [];
    } finally {
        orgSearchLoading.value = false;
    }
}

async function onOrgFocus() {
    if (orgOptions.value.length === 0 && !orgSearchLoading.value && !orgSearchError.value) {
        await onOrgSearch('');
    }
}

function closeShareDialog() {
    showShareDialog.value = false;
    shareTarget.value = null;
    orgShares.value = [];
    newOrgId.value = '';
    orgOptions.value = [];
    orgSearchError.value = '';
}

function getSkillName(skill: SkillInfo | UserSkillInfo | null | undefined): string {
    if (!skill) return '';
    return 'full_name' in skill ? skill.full_name : skill.name;
}

function getSkillDesc(skill: SkillInfo | UserSkillInfo | null | undefined): string {
    if (!skill) return '';
    return skill.description || t('skill.noDescription');
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

onMounted(() => {
    loadSkills();
});
</script>

<style scoped>
.skill-list-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 28px 0 28px;
    box-sizing: border-box;
    overflow-x: hidden;
    min-width: 0;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-shrink: 0;
    margin-bottom: 16px;

    .header-title {
        display: flex;
        flex-direction: column;
        gap: 4px;

        h2 {
            margin: 0;
            color: var(--td-text-color-primary);
            font-family: var(--app-font-family);
            font-size: 24px;
            font-weight: 600;
            line-height: 32px;
        }

        .header-subtitle {
            margin: 0;
            font-size: 14px;
            color: var(--td-text-color-placeholder);
            line-height: 22px;
        }
    }

    :deep(.t-button) {
        border-radius: 8px;
    }
}

.skill-list-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 8px;
}

.skills-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.skill-tabs {
    display: inline-flex;
    padding: 3px;
    gap: 2px;
    background: var(--td-bg-color-secondarycontainer);
    border-radius: 8px;
}

.skill-tabs button {
    appearance: none;
    border: 0;
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    color: var(--td-text-color-secondary);
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.22s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.skill-tabs button:hover {
    color: var(--td-text-color-primary);
}

.skill-tabs button.active {
    background: var(--td-bg-color-container);
    color: var(--td-text-color-primary);
    font-weight: 550;
}

.skill-tabs .count {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--td-bg-color-component);
    color: var(--td-text-color-secondary);
    font-variant-numeric: tabular-nums;
}

.skill-tabs button.active .count {
    background: var(--td-brand-color-light);
    color: var(--td-brand-color-active);
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.search {
    position: relative;
    width: 280px;
}

.search input {
    width: 100%;
    height: 36px;
    padding: 0 14px 0 36px;
    border: 1px solid var(--td-component-stroke);
    border-radius: 8px;
    background: var(--td-bg-color-container);
    color: var(--td-text-color-primary);
    font: inherit;
    font-size: 13px;
    outline: none;
    transition: border-color 0.25s ease;
}

.search input:focus {
    border-color: var(--td-brand-color);
}

.search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--td-text-color-placeholder);
    pointer-events: none;
}

/* NOTE: The .skill-upload-dialog container styles (design tokens + the
   .t-dialog element overrides + .t-dialog__* overrides) live in the
   NON-SCOPED <style> block at the bottom of this file. They MUST be
   non-scoped because t-dialog renders via Teleport, so the scoped
   [data-v] attribute does not reliably reach the teleported .t-dialog
   element itself. All selectors there are namespaced under
   .skill-upload-dialog to avoid global pollution. The inner dialog
   styles below (.upload-dialog, .d-head, .dropzone, ...) stay scoped
   and inherit these tokens from the non-scoped ancestor. */

.upload-dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}

.upload-dialog::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--brand-400), var(--brand-600), var(--brand-400));
    background-size: 200% 100%;
    animation: skillShimmer 4s linear infinite;
    z-index: 5;
}

@keyframes skillShimmer {
    to {
        background-position: 200% 0;
    }
}

/* ============ Header ============ */
.d-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 5px 28px 10px;
    border-bottom: 1px solid var(--border-soft);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
}

.d-head-icon {
    width: 46px;
    height: 46px;
    border-radius: var(--r-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.22), rgba(16, 185, 129, 0.08) 70%),
        linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(16, 185, 129, 0.04));
    color: var(--brand-600);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 16px rgba(16, 185, 129, 0.18);
}

.d-head-text {
    flex: 1;
    min-width: 0;
}

.d-head-text h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink-900);
    letter-spacing: -0.01em;
}

.d-head-text p {
    margin: 3px 0 0;
    font-size: 12.5px;
    color: var(--ink-500);
    letter-spacing: 0.01em;
}

.d-head-step {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--brand-50);
    color: var(--brand-700);
    font-weight: 600;
    letter-spacing: 0.04em;
}

.d-head-close {
    width: 34px;
    height: 34px;
    border: 0;
    background: transparent;
    border-radius: 10px;
    cursor: pointer;
    color: var(--ink-400);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s var(--ease);
}

.d-head-close:hover:not(:disabled) {
    background: var(--ink-100);
    color: var(--ink-800);
    transform: rotate(90deg);
}

/* ============ Body ============ */
.d-body {
    padding: 24px 28px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(248, 250, 252, 0.1) 100%);
}

.d-body::-webkit-scrollbar {
    width: 8px;
}

.d-body::-webkit-scrollbar-thumb {
    background: var(--ink-200);
    border-radius: 4px;
}

.d-body::-webkit-scrollbar-thumb:hover {
    background: var(--ink-300);
}

.col {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
}

.section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-500);
}

.section-label .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--brand-500);
    box-shadow: 0 0 0 4px var(--brand-100);
}

.upload-trigger {
    display: block;
    width: 100%;

    :deep(.t-upload) {
        width: 100%;
    }

    :deep(.t-upload__trigger) {
        display: block;
        width: 100%;
    }
}

/* ============ Drop zone (Big visual) ============ */
.dropzone {
    position: relative;
    padding: 5px 24px;
    border: 2px dashed rgba(16, 185, 129, 0.32);
    border-radius: var(--r-lg);
    background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08), transparent 60%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.5));
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    text-align: center;
    overflow: hidden;
}

.dropzone::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(16, 185, 129, 0.12), transparent 40%);
    opacity: 0;
    transition: opacity 0.3s;
}

.dropzone:hover {
    border-color: var(--brand-500);
    box-shadow: var(--shadow-brand);
    transform: translateY(-1px);
}

.dropzone:hover::before {
    opacity: 1;
}

.dropzone.dragging {
    border-color: var(--brand-500);
    border-style: solid;
    background: linear-gradient(180deg, var(--brand-50), rgba(255, 255, 255, 0.85));
    box-shadow: 0 0 0 4px var(--brand-100), var(--shadow-brand);
}

.dropzone-illust {
    position: relative;
    width: 96px;
    height: 96px;
}

.dropzone-illust .blob {
    position: absolute;
    inset: 0;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: linear-gradient(135deg, var(--brand-400), var(--brand-600));
    opacity: 0.18;
    animation: skillMorph 6s ease-in-out infinite;
}

@keyframes skillMorph {
    0%,
    100% {
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        transform: rotate(0deg);
    }
    50% {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        transform: rotate(20deg);
    }
}

.dropzone-illust .icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--brand-600);
}

.dropzone-illust .badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background: #fff;
    color: var(--brand-700);
    font-size: 10px;
    font-weight: 700;
    padding: 3px 7px;
    border-radius: 999px;
    box-shadow: var(--shadow-sm);
    letter-spacing: 0.05em;
}

.dropzone-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink-900);
    letter-spacing: -0.01em;
}

.dropzone-sub {
    font-size: 12.5px;
    color: var(--ink-500);
    max-width: 320px;
    line-height: 1.6;
}

.dropzone-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--brand-700);
    padding: 9px 18px;
    border-radius: var(--r-sm);
    background: var(--brand-50);
    border: 1px solid var(--brand-200);
    transition: all 0.25s var(--ease);
}

.dropzone:hover .dropzone-cta {
    background: var(--brand-500);
    color: #fff;
    border-color: var(--brand-500);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.dropzone-hints {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 11.5px;
    color: var(--ink-500);
}

.dropzone-hints span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* ============ Selected file (progress card) ============ */
.file-card {
    padding: 16px 18px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75));
    border: 1px solid var(--border-soft);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-sm);
    display: flex;
    gap: 14px;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.file-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--brand-400), var(--brand-600));
}

.file-icon {
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    border-radius: var(--r-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--brand-100), var(--brand-50));
    color: var(--brand-700);
    position: relative;
}

.file-icon::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--brand-500);
    border: 2px solid #fff;
}

.file-body {
    flex: 1;
    min-width: 0;
}

.file-name-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.file-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ink-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-pct {
    font-size: 13px;
    font-weight: 700;
    color: var(--brand-700);
    font-variant-numeric: tabular-nums;
}

.file-bar {
    height: 5px;
    border-radius: 999px;
    background: var(--ink-100);
    margin-top: 10px;
    overflow: hidden;
}

.file-bar i {
    display: block;
    height: 100%;
    width: 64%;
    background: linear-gradient(90deg, var(--brand-400), var(--brand-600));
    border-radius: 999px;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    position: relative;
    transition: width 0.3s var(--ease);
}

.file-bar i::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: skillShine 1.5s linear infinite;
}

@keyframes skillShine {
    to {
        transform: translateX(100%);
    }
}

.file-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    color: var(--ink-500);
    margin-top: 8px;
}

.file-meta .status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--brand-700);
    font-weight: 600;
}

.file-meta .status::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--brand-500);
    animation: skillPulse 1.4s ease-in-out infinite;
}

@keyframes skillPulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
}

.file-remove {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border: 0;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: var(--ink-400);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s var(--ease);
}

.file-remove:hover {
    background: #fee2e2;
    color: #dc2626;
}

/* ============ Tip callout ============ */
.tip {
    margin-top: 4px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 14px;
    background: linear-gradient(135deg, #fffbeb, #fef3c7);
    border: 1px solid #fde68a;
    border-radius: var(--r-sm);
    font-size: 12px;
    color: #92400e;
    line-height: 1.6;
}

.tip strong {
    color: #78350f;
}

/* ============ Specs grid ============ */
.specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.spec {
    padding: 14px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.6));
    border: 1px solid var(--border-soft);
    border-radius: var(--r-md);
    display: flex;
    gap: 12px;
    align-items: flex-start;
    transition: all 0.25s var(--ease);
    position: relative;
    overflow: hidden;
}

.spec:hover {
    border-color: var(--brand-300);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.08);
}

.spec-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--brand-100), var(--brand-50));
    color: var(--brand-700);
}

.spec-body {
    min-width: 0;
}

.spec-title {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ink-900);
    letter-spacing: -0.005em;
    display: flex;
    align-items: center;
    gap: 6px;
}

.spec-title .pill {
    font-size: 9.5px;
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--ink-100);
    color: var(--ink-600);
    font-weight: 600;
    text-transform: uppercase;
}

.spec-title .pill.req {
    background: #fee2e2;
    color: #b91c1c;
}

.spec-title .pill.opt {
    background: #dbeafe;
    color: #1d4ed8;
}

.spec-desc {
    font-size: 11.5px;
    color: var(--ink-500);
    margin-top: 3px;
    line-height: 1.5;
}

/* ============ Tree example ============ */
.tree-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(248, 250, 252, 0.85));
    border: 1px solid var(--border-soft);
    border-radius: var(--r-md);
    padding: 16px 18px;
}

.tree-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.tree-head h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-900);
}

.tree-head .dl-btn {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--brand-700);
    background: transparent;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.tree-head .dl-btn:hover {
    background: var(--brand-50);
}

.tree {
    font-size: 12.5px;
    line-height: 1.9;
}

.tree ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.tree li {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ink-700);
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 12px;
}

.tree .indent {
    width: 18px;
    flex-shrink: 0;
}

.tree .file-ic {
    color: var(--brand-600);
}

.tree .dir-ic {
    color: #f59e0b;
}

.tree .req-tag {
    font-size: 9.5px;
    padding: 1px 5px;
    border-radius: 3px;
    background: #fee2e2;
    color: #b91c1c;
    font-weight: 700;
    text-transform: uppercase;
    margin-left: 4px;
    font-family: inherit;
}

.tree .opt-tag {
    font-size: 9.5px;
    padding: 1px 5px;
    border-radius: 3px;
    background: #dbeafe;
    color: #1d4ed8;
    font-weight: 700;
    text-transform: uppercase;
    margin-left: 4px;
    font-family: inherit;
}

/* ============ Footer ============ */
.d-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 5px 28px;
    background: rgba(255, 255, 255, 0.85);
    border-top: 1px solid var(--border-soft);
    backdrop-filter: blur(12px);
}

.foot-left {
    font-size: 12px;
    color: var(--ink-500);
}

.foot-left kbd {
    display: inline-block;
    padding: 1px 6px;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 11px;
    background: var(--ink-100);
    color: var(--ink-700);
    border-radius: 4px;
    border: 1px solid var(--border);
    margin: 0 2px;
}

.foot-right {
    display: inline-flex;
    gap: 10px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    padding: 0 20px;
    border-radius: var(--r-sm);
    font: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.25s var(--ease);
    letter-spacing: 0.01em;
}

.btn-ghost {
    background: rgba(15, 23, 42, 0.04);
    border-color: var(--border);
    color: var(--ink-700);
}

.btn-ghost:hover:not(:disabled) {
    background: rgba(15, 23, 42, 0.08);
    color: var(--ink-900);
}

.btn-primary {
    color: #fff;
    background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.18);
    min-width: 132px;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(16, 185, 129, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:active:not(:disabled) {
    transform: translateY(0);
}

.btn-primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
}

/* ============ Responsive ============ */
@media (max-width: 720px) {
    .d-body {
        grid-template-columns: 1fr;
    }
    .specs {
        grid-template-columns: 1fr;
    }
}

/* NOTE: .skill-content-dialog container overrides are in the NON-SCOPED
   <style> block at the bottom (same Teleport reason as .skill-upload-dialog). */

.skill-content-viewer {
    max-height: 82vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.content-tabs {
    :deep(.t-tabs__nav) {
        min-width: 180px;
        padding-top: 4px;
    }

    :deep(.t-tab-panel) {
        padding-left: 16px;
    }
}

.skill-file-block {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--td-border-level-1-color);
    border-radius: 10px;
    overflow: hidden;
    background: var(--td-bg-color-secondarycontainer);
}

.skill-file-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--td-bg-color-container);
    border-bottom: 1px solid var(--td-border-level-1-color);

    .skill-file-name {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: var(--td-text-color-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .skill-file-copy {
        flex-shrink: 0;
        color: var(--td-text-color-secondary);
    }
}

.skill-file-content {
    padding: 16px 18px;
    font-size: 13px;
    line-height: 1.7;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 70vh;
    overflow-y: auto;
    margin: 0;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    color: var(--td-text-color-primary);
    tab-size: 4;
}

.content-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 56px 20px;
    color: var(--td-text-color-placeholder);
    font-size: 14px;

    .content-empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: var(--td-bg-color-secondarycontainer);
        color: var(--td-text-color-disabled);
    }
}

.tenant-search-error {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--td-warning-color);
    line-height: 1.6;
}

.share-dialog-content {
    .share-skill-info {
        padding: 12px 14px;
        background: var(--td-bg-color-secondarycontainer);
        border-radius: 8px;

        h4 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--td-text-color-primary);
        }

        p {
            margin: 4px 0 0;
            font-size: 12px;
            color: var(--td-text-color-secondary);
            line-height: 1.5;
        }
    }

    .share-new-tenant {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-top: 12px;
    }

    .no-shares {
        padding: 20px;
        text-align: center;
        color: var(--td-text-color-placeholder);
        font-size: 13px;
    }

    .shares-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .share-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: var(--td-bg-color-container);
        border: 1px solid var(--td-border-level-1-color);
        border-radius: 8px;

        .share-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .tenant-id {
            font-size: 13px;
            font-weight: 500;
            color: var(--td-text-color-primary);
        }

        .share-date {
            font-size: 11px;
            color: var(--td-text-color-placeholder);
        }
    }
}

@media (max-width: 640px) {
    .spec-grid {
        grid-template-columns: 1fr;
    }

    .upload-footer {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>

<!-- ═══════════════════════════════════════════════════════════════
     NON-SCOPED styles — required because t-dialog renders via Teleport,
     so the scoped [data-v] attribute does not reliably reach the
     teleported .t-dialog element itself. Every selector is namespaced
     under .skill-upload-dialog / .skill-content-dialog to avoid global
     pollution. Mirrors the approach used in TaskEditorModal.vue.
     ═══════════════════════════════════════════════════════════════ -->
<style>
/* ========== Skill content dialog ========== */
.skill-content-dialog {
    border-radius: 16px !important;
    overflow: hidden !important;
}

.skill-content-dialog .t-dialog__body {
    padding: 0 24px 24px !important;
}
</style>
