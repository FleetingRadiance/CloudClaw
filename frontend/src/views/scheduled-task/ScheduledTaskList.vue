<template>
    <div class="scheduled-task-list-container">
        <div class="header">
            <div class="header-title">
                <h2>{{ $t('scheduledTask.title') }}</h2>
                <p class="header-subtitle">{{ $t('scheduledTask.subtitle') }}</p>
            </div>
            <div class="header-actions">
                <t-button theme="primary" @click="handleCreate">
                    <template #icon>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                            />
                        </svg>
                    </template>
                    {{ $t('scheduledTask.createTask') }}
                </t-button>
            </div>
        </div>

        <div class="stats-bar" v-if="stats">
            <div class="stat-card">
                <span class="stat-value">{{ stats.total_tasks ?? 0 }}</span>
                <span class="stat-label">{{ $t('scheduledTask.statTotal') }}</span>
            </div>
            <div class="stat-card">
                <span class="stat-value success">{{ stats.active_tasks ?? 0 }}</span>
                <span class="stat-label">{{ $t('scheduledTask.statActive') }}</span>
            </div>
            <div class="stat-card">
                <span class="stat-value success">{{ stats.success_execs ?? 0 }}</span>
                <span class="stat-label">{{ $t('scheduledTask.statSuccess') }}</span>
            </div>
            <div class="stat-card">
                <span class="stat-value fail">{{ stats.failed_execs ?? 0 }}</span>
                <span class="stat-label">{{ $t('scheduledTask.statFailed') }}</span>
            </div>
            <div class="stat-card" v-if="stats.concurrent_now !== undefined">
                <span class="stat-value running">{{ stats.concurrent_now }}</span>
                <span class="stat-label">{{ $t('scheduledTask.statRunning') }}</span>
            </div>
        </div>

        <div class="toolbar">
            <div class="search">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
                    <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <input
                    v-model="keyword"
                    :placeholder="$t('scheduledTask.searchPlaceholder') || '搜索任务名称、Agent、描述...'"
                />
            </div>
            <div class="toolbar-right">
                <div class="filter-pills">
                    <button :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">
                        <span class="lbl">{{ $t('common.all') }}</span>
                        <span class="count">{{ tasks.length }}</span>
                    </button>
                    <button :class="{ active: statusFilter === 'active' }" @click="statusFilter = 'active'">
                        <span class="dot dot-success"></span>
                        <span class="lbl">{{ $t('scheduledTask.statusActive') }}</span>
                        <span class="count">{{ countByStatus('active') }}</span>
                    </button>
                    <button :class="{ active: statusFilter === 'paused' }" @click="statusFilter = 'paused'">
                        <span class="dot dot-warn"></span>
                        <span class="lbl">{{ $t('scheduledTask.statusPaused') }}</span>
                        <span class="count">{{ countByStatus('paused') }}</span>
                    </button>
                    <button :class="{ active: statusFilter === 'disabled' }" @click="statusFilter = 'disabled'">
                        <span class="dot dot-mute"></span>
                        <span class="lbl">{{ $t('scheduledTask.statusDisabled') }}</span>
                        <span class="count">{{ countByStatus('disabled') }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="task-list-main">
            <div v-if="loading && tasks.length === 0" class="task-cards">
                <div
                    v-for="n in 4"
                    :key="'skel-' + n"
                    class="task-card task-card-skeleton"
                    :style="{ animationDelay: n * 0.08 + 's' }"
                >
                    <div class="skel-line skel-title"></div>
                    <div class="skel-line skel-desc"></div>
                    <div class="skel-line skel-meta"></div>
                </div>
            </div>

            <div v-else-if="filteredTasks.length === 0" class="empty-state">
                <t-icon name="calendar-2" size="48px" class="empty-icon" />
                <p class="empty-text">{{ $t('scheduledTask.emptyTip') }}</p>
                <p class="empty-sub">
                    {{ $t('scheduledTask.emptySub') || '编排自动执行的智能体任务，按天 / 周 / 月周期性运行' }}
                </p>
                <t-button theme="primary" class="empty-action" @click="handleCreate">
                    <template #icon>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                            />
                        </svg>
                    </template>
                    {{ $t('scheduledTask.createTask') }}
                </t-button>
            </div>

            <div v-else class="task-cards">
                <div
                    v-for="task in filteredTasks"
                    :key="task.id"
                    class="task-card"
                    :class="{
                        's-active': task.status === 'active',
                        's-paused': task.status === 'paused',
                        's-disabled': task.status === 'disabled'
                    }"
                >
                    <button
                        class="kb-favorite-star"
                        @click.stop="handleToggle(task)"
                        :title="task.status === 'active' ? $t('scheduledTask.pause') : $t('scheduledTask.resume')"
                    >
                        <t-icon :name="task.status === 'active' ? 'pause-circle' : 'play-circle'" size="16px" />
                    </button>
                    <div class="card-header">
                        <span class="card-title">{{ task.name }}</span>
                        <span class="chip" :class="chipClass(task.status)">
                            <span class="dot"></span>
                            {{ statusLabel(task.status) }}
                        </span>
                        <span v-if="isBuiltinSmart(task)" class="chip chip-info">ReAct</span>
                    </div>
                    <div class="card-content">
                        <p class="card-description">{{ task.prompt }}</p>
                        <div class="card-meta">
                            <span class="meta-pill">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <rect
                                        x="4"
                                        y="7"
                                        width="16"
                                        height="13"
                                        rx="2"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                    />
                                    <path d="M9 7V4h6v3" stroke="currentColor" stroke-width="1.6" />
                                    <circle cx="12" cy="13" r="2" stroke="currentColor" stroke-width="1.6" />
                                </svg>
                                {{ getAgentName(task) }}
                            </span>
                            <span class="meta-pill">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6" />
                                    <path
                                        d="M12 8v4l3 2"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                {{ scheduleLabel(task) }}
                            </span>
                            <span v-if="parsedSkills(task).length" class="meta-pill">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <rect
                                        x="4"
                                        y="4"
                                        width="16"
                                        height="16"
                                        rx="3"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                    />
                                    <path
                                        d="M9 12l2 2 4-4"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                {{ $t('scheduledTask.skillCount', { n: parsedSkills(task).length }) }}
                            </span>
                        </div>
                    </div>
                    <div class="card-bottom">
                        <div class="bottom-left">
                            <span class="kv">
                                <span class="k">{{ $t('scheduledTask.nextRun') }}</span>
                                <span class="v">{{ task.next_run_at ? formatTime(task.next_run_at) : '—' }}</span>
                            </span>
                            <span class="kv">
                                <span class="k">{{ $t('scheduledTask.lastRun') }}</span>
                                <span class="v">{{ task.last_run_at ? formatTime(task.last_run_at) : '—' }}</span>
                            </span>
                            <span class="kv">
                                <span class="k">{{ $t('scheduledTask.successCount') }}</span>
                                <span class="v ok">{{ task.success_count ?? 0 }}</span>
                            </span>
                            <span class="kv">
                                <span class="k">{{ $t('scheduledTask.failureCount') }}</span>
                                <span class="v ng">{{ task.failure_count ?? 0 }}</span>
                            </span>
                        </div>
                        <div class="bottom-right">
                            <t-button
                                variant="text"
                                size="small"
                                :disabled="task.status !== 'active' || triggeringId === task.id"
                                @click="handleTrigger(task)"
                            >
                                <template #icon><t-icon name="play-circle" size="14px" /></template>
                                {{ $t('scheduledTask.triggerNow') }}
                            </t-button>
                            <t-button variant="text" size="small" @click="handleViewExecutions(task)">
                                <template #icon><t-icon name="browse" size="14px" /></template>
                                {{ $t('scheduledTask.viewResults') }}
                            </t-button>
                            <t-button variant="text" size="small" @click="handleEdit(task)">
                                <template #icon><t-icon name="edit" size="14px" /></template>
                                {{ $t('common.edit') }}
                            </t-button>
                            <t-button
                                variant="text"
                                size="small"
                                theme="danger"
                                :disabled="deletingId === task.id"
                                @click="handleDelete(task)"
                            >
                                <template #icon><t-icon name="delete" size="14px" /></template>
                                {{ $t('common.delete') }}
                            </t-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import {
    listScheduledTasks,
    deleteScheduledTask,
    toggleScheduledTask,
    triggerScheduledTask,
    getScheduledTaskStats,
    type ScheduledTask,
    type ScheduledTaskStats
} from '@/api/scheduled-task';
import { listAgents } from '@/api/agent';
import { listSharedAgents } from '@/api/organization';

const router = useRouter();
const { t } = useI18n();

const tasks = ref<ScheduledTask[]>([]);
const stats = ref<ScheduledTaskStats | null>(null);
const loading = ref(false);
const deletingId = ref<string | null>(null);
const triggeringId = ref<string | null>(null);
const keyword = ref('');
const statusFilter = ref<'all' | 'active' | 'paused' | 'disabled'>('all');
const agentMap = ref<Record<string, string>>({});

async function fetchTasks() {
    loading.value = true;
    try {
        const res = await listScheduledTasks();
        tasks.value = (res.data !== undefined ? res.data : res) || [];
    } catch (e: any) {
        MessagePlugin.error(e?.message || t('scheduledTask.fetchError'));
    } finally {
        loading.value = false;
    }
}

async function fetchAgentNames() {
    try {
        const [ownRes, sharedRes] = await Promise.all([
            listAgents().catch(() => ({ data: [] })),
            listSharedAgents().catch(() => ({ data: [] }))
        ]);
        const map: Record<string, string> = {};
        ((ownRes as any).data || []).forEach((a: any) => {
            map[a.id] = a.name || a.id;
        });
        ((sharedRes as any).data || []).forEach((s: any) => {
            if (s.agent && s.agent.id) {
                map[s.agent.id] = s.agent.name || s.agent.id;
            }
        });
        agentMap.value = map;
    } catch {
        /* ignore */
    }
}

function getAgentName(task: ScheduledTask): string {
    if (task.agent_name) return task.agent_name;
    if (task.agent_id && agentMap.value[task.agent_id]) return agentMap.value[task.agent_id];
    if (task.agent_id === 'builtin-smart') return '智能助手';
    return task.agent_id || '—';
}

async function fetchStats() {
    try {
        const res = await getScheduledTaskStats();
        stats.value = (res.data !== undefined ? res.data : res) || null;
    } catch {
        /* ignore */
    }
}

function handleCreate() {
    router.push({ name: 'scheduledTaskCreate' });
}

function handleEdit(task: ScheduledTask) {
    router.push({ name: 'scheduledTaskEdit', params: { taskId: task.id } });
}

async function handleDelete(task: ScheduledTask) {
    if (deletingId.value) return;
    deletingId.value = task.id;
    try {
        await deleteScheduledTask(task.id);
        MessagePlugin.success(t('scheduledTask.deleteSuccess'));
        stats.value = null;
        await fetchTasks();
        await fetchStats();
    } catch (e: any) {
        MessagePlugin.error(e?.message || t('scheduledTask.deleteError'));
    } finally {
        deletingId.value = null;
    }
}

async function handleToggle(task: ScheduledTask) {
    try {
        await toggleScheduledTask(task.id);
        await Promise.all([fetchTasks(), fetchStats()]);
    } catch (e: any) {
        MessagePlugin.error(e?.message || t('scheduledTask.toggleError'));
    }
}

async function handleTrigger(task: ScheduledTask) {
    if (triggeringId.value) return;
    triggeringId.value = task.id;
    try {
        await triggerScheduledTask(task.id);
        MessagePlugin.success(t('scheduledTask.triggerSuccess'));
        router.push({ name: 'scheduledTaskExecutions', params: { taskId: task.id } });
    } catch (e: any) {
        MessagePlugin.error(e?.message || t('scheduledTask.triggerError'));
    } finally {
        triggeringId.value = null;
    }
}

function handleViewExecutions(task: ScheduledTask) {
    router.push({ name: 'scheduledTaskExecutions', params: { taskId: task.id } });
}

function statusLabel(status: string) {
    return t(`scheduledTask.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
}

function chipClass(status: string) {
    if (status === 'active') return 'chip-success';
    if (status === 'paused') return 'chip-warn';
    return 'chip-mute';
}

function isBuiltinSmart(task: ScheduledTask) {
    return task.agent_id === 'builtin-smart';
}

function parsedSkills(task: ScheduledTask): string[] {
    if (!task.selected_skills) return [];
    try {
        const arr = JSON.parse(task.selected_skills);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

function countByStatus(status: string) {
    return tasks.value.filter((t) => t.status === status).length;
}

const filteredTasks = computed(() => {
    let list = tasks.value;
    if (statusFilter.value !== 'all') {
        list = list.filter((t) => t.status === statusFilter.value);
    }
    const kw = keyword.value.trim().toLowerCase();
    if (kw) {
        list = list.filter((t) => {
            const agentName = getAgentName(t).toLowerCase();
            return (
                (t.name || '').toLowerCase().includes(kw) ||
                (t.prompt || '').toLowerCase().includes(kw) ||
                agentName.includes(kw) ||
                (t.agent_id || '').toLowerCase().includes(kw)
            );
        });
    }
    return list;
});

function scheduleLabel(task: ScheduledTask) {
    const weekdayMap: Record<number, string> = {
        1: t('scheduledTask.monday'),
        2: t('scheduledTask.tuesday'),
        3: t('scheduledTask.wednesday'),
        4: t('scheduledTask.thursday'),
        5: t('scheduledTask.friday'),
        6: t('scheduledTask.saturday'),
        7: t('scheduledTask.sunday')
    };
    const typeMap: Record<string, string> = {
        cron: task.cron_expr,
        interval: `${task.interval_minutes}${t('scheduledTask.minute')}`,
        once: task.run_once_at ? formatTime(task.run_once_at) : '',
        daily: `${t('scheduledTask.everyDay')} ${task.schedule_time}`,
        weekly: `${t('scheduledTask.everyWeek')} ${weekdayMap[task.schedule_day_of_week] || ''} ${task.schedule_time}`,
        monthly: `${t('scheduledTask.everyMonth')} ${task.schedule_day_of_month} ${t('scheduledTask.dayOfMonth')} ${task.schedule_time}`
    };
    return typeMap[task.schedule_type] || task.schedule_type;
}

function formatTime(time: string | null) {
    if (!time) return '—';
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return time;
    return date
        .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
        .replace(/\//g, '-');
}

onMounted(() => {
    fetchTasks();
    fetchStats();
    fetchAgentNames();
});
</script>

<style scoped>
.scheduled-task-list-container {
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

.stats-bar {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    flex-shrink: 0;
}

.stat-card {
    flex: 1;
    padding: 12px 16px;
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-component-stroke);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--td-text-color-primary);
    font-variant-numeric: tabular-nums;
}

.stat-value.success {
    color: var(--td-success-color);
}

.stat-value.fail {
    color: var(--td-error-color);
}

.stat-value.running {
    color: var(--td-warning-color);
}

.stat-label {
    font-size: 12px;
    color: var(--td-text-color-placeholder);
}

.toolbar {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
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

.filter-pills {
    display: inline-flex;
    padding: 3px;
    gap: 2px;
    background: var(--td-bg-color-secondarycontainer);
    border-radius: 8px;
}

.filter-pills button {
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

.filter-pills button:hover {
    color: var(--td-text-color-primary);
}

.filter-pills button.active {
    background: var(--td-bg-color-container);
    color: var(--td-text-color-primary);
    font-weight: 550;
}

.filter-pills .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.filter-pills .dot-success {
    background: var(--td-success-color);
}

.filter-pills .dot-warn {
    background: var(--td-warning-color);
}

.filter-pills .dot-mute {
    background: var(--td-text-color-placeholder);
}

.filter-pills .count {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--td-bg-color-component);
    color: var(--td-text-color-secondary);
    font-variant-numeric: tabular-nums;
}

.task-list-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 8px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: var(--td-text-color-secondary);
}

.empty-icon {
    color: var(--td-brand-color);
    margin-bottom: 12px;
}

.empty-text {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--td-text-color-primary);
}

.empty-sub {
    margin: 4px 0 16px;
    font-size: 13px;
    color: var(--td-text-color-secondary);
    text-align: center;
    max-width: 360px;
}

.task-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-card {
    position: relative;
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-component-stroke);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    padding: 12px 14px;
    transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease;
}

.task-card:hover {
    border-color: var(--td-brand-color);
    box-shadow: 0 4px 12px rgba(7, 192, 95, 0.12);
}

.task-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--td-component-stroke);
}

.task-card.s-active::before {
    background: var(--td-brand-color);
}

.task-card.s-paused::before {
    background: var(--td-warning-color);
}

.task-card.s-disabled {
    opacity: 0.75;
}

.kb-favorite-star {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 0;
    background: transparent;
    color: var(--td-text-color-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.22s ease;
    z-index: 1;
}

.kb-favorite-star:hover {
    background: var(--td-bg-color-secondarycontainer);
    color: var(--td-brand-color);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-right: 36px;
}

.card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--td-text-color-primary);
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 550;
}

.chip .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
}

.chip-success {
    background: var(--td-brand-color-light);
    color: var(--td-brand-color-active);
}

.chip-success .dot {
    animation: pulse 1.6s ease-in-out infinite;
}

.chip-warn {
    background: var(--td-warning-color-light, #fef3e6);
    color: var(--td-warning-color, #b85a1f);
}

.chip-mute {
    background: var(--td-bg-color-secondarycontainer);
    color: var(--td-text-color-secondary);
}

.chip-info {
    background: rgba(0, 82, 217, 0.08);
    color: #1d4ed8;
}

.card-content {
    margin-top: 8px;
}

.card-description {
    font-size: 12.5px;
    color: var(--td-text-color-secondary);
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 8px;
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

.meta-pill svg {
    flex-shrink: 0;
    color: var(--td-text-color-placeholder);
}

.card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 0.5px solid var(--td-component-stroke);
    gap: 16px;
}

.bottom-left {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.kv {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
}

.kv .k {
    color: var(--td-text-color-placeholder);
}

.kv .v {
    color: var(--td-text-color-primary);
    font-variant-numeric: tabular-nums;
}

.kv .v.ok {
    color: var(--td-success-color);
    font-weight: 600;
}

.kv .v.ng {
    color: var(--td-error-color);
    font-weight: 600;
}

.bottom-right {
    display: flex;
    gap: 4px;
}

.bottom-right :deep(.t-button) {
    padding: 4px 10px;
    font-size: 12px;
}

.task-card-skeleton {
    pointer-events: none;

    .skel-line {
        background: linear-gradient(
            90deg,
            var(--td-bg-color-secondarycontainer) 25%,
            var(--td-bg-color-container-hover) 50%,
            var(--td-bg-color-secondarycontainer) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    .skel-title {
        width: 50%;
        height: 16px;
        margin-bottom: 8px;
    }

    .skel-desc {
        width: 80%;
        height: 12px;
        margin-bottom: 8px;
    }

    .skel-meta {
        width: 40%;
        height: 10px;
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.35;
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

@media (max-width: 768px) {
    .stats-bar {
        flex-wrap: wrap;
    }

    .stat-card {
        min-width: calc(50% - 6px);
    }

    .card-bottom {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
