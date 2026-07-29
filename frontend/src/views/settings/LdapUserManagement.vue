<template>
    <div class="ldap-user-management">
        <div class="page-header">
            <h2 class="page-title">{{ $t('ldapUserManagement.title') }}</h2>
            <p class="page-desc">{{ $t('ldapUserManagement.description') }}</p>
        </div>

        <div class="search-bar">
            <t-input
                v-model="searchKeyword"
                :placeholder="$t('ldapUserManagement.searchPlaceholder')"
                clearable
                class="search-input"
                @enter="handleSearch"
                @clear="handleSearch"
            >
                <template #suffix-icon>
                    <t-icon name="search" @click="handleSearch" />
                </template>
            </t-input>
        </div>

        <t-table :data="users" :columns="columns" :loading="loading" row-key="id" hover lazy-load table-layout="fixed">
            <template #username="{ row }">
                <div class="user-cell">
                    <t-avatar v-if="row.avatar" :image="row.avatar" size="small" />
                    <t-avatar v-else size="small">{{ row.username?.charAt(0)?.toUpperCase() }}</t-avatar>
                    <div class="user-info">
                        <div class="user-name">{{ row.username }}</div>
                        <div class="user-email">{{ row.email }}</div>
                    </div>
                </div>
            </template>

            <template #status="{ row }">
                <t-tag v-if="row.is_active" theme="success" variant="light">{{ $t('general.active') }}</t-tag>
                <t-tag v-else theme="default" variant="light">{{ $t('general.inactive') }}</t-tag>
            </template>

            <template #created_at="{ row }">
                {{ formatDate(row.created_at) }}
            </template>

            <template #operation="{ row }">
                <t-popconfirm
                    theme="danger"
                    :content="$t('ldapUserManagement.confirmDelete')"
                    @confirm="handleDelete(row)"
                >
                    <t-button variant="text" theme="danger" size="small">
                        <t-icon name="delete" />
                        {{ $t('general.delete') }}
                    </t-button>
                </t-popconfirm>
            </template>
        </t-table>

        <div class="pagination-wrapper">
            <t-pagination
                v-model="pagination.current"
                v-model:page-size="pagination.pageSize"
                :total="pagination.total"
                :page-size-options="[10, 20, 50]"
                show-jumper
                show-sizer
                @change="handlePageChange"
                @page-size-change="handlePageSizeChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { MessagePlugin } from 'tdesign-vue-next';
import { listLdapUsers, deleteLdapUser } from '@/api/system';
import type { LdapUser } from '@/api/system';

const { t } = useI18n();

const loading = ref(false);
const users = ref<LdapUser[]>([]);
const searchKeyword = ref('');
const pagination = ref({
    current: 1,
    pageSize: 20,
    total: 0
});

const columns = computed(() => [
    {
        colKey: 'username',
        title: t('ldapUserManagement.columns.username'),
        width: 240
    },
    {
        colKey: 'ldap_login_name',
        title: t('ldapUserManagement.columns.ldapLoginName'),
        width: 150
    },
    {
        colKey: 'status',
        title: t('ldapUserManagement.columns.status'),
        width: 100
    },
    {
        colKey: 'created_at',
        title: t('ldapUserManagement.columns.createdAt'),
        width: 180
    },
    {
        colKey: 'operation',
        title: t('general.operation'),
        width: 120,
        fixed: 'right'
    }
]);

function formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString();
}

async function fetchUsers() {
    loading.value = true;
    try {
        const offset = (pagination.value.current - 1) * pagination.value.pageSize;
        const res = await listLdapUsers({
            offset,
            limit: pagination.value.pageSize,
            search: searchKeyword.value || undefined
        });
        users.value = res.users || [];
        pagination.value.total = res.total || 0;
    } catch (err: any) {
        MessagePlugin.error(err?.message || t('ldapUserManagement.fetchFailed'));
    } finally {
        loading.value = false;
    }
}

function handleSearch() {
    pagination.value.current = 1;
    fetchUsers();
}

function handlePageChange(pageInfo: { current: number; pageSize: number }) {
    pagination.value.current = pageInfo.current;
    fetchUsers();
}

function handlePageSizeChange(pageSize: number) {
    pagination.value.pageSize = pageSize;
    pagination.value.current = 1;
    fetchUsers();
}

async function handleDelete(row: LdapUser) {
    try {
        await deleteLdapUser(row.id);
        MessagePlugin.success(t('ldapUserManagement.deleteSuccess'));
        await fetchUsers();
    } catch (err: any) {
        MessagePlugin.error(err?.message || t('ldapUserManagement.deleteFailed'));
    }
}

onMounted(() => {
    fetchUsers();
});
</script>

<style lang="less" scoped>
.ldap-user-management {
    padding: 8px 0;

    .page-header {
        margin-bottom: 24px;

        .page-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 6px 0;
            color: var(--td-text-color-primary);
        }

        .page-desc {
            font-size: 13px;
            color: var(--td-text-color-secondary);
            margin: 0;
        }
    }

    .search-bar {
        margin-bottom: 16px;

        .search-input {
            width: 320px;
        }
    }

    .user-cell {
        display: flex;
        align-items: center;
        gap: 10px;

        .user-info {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .user-name {
                font-weight: 500;
                font-size: 14px;
                color: var(--td-text-color-primary);
            }

            .user-email {
                font-size: 12px;
                color: var(--td-text-color-secondary);
            }
        }
    }

    .pagination-wrapper {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
