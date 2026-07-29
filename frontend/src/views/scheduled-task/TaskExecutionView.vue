<template>
    <div class="task-execution-view">
        <!-- 顶部栏 -->
        <div class="exec-topbar">
            <div class="topbar-left">
                <t-button variant="text" size="small" @click="goBack">
                    <template #icon><t-icon name="arrow-left" /></template>
                    {{ $t('scheduledTask.backToList') }}
                </t-button>
                <span class="topbar-title">{{ task?.name || '' }}</span>
                <t-tag v-if="task" :theme="statusTheme(task.status)" size="small" variant="light">
                    {{ statusLabel(task.status) }}
                </t-tag>
            </div>
            <div class="topbar-right">
                <t-button
                    variant="outline"
                    size="small"
                    @click="handleTrigger"
                    :disabled="!task || task.status !== 'active'"
                >
                    <template #icon><t-icon name="play-circle" /></template>
                    {{ $t('scheduledTask.triggerNow') }}
                </t-button>
            </div>
        </div>

        <!-- 左右分栏 -->
        <div class="exec-split">
            <!-- 左侧：执行历史列表 -->
            <div class="exec-list-panel">
                <t-loading :loading="loading" size="small" />
                <div v-if="!loading && executions.length === 0" class="empty-state">
                    <t-icon name="calendar" size="32px" style="color: var(--td-text-color-disabled)" />
                    <p>{{ $t('scheduledTask.noExecLogs') }}</p>
                </div>
                <div
                    v-for="exec in executions"
                    :key="exec.id"
                    class="exec-list-item"
                    :class="{ active: selectedExec?.id === exec.id }"
                    @click="selectExec(exec)"
                >
                    <div class="exec-list-row">
                        <t-tag :theme="execStatusTheme(exec.status)" size="small" variant="light">
                            {{ execStatusLabel(exec.status) }}
                        </t-tag>
                        <span class="exec-list-time">{{ formatTime(exec.created_at) }}</span>
                    </div>
                    <div class="exec-list-meta">
                        <span v-if="exec.duration_ms" class="exec-list-duration">
                            {{ (exec.duration_ms / 1000).toFixed(1) }}s
                        </span>
                        <span v-if="exec.created_at" class="exec-list-relative">{{
                            relativeTime(exec.created_at)
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- 右侧：执行详情 -->
            <div class="exec-detail-panel">
                <div v-if="!selectedExec" class="empty-state">
                    <template v-if="task && task.status === 'active'">
                        <div class="waiting-card">
                            <div class="waiting-avatar"><t-icon name="user-circle" size="32px" /></div>
                            <div class="waiting-content">
                                <div class="waiting-title">{{ $t('scheduledTask.waitingForExecution') }}</div>
                                <div class="waiting-prompt-label">{{ $t('scheduledTask.taskPromptLabel') }}</div>
                                <div class="waiting-prompt-text" :title="task?.prompt">{{ task?.prompt }}</div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <t-icon name="file-icon" size="48px" style="color: var(--td-text-color-disabled)" />
                        <p>{{ $t('scheduledTask.selectExecution') }}</p>
                    </template>
                </div>
                <template v-else>
                    <!-- 详情头部 -->
                    <div class="exec-detail-header">
                        <span class="detail-time">{{ formatTime(selectedExec.created_at) }}</span>
                        <t-tag :theme="execStatusTheme(selectedExec.status)" size="small" variant="light">
                            {{ execStatusLabel(selectedExec.status) }}
                        </t-tag>
                        <span v-if="selectedExec.duration_ms" class="detail-duration">
                            {{ $t('scheduledTask.duration') }}: {{ (selectedExec.duration_ms / 1000).toFixed(1) }}s
                        </span>
                    </div>

                    <!-- 详情内容（可滚动） -->
                    <div ref="detailBodyRef" class="exec-detail-body">
                        <!-- 错误信息 -->
                        <div v-if="selectedExec.error" class="exec-error-box">
                            <t-icon name="error-circle" size="16px" />
                            <pre>{{ selectedExec.error }}</pre>
                        </div>

                        <template v-else>
                            <!-- 执行中：展示实时思考链 -->
                            <div
                                v-if="selectedExec.status === 'running' || selectedExec.status === 'pending'"
                                class="exec-running-section"
                            >
                                <div class="running-indicator">
                                    <span class="thinking-dots"
                                        ><span class="dot"></span><span class="dot"></span><span class="dot"></span
                                    ></span>
                                    <span>{{
                                        processSteps.length > 0
                                            ? $t('scheduledTask.execStatusRunning')
                                            : $t('scheduledTask.agentThinking')
                                    }}</span>
                                </div>
                                <ProcessStepList v-if="processSteps.length > 0" :steps="processSteps" />
                                <transition name="fade" mode="out-in">
                                    <div
                                        v-if="processSteps.length === 0"
                                        key="thinking"
                                        class="agent-thinking-placeholder"
                                    >
                                        <div class="thinking-card">
                                            <div class="thinking-shimmer"></div>
                                            <div class="thinking-avatar"><t-icon name="user-circle" size="32px" /></div>
                                            <div class="thinking-content">
                                                <div class="thinking-title">
                                                    {{ $t('scheduledTask.agentPreparing') }}
                                                </div>
                                                <div class="thinking-prompt-label">
                                                    {{ $t('scheduledTask.taskPromptLabel') }}
                                                </div>
                                                <div class="thinking-prompt-text" :title="task?.prompt">
                                                    {{ task?.prompt }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <!-- 执行完成：展示完整过程 + 最终结果 -->
                            <template v-else>
                                <!-- 过程步骤（可折叠） -->
                                <div v-if="processSteps.length > 0" class="process-section">
                                    <t-collapse :default-expand-all="false">
                                        <t-collapse-panel
                                            :header="$t('scheduledTask.processSteps') + ` (${processSteps.length})`"
                                        >
                                            <ProcessStepList :steps="processSteps" />
                                        </t-collapse-panel>
                                    </t-collapse>
                                </div>

                                <!-- 最终结果 -->
                                <div v-if="selectedExec.result || generatedDocuments.length > 0" class="result-section">
                                    <div class="result-toolbar">
                                        <t-button variant="text" size="small" @click="copyResult">
                                            <template #icon><t-icon name="file-copy" /></template>
                                            {{ $t('scheduledTask.copyResult') }}
                                        </t-button>
                                    </div>
                                    <div v-if="generatedDocuments.length > 0" class="document-results">
                                        <DocumentPreviewResult
                                            v-for="doc in generatedDocuments"
                                            :key="doc.file_url"
                                            :toolData="doc"
                                        />
                                    </div>
                                    <div
                                        v-if="selectedExec.result"
                                        class="markdown-content ai-markdown-template"
                                        v-html="renderedHTML"
                                    ></div>
                                </div>
                                <div v-else class="empty-state">
                                    <t-icon name="file-icon" size="32px" style="color: var(--td-text-color-disabled)" />
                                    <p>{{ $t('scheduledTask.noResult') }}</p>
                                </div>
                            </template>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import { sanitizeHTML, safeMarkdownToHTML } from '@/utils/security';
import { copyTextToClipboard } from '@/utils/chatMessageShared';
import {
    getScheduledTask,
    listTaskExecutions,
    triggerScheduledTask,
    type ScheduledTask,
    type TaskExecution,
    type TaskProcessStep
} from '@/api/scheduled-task';
import ProcessStepList from './ProcessStepList.vue';
import DocumentPreviewResult from '@/views/chat/components/tool-results/DocumentPreviewResult.vue';

marked.use({ breaks: true });
marked.use(markedKatex({ throwOnError: false, nonStandard: true }));

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const task = ref<ScheduledTask | null>(null);
const executions = ref<TaskExecution[]>([]);
const selectedExec = ref<TaskExecution | null>(null);
const loading = ref(false);
const detailBodyRef = ref<HTMLElement | null>(null);
let pollTimer: ReturnType<typeof setTimeout> | null = null;

const renderedHTML = computed(() => {
    if (!selectedExec.value?.result) return '';
    const safeText = safeMarkdownToHTML(selectedExec.value.result);
    const html = marked.parse(safeText, { breaks: true });
    return sanitizeHTML(typeof html === 'string' ? html : '');
});

const processSteps = computed<TaskProcessStep[]>(() => {
    if (!selectedExec.value?.process_data) return [];
    try {
        const parsed = JSON.parse(selectedExec.value.process_data);
        return Array.isArray(parsed) ? (parsed as TaskProcessStep[]) : [];
    } catch {
        return [];
    }
});

interface DocumentPreviewData {
    display_type: 'document_preview';
    file_type: string;
    file_name: string;
    file_url: string;
    preview_url?: string;
    file_size?: number;
}

const generatedDocuments = computed<DocumentPreviewData[]>(() => {
    const docs: DocumentPreviewData[] = [];
    processSteps.value.forEach((step) => {
        if (step.type === 'tool_result' && step.data?.display_type === 'document_preview') {
            docs.push(step.data as DocumentPreviewData);
        }
    });
    return docs;
});

// 执行中自动滚动到底部
watch(
    () => processSteps.value.length,
    () => {
        if (
            selectedExec.value &&
            (selectedExec.value.status === 'running' || selectedExec.value.status === 'pending')
        ) {
            nextTick(() => {
                if (detailBodyRef.value) {
                    detailBodyRef.value.scrollTop = detailBodyRef.value.scrollHeight;
                }
            });
        }
    }
);

async function copyResult() {
    if (!selectedExec.value?.result) return;
    try {
        await copyTextToClipboard(selectedExec.value.result);
        MessagePlugin.success(t('scheduledTask.copySuccess'));
    } catch {
        MessagePlugin.error(t('scheduledTask.copySuccess'));
    }
}

function relativeTime(time: string | null): string {
    if (!time) return '';
    const now = Date.now();
    const diff = now - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return t('scheduledTask.justNow');
    if (minutes < 60) return t('scheduledTask.minutesAgo', { n: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('scheduledTask.hoursAgo', { n: hours });
    return '';
}

async function fetchTask() {
    const taskId = route.params.taskId as string;
    if (!taskId) return;
    try {
        const res = await getScheduledTask(taskId);
        task.value = res.data || null;
    } catch {
        /* ignore */
    }
}

async function fetchExecutions() {
    const taskId = route.params.taskId as string;
    if (!taskId) return;
    loading.value = true;
    try {
        const res = await listTaskExecutions(taskId, 1, 30);
        executions.value = res.data || [];
        if (executions.value.length > 0 && !selectedExec.value) {
            selectedExec.value = executions.value[0];
        }
        if (selectedExec.value) {
            const latest = executions.value.find((e) => e.id === selectedExec.value!.id);
            selectedExec.value = latest || executions.value[0] || null;
        }
        const hasRunning = executions.value.some((e) => e.status === 'running' || e.status === 'pending');
        if (hasRunning) {
            startPolling();
        } else {
            stopPolling();
        }
    } catch {
        /* ignore */
    } finally {
        loading.value = false;
    }
}

function startPolling() {
    if (pollTimer) return;
    scheduleNextPoll();
}

function scheduleNextPoll() {
    // 自适应轮询：运行中但无步骤时 1000ms（更快出现首步），有步骤后 2000ms（步骤已流式无需密集轮询）
    const hasRunningNoSteps = executions.value.some(
        (e) =>
            (e.status === 'running' || e.status === 'pending') &&
            (!e.process_data || safeParseSteps(e.process_data).length === 0)
    );
    const interval = hasRunningNoSteps ? 1000 : 2000;
    pollTimer = setTimeout(async () => {
        pollTimer = null;
        // 注意：fetchExecutions 内部已经会调用 startPolling() 来调度下一次轮询，
        // 这里不再重复调用 scheduleNextPoll()，否则会导致双重调度、定时器指数级泄漏。
        await fetchExecutions();
    }, interval);
}

function safeParseSteps(processData: string | null | undefined): TaskProcessStep[] {
    if (!processData) return [];
    try {
        const parsed = JSON.parse(processData);
        return Array.isArray(parsed) ? (parsed as TaskProcessStep[]) : [];
    } catch {
        return [];
    }
}

function stopPolling() {
    if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
    }
}

function selectExec(exec: TaskExecution) {
    selectedExec.value = exec;
}

function goBack() {
    router.push({ name: 'scheduledTaskList' });
}

async function handleTrigger() {
    if (!task.value) return;
    try {
        await triggerScheduledTask(task.value.id);
        MessagePlugin.success(t('scheduledTask.triggerSuccess'));
        selectedExec.value = null;
        await fetchExecutions();
    } catch (e: any) {
        MessagePlugin.error(e?.message || t('scheduledTask.triggerError'));
    }
}

function statusTheme(status: string) {
    return status === 'active' ? 'success' : status === 'paused' ? 'warning' : 'default';
}

function statusLabel(status: string) {
    return t(`scheduledTask.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
}

function execStatusTheme(status: string) {
    const map: Record<string, string> = {
        success: 'success',
        failed: 'danger',
        running: 'warning',
        timeout: 'warning',
        rate_limit: 'warning',
        pending: 'default'
    };
    return map[status] || 'default';
}

function execStatusLabel(status: string) {
    return t(`scheduledTask.execStatus${status.charAt(0).toUpperCase() + status.slice(1)}`);
}

function formatTime(time: string | null) {
    if (!time) return '-';
    return new Date(time).toLocaleString();
}

onMounted(() => {
    fetchTask();
    fetchExecutions();
});

onBeforeUnmount(() => {
    stopPolling();
});
</script>

<style lang="less" scoped>
@import '@/components/css/markdown.less';

.task-execution-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 顶部栏 */
.exec-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--td-border-level-1-color);
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.topbar-title {
    font-size: 16px;
    font-weight: 600;
}

/* 分栏布局 */
.exec-split {
    flex: 1;
    display: flex;
    overflow: hidden;
}

/* 左侧列表 */
.exec-list-panel {
    width: 220px;
    flex-shrink: 0;
    overflow-y: auto;
    border-right: 1px solid var(--td-border-level-1-color);
    padding: 8px;
}

.exec-list-item {
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 4px;
}

.exec-list-item:hover {
    background: var(--td-bg-color-container-hover);
}

.exec-list-item.active {
    background: var(--td-brand-color-light);
    border-left: 3px solid var(--td-brand-color);
}

.exec-list-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.exec-list-time {
    font-size: 12px;
    color: var(--td-text-color-secondary);
}

.exec-list-meta {
    display: flex;
    gap: 8px;
    margin-top: 2px;
}

.exec-list-duration {
    font-size: 11px;
    color: var(--td-text-color-placeholder);
}

.exec-list-relative {
    font-size: 11px;
    color: var(--td-text-color-placeholder);
}

/* 右侧详情 */
.exec-detail-panel {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.exec-detail-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--td-border-level-1-color);
    flex-shrink: 0;
}

.detail-time {
    font-size: 14px;
    font-weight: 500;
}

.detail-duration {
    font-size: 12px;
    color: var(--td-text-color-secondary);
}

/* 执行中区域 */
.exec-running-section {
    .running-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--td-brand-color);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 16px;
    }
}

/* 思考中占位卡（白屏修复） */
.thinking-dots {
    display: inline-flex;
    gap: 4px;
    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--td-brand-color);
        animation: dotBounce 1.4s infinite ease-in-out both;
        &:nth-child(1) {
            animation-delay: -0.32s;
        }
        &:nth-child(2) {
            animation-delay: -0.16s;
        }
    }
}
@keyframes dotBounce {
    0%,
    80%,
    100% {
        transform: scale(0.6);
        opacity: 0.6;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}
.agent-thinking-placeholder {
    animation: fadeInUp 0.25s ease-out;
}
.thinking-card {
    position: relative;
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 10px;
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-component-stroke, var(--td-border-level-1-color));
    overflow: hidden;
}
.thinking-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        120deg,
        transparent 0%,
        rgba(7, 192, 95, 0.05) 40%,
        rgba(7, 192, 95, 0.08) 55%,
        transparent 85%
    );
    transform: translateX(-100%);
    animation: actionPendingShimmer 2.8s ease-in-out infinite;
    pointer-events: none;
}
.thinking-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--td-brand-color-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-brand-color);
    animation: pulse 2s infinite;
}
.thinking-content {
    flex: 1;
    min-width: 0;
}
.thinking-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--td-text-color-primary);
    margin-bottom: 8px;
}
.thinking-prompt-label {
    font-size: 11px;
    color: var(--td-text-color-placeholder);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.thinking-prompt-text {
    font-size: 13px;
    color: var(--td-text-color-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.05);
        opacity: 1;
    }
}
@keyframes actionPendingShimmer {
    0% {
        transform: translateX(-90%);
    }
    50% {
        transform: translateX(-5%);
    }
    100% {
        transform: translateX(90%);
    }
}
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 过程步骤 */
.process-section {
    margin-bottom: 16px;
}

.exec-detail-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.exec-error-box {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--td-error-color-1);
    color: var(--td-error-color);
}

.exec-error-box pre {
    margin: 0;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    flex: 1;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 40px;
    color: var(--td-text-color-secondary);
    font-size: 13px;
    height: 100%;
}

.waiting-card {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 10px;
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-component-stroke, var(--td-border-level-1-color));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    max-width: 560px;
    width: 100%;
}

.waiting-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--td-brand-color-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-brand-color);
}

.waiting-content {
    flex: 1;
    min-width: 0;
}

.waiting-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--td-text-color-primary);
    margin-bottom: 8px;
}

.waiting-prompt-label {
    font-size: 11px;
    color: var(--td-text-color-placeholder);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.waiting-prompt-text {
    font-size: 13px;
    color: var(--td-text-color-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 结果区域 */
.result-section {
    .result-toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
    }

    .document-results {
        margin-bottom: 16px;
    }
}

/* Markdown 内容样式（与对话界面一致） */
.ai-markdown-template {
    font-size: 15px;
    color: var(--td-text-color-primary);
    line-height: 1.7;
}

.markdown-content {
    :deep(p) {
        margin: 6px 0;
    }
    :deep(h1) {
        font-size: 1.5em;
        margin: 16px 0 8px;
    }
    :deep(h2) {
        font-size: 1.3em;
        margin: 14px 0 6px;
    }
    :deep(h3) {
        font-size: 1.15em;
        margin: 12px 0 4px;
    }
    :deep(ul),
    :deep(ol) {
        padding-left: 20px;
        margin: 6px 0;
    }
    :deep(code) {
        background: var(--td-bg-color-page);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
    }
    :deep(pre) {
        background: var(--td-bg-color-page);
        padding: 12px 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 8px 0;
    }
    :deep(pre code) {
        background: none;
        padding: 0;
    }
    :deep(blockquote) {
        border-left: 3px solid var(--td-brand-color-light);
        padding-left: 12px;
        margin: 8px 0;
        color: var(--td-text-color-secondary);
    }
    :deep(table) {
        border-collapse: collapse;
        width: 100%;
        margin: 8px 0;
    }
    :deep(th),
    :deep(td) {
        border: 1px solid var(--td-border-level-1-color);
        padding: 6px 12px;
        text-align: left;
    }
    :deep(th) {
        background: var(--td-bg-color-page);
    }
}
</style>
