<template>
    <div class="process-steps">
        <div class="tree-container">
            <!-- 树根：折叠态摘要头 -->
            <div class="tree-root" @click="toggleAllSteps">
                <div class="tree-root-title">
                    <t-icon name="tools" size="14px" />
                    <span><strong>{{ steps.length }}</strong> {{ $t('scheduledTask.stepUnit') }}</span>
                </div>
                <div class="tree-root-toggle">
                    <t-icon :name="allExpanded ? 'chevron-up' : 'chevron-down'" />
                </div>
            </div>

            <!-- 树子：action 卡片 -->
            <transition name="expand">
                <div v-if="allExpanded" class="tree-children">
                    <template v-for="(item, idx) in mergedSteps" :key="idx">
                        <div
                            class="tree-child"
                            :class="{ 'tree-child-last': idx === mergedSteps.length - 1 }"
                        >
                            <div class="tree-branch"></div>
                            <div class="tree-child-content">
                                <!-- 合并工具组（连续同工具调用 ≥2 次） -->
                                <div v-if="item.kind === 'group'" class="tool-event">
                                    <div class="action-card">
                                        <div class="action-header" @click="toggleStep(idx)">
                                            <div class="action-title">
                                                <t-icon name="tools" class="action-title-icon" size="14px" />
                                                <span class="action-name">{{ item.toolName }}</span>
                                                <span class="action-badge">
                                                    {{ item.steps.length }} {{ $t('scheduledTask.stepUnit') }}
                                                </span>
                                                <span class="action-summary">{{ summarizeGroup(item) }}</span>
                                            </div>
                                            <div class="action-show-icon">
                                                <t-icon :name="expandedSteps.has(idx) ? 'chevron-up' : 'chevron-down'" />
                                            </div>
                                        </div>
                                        <div v-if="expandedSteps.has(idx)" class="action-details">
                                            <div
                                                v-for="(s, si) in item.steps"
                                                :key="si"
                                                class="merged-step"
                                            >
                                                <div class="merged-step-header">
                                                    <t-icon :name="stepIcon(s.type)" size="12px" />
                                                    <span class="merged-step-label">{{ stepLabel(s.type) }}</span>
                                                    <span class="merged-step-time">{{ formatStepTime(s.timestamp) }}</span>
                                                </div>
                                                <span v-if="s.data?.display_type === 'document_preview'" class="doc-hint">
                                                    {{ s.data?.file_name || t('chat.documentGenerated') }}
                                                </span>
                                                <pre v-else-if="s.content" class="tool-output">{{ s.content }}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 单步 action 卡片 -->
                                <div v-else class="tool-event">
                                    <div
                                        class="action-card"
                                        :class="{
                                            'action-pending': isStepPending(item.step),
                                            'action-error':
                                                item.step.type === 'tool_result' && item.step.success === false
                                        }"
                                    >
                                        <div class="action-header" @click="toggleStep(idx)">
                                            <div class="action-title">
                                                <t-icon
                                                    :name="stepIcon(item.step.type)"
                                                    class="action-title-icon"
                                                    size="14px"
                                                />
                                                <span class="action-name">{{ stepLabel(item.step.type) }}</span>
                                                <span v-if="item.step.tool_name" class="action-badge">
                                                    {{ item.step.tool_name }}
                                                </span>
                                                <span v-if="stepSummary(item.step)" class="action-summary">
                                                    {{ stepSummary(item.step) }}
                                                </span>
                                            </div>
                                            <div v-if="hasDetails(item.step)" class="action-show-icon">
                                                <t-icon :name="expandedSteps.has(idx) ? 'chevron-up' : 'chevron-down'" />
                                            </div>
                                        </div>
                                        <div
                                            v-if="hasDetails(item.step) && expandedSteps.has(idx)"
                                            class="action-details"
                                        >
                                            <div
                                                v-if="item.step.type === 'thought'"
                                                class="thinking-detail-content markdown-content"
                                                v-html="renderMarkdown(item.step.content)"
                                            ></div>
                                            <pre v-else-if="item.step.content" class="tool-output">
{{ truncateResult(item.step.content, idx) }}</pre>
                                            <div
                                                v-else-if="item.step.type === 'reference' && Array.isArray(item.step.data)"
                                                class="reference-list"
                                            >
                                                <div
                                                    v-for="(ref, ri) in item.step.data"
                                                    :key="ri"
                                                    class="reference-item"
                                                >
                                                    <t-icon name="link" size="12px" />
                                                    <span>{{ ref.title || ref.knowledge_name || ref.source || '' }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import { sanitizeHTML, safeMarkdownToHTML } from '@/utils/security';
import type { TaskProcessStep } from '@/api/scheduled-task';

marked.use({ breaks: true });
marked.use(markedKatex({ throwOnError: false, nonStandard: true }));

const props = defineProps<{ steps: TaskProcessStep[] }>();
const { t } = useI18n();

const truncateLimit = 500;
// 步骤 ≤3 时默认展开；>3 时折叠为树根，避免大列表占用过多空间
const allExpanded = ref(props.steps.length <= 3);
const expandedSteps = ref<Set<number>>(new Set());

type MergedItem =
    | { kind: 'single'; step: TaskProcessStep }
    | { kind: 'group'; toolName: string; steps: TaskProcessStep[] };

/**
 * 合并连续同工具的 tool_call + tool_result 对。
 * 仅当某工具连续被调用 ≥2 次时才合并为 group（避免单次调用被错误合并），
 * 与对话页 AgentStreamDisplay 的 tool group 行为一致。
 */
const mergedSteps = computed<MergedItem[]>(() => {
    const result: MergedItem[] = [];
    let i = 0;
    while (i < props.steps.length) {
        const step = props.steps[i];
        if (step.type === 'tool_call' && step.tool_name) {
            const toolName = step.tool_name;
            const group: TaskProcessStep[] = [step];
            let j = i + 1;
            while (j < props.steps.length) {
                const next = props.steps[j];
                if (
                    (next.type === 'tool_call' || next.type === 'tool_result') &&
                    next.tool_name === toolName
                ) {
                    group.push(next);
                    j++;
                } else {
                    break;
                }
            }
            // 仅当有 ≥2 次 tool_call 时才合并（单次调用保持独立 single）
            if (group.filter((s) => s.type === 'tool_call').length >= 2) {
                result.push({ kind: 'group', toolName, steps: group });
                i = j;
                continue;
            }
        }
        result.push({ kind: 'single', step });
        i++;
    }
    return result;
});

function stepIcon(type: string): string {
    const map: Record<string, string> = {
        thought: 'bulb',
        tool_call: 'tools',
        tool_result: 'check-circle',
        reference: 'link',
    };
    return map[type] || 'info-circle';
}

function stepLabel(type: string): string {
    const map: Record<string, string> = {
        thought: t('scheduledTask.stepThought'),
        tool_call: t('scheduledTask.stepToolCall'),
        tool_result: t('scheduledTask.stepToolResult'),
        reference: t('scheduledTask.stepReference'),
    };
    return map[type] || type;
}

/** 步骤摘要（折叠时显示在 action-header 中） */
function stepSummary(step: TaskProcessStep): string {
    if (step.type === 'thought' && step.content) {
        const s = step.content.replace(/\s+/g, ' ').slice(0, 60);
        return s + (step.content.length > 60 ? '…' : '');
    }
    if (step.type === 'tool_call' && step.hint) return step.hint;
    if (step.type === 'tool_result') {
        if (step.data?.display_type === 'document_preview') {
            return step.data?.file_name || t('chat.documentGenerated');
        }
        if (step.content) {
            const s = step.content.replace(/\s+/g, ' ').slice(0, 60);
            return s + (step.content.length > 60 ? '…' : '');
        }
    }
    if (step.type === 'reference' && Array.isArray(step.data)) {
        return `${step.data.length} ${t('scheduledTask.stepReference')}`;
    }
    return '';
}

/** 工具组合并后的摘要：成功率 */
function summarizeGroup(item: Extract<MergedItem, { kind: 'group' }>): string {
    const results = item.steps.filter((s) => s.type === 'tool_result');
    if (results.length === 0) return '';
    const okCount = results.filter((s) => s.success).length;
    return `${okCount}/${results.length} OK`;
}

function hasDetails(step: TaskProcessStep): boolean {
    return (
        !!step.content ||
        (step.type === 'reference' && Array.isArray(step.data) && step.data.length > 0)
    );
}

/** 判断工具调用是否仍在进行中（无后续 tool_result） */
function isStepPending(step: TaskProcessStep): boolean {
    if (step.type === 'tool_call') {
        const idx = props.steps.indexOf(step);
        const next = props.steps[idx + 1];
        return !next || next.type !== 'tool_result' || next.tool_name !== step.tool_name;
    }
    return false;
}

function formatStepTime(ts: number): string {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString();
}

function toggleAllSteps() {
    allExpanded.value = !allExpanded.value;
    if (allExpanded.value) {
        // 展开树根时同步展开所有步骤
        expandedSteps.value = new Set(mergedSteps.value.map((_, idx) => idx));
    }
}

function toggleStep(idx: number) {
    if (expandedSteps.value.has(idx)) {
        expandedSteps.value.delete(idx);
    } else {
        expandedSteps.value.add(idx);
    }
}

function truncateResult(text: string, idx: number): string {
    if (text.length <= truncateLimit || expandedSteps.value.has(idx)) return text;
    return text.substring(0, truncateLimit) + '...';
}

/** 渲染思考步骤的 Markdown 内容（与对话页保持一致） */
function renderMarkdown(content: string): string {
    if (!content) return '';
    const safeText = safeMarkdownToHTML(content);
    const html = marked.parse(safeText, { breaks: true });
    return sanitizeHTML(typeof html === 'string' ? html : '');
}
</script>

<style lang="less" scoped>
@import '@/components/css/markdown.less';

.process-steps {
    display: flex;
    flex-direction: column;
}

// ============ Tree View（借鉴 AgentStreamDisplay.vue） ============
.tree-container {
    margin-bottom: 10px;
    position: relative;
}

.tree-root {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    background-color: var(--td-bg-color-container);
    border: 0.5px solid var(--td-component-stroke);
    box-shadow: 0 2px 4px rgba(7, 192, 95, 0.08);
    color: var(--td-text-color-primary);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        background-color: rgba(7, 192, 95, 0.04);
    }
}

.tree-root-title {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
        white-space: nowrap;
        font-size: 12px;

        :deep(strong) {
            color: var(--td-brand-color);
            font-weight: 600;
        }
    }
}

.tree-root-toggle {
    font-size: 13px;
    padding: 0 2px 1px 2px;
    color: var(--td-brand-color);
}

.tree-children {
    position: relative;
    padding-left: 12px;
    margin-top: 6px;
    max-height: 600px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: var(--td-bg-color-component-disabled);
        border-radius: 2px;
        &:hover {
            background: var(--td-text-color-placeholder);
        }
    }
}

.tree-child {
    position: relative;
    padding-left: 20px;
    padding-bottom: 0;
    margin-bottom: 6px;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: -6px;
        width: 0;
        border-left: 1px dashed var(--td-component-stroke);
    }

    .tree-branch {
        position: absolute;
        left: 0;
        top: 15px;
        width: 16px;
        height: 0;
        border-top: 1px dashed var(--td-component-stroke);
    }

    &.tree-child-last {
        margin-bottom: 0;
        &::before {
            bottom: auto;
            height: 16px;
        }
    }
}

// ============ Tool Event / Action Card ============
.tool-event {
    animation: fadeInUp 0.25s ease-out;
}

.action-card {
    background: var(--td-bg-color-container);
    border-radius: 5px;
    border: 1px solid var(--td-component-stroke);
    overflow: hidden;
    position: relative;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

    > * {
        position: relative;
        z-index: 1;
    }

    &:hover {
        border-color: var(--td-brand-color);
        box-shadow: 0 1px 4px rgba(7, 192, 95, 0.08);
    }

    &.action-error {
        border-left: 2px solid var(--td-error-color);
    }

    &.action-pending {
        opacity: 1;
        box-shadow: none;
        border-color: rgba(7, 192, 95, 0.15);
        background: linear-gradient(120deg, rgba(7, 192, 95, 0.01), var(--td-bg-color-container));

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                120deg,
                transparent 0%,
                rgba(7, 192, 95, 0.06) 40%,
                rgba(7, 192, 95, 0.08) 55%,
                transparent 85%
            );
            transform: translateX(-100%);
            animation: actionPendingShimmer 2.8s ease-in-out infinite;
            pointer-events: none;
            z-index: 0;
        }
    }
}

.action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    color: var(--td-text-color-primary);
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;

    &:hover {
        background-color: rgba(7, 192, 95, 0.03);
    }
}

.action-title {
    display: flex;
    align-items: center;
    gap: 7px;
    flex: 1;
    min-width: 0;

    .action-title-icon {
        width: 14px;
        height: 14px;
        color: var(--td-brand-color);
        flex-shrink: 0;
    }

    .action-name {
        white-space: nowrap;
        font-size: 12px;
    }

    .action-badge {
        display: inline-flex;
        align-items: center;
        padding: 0 6px;
        height: 18px;
        border-radius: 9px;
        background: rgba(7, 192, 95, 0.1);
        color: var(--td-brand-color);
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .action-summary {
        color: var(--td-text-color-placeholder);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-shrink: 1;
    }
}

.action-show-icon {
    font-size: 12px;
    color: var(--td-text-color-placeholder);
    padding: 0 2px;
}

.action-details {
    border-top: 1px solid var(--td-component-stroke);
    animation: slideIn 0.2s ease-out;
}

// ============ 思考步骤 Markdown 内容 ============
.thinking-detail-content {
    padding: 8px 14px;
    font-size: 13px;
    color: var(--td-text-color-primary);
    line-height: 1.6;
    max-height: 240px;
    overflow-y: auto;

    :deep(p) { margin: 6px 0; }
    :deep(h1) { font-size: 1.3em; margin: 12px 0 6px; }
    :deep(h2) { font-size: 1.15em; margin: 10px 0 4px; }
    :deep(h3) { font-size: 1.05em; margin: 8px 0 4px; }
    :deep(ul), :deep(ol) { padding-left: 20px; margin: 6px 0; }
    :deep(code) {
        background: var(--td-bg-color-page);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
    }
    :deep(pre) {
        background: var(--td-bg-color-page);
        padding: 10px 14px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 6px 0;
    }
    :deep(pre code) { background: none; padding: 0; }
    :deep(blockquote) {
        border-left: 3px solid var(--td-brand-color-light);
        padding-left: 12px;
        margin: 6px 0;
        color: var(--td-text-color-secondary);
    }
    :deep(table) {
        border-collapse: collapse;
        width: 100%;
        margin: 6px 0;
    }
    :deep(th), :deep(td) {
        border: 1px solid var(--td-border-level-1-color);
        padding: 4px 10px;
        text-align: left;
    }
    :deep(th) { background: var(--td-bg-color-page); }
}

// ============ 工具输出（pre） ============
.tool-output {
    background: var(--td-bg-color-page);
    padding: 10px 14px;
    border-radius: 0;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
    max-height: 240px;
    overflow-y: auto;
    font-family: 'SFMono-Regular', Consolas, 'Courier New', monospace;
    color: var(--td-text-color-primary);
}

// ============ 合并步骤（group 内部） ============
.merged-step {
    padding: 8px 14px;
    border-bottom: 1px solid var(--td-border-level-1-color);

    &:last-child {
        border-bottom: none;
    }
}

.merged-step-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    font-size: 11px;
    color: var(--td-text-color-secondary);
}

.merged-step-label {
    font-weight: 500;
}

.merged-step-time {
    margin-left: auto;
    color: var(--td-text-color-placeholder);
}

// ============ 引用列表 ============
.reference-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 14px;
}

.reference-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--td-text-color-secondary);
}

.doc-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    font-size: 12px;
    color: var(--td-text-color-secondary);
}

// ============ 树展开过渡 ============
.expand-enter-active,
.expand-leave-active {
    transition: max-height 0.3s ease, opacity 0.25s ease;
    overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
    max-height: 2000px;
    opacity: 1;
}

// ============ 动画关键帧（与 AgentStreamDisplay.vue 一致） ============
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { opacity: 0; transform: translateX(-6px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes actionPendingShimmer {
    0% { transform: translateX(-90%); }
    50% { transform: translateX(-5%); }
    100% { transform: translateX(90%); }
}
</style>
