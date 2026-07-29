<template>
    <transition name="panel-slide">
        <div v-if="uiStore.documentPreviewVisible && uiStore.documentPreviewData" class="doc-preview-panel">
            <!-- 顶部栏：文件信息 + 操作按钮 -->
            <header class="panel-header">
                <div class="header-left">
                    <div class="file-badge" :class="fileTypeClass">
                        <span>{{ fileTypeAbbr }}</span>
                    </div>
                    <div class="header-info">
                        <div class="header-filename" :title="fileName">{{ fileName }}</div>
                        <div class="header-meta">
                            <span class="meta-type">{{ fileTypeLabel }}</span>
                            <span v-if="fileSize" class="meta-dot">·</span>
                            <span v-if="fileSize" class="meta-size">{{ formatFileSize(fileSize) }}</span>
                        </div>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" @click="handleDownload" :title="t('common.download')">
                        <DownloadIcon />
                    </button>
                    <button class="icon-btn close-btn" @click="handleClose" :title="t('common.close')">
                        <CloseIcon />
                    </button>
                </div>
            </header>

            <!-- 内容区域 -->
            <div class="panel-body">
                <!-- 加载骨架屏 -->
                <div v-if="loading" class="state-container">
                    <div class="skeleton-lines">
                        <div v-for="n in 8" :key="n" class="skeleton-line" :style="{ width: skeletonWidth(n) }"></div>
                    </div>
                </div>

                <!-- 错误 -->
                <div v-else-if="error" class="state-container state-error">
                    <ErrorCircleFilledIcon class="state-icon" />
                    <p>{{ error }}</p>
                    <t-button theme="primary" variant="outline" @click="loadDocument">{{ t('common.retry') }}</t-button>
                </div>

                <!-- Word 预览 -->
                <div v-else-if="isWord && htmlContent" class="word-content" v-html="htmlContent"></div>

                <!-- Excel 预览 -->
                <div v-else-if="isExcel && excelSheets.length > 0" class="excel-content">
                    <div v-for="(sheet, idx) in excelSheets" :key="idx" class="excel-sheet">
                        <div v-if="excelSheets.length > 1" class="sheet-tab">{{ sheet.name }}</div>
                        <table class="excel-table">
                            <thead>
                                <tr>
                                    <th v-for="(h, hi) in sheet.headers" :key="hi">{{ h }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, ri) in sheet.rows" :key="ri">
                                    <td v-for="(c, ci) in row" :key="ci">{{ c }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PDF 预览（iframe + Blob URL 绕过鉴权） -->
                <iframe v-else-if="isPdf && blobUrl" :src="blobUrl" class="pdf-iframe" frameborder="0"></iframe>

                <!-- HTML 预览（沙箱 iframe：允许脚本/弹窗/表单，禁用 same-origin 防止不可信 HTML 访问父窗口） -->
                <iframe
                    v-else-if="isHtml && htmlBlobUrl"
                    :src="htmlBlobUrl"
                    sandbox="allow-scripts allow-popups allow-forms allow-modals"
                    class="html-iframe"
                    frameborder="0"
                ></iframe>

                <!-- 不支持的类型 -->
                <div v-else class="state-container state-unsupported">
                    <FileIcon class="state-icon" />
                    <p>{{ t('chat.previewUnsupported') }}</p>
                    <t-button theme="primary" @click="handleDownload">
                        <template #icon><DownloadIcon /></template>
                        {{ t('common.download') }}
                    </t-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { DownloadIcon, CloseIcon, ErrorCircleFilledIcon, FileIcon } from 'tdesign-icons-vue-next';
import { getDown } from '@/utils/request';
import { useUIStore } from '@/stores/ui';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { inferFileType, getFileTypeClass, getFileTypeAbbr, getFileTypeLabel, formatFileSize } from '@/utils/document';

const { t } = useI18n();
const uiStore = useUIStore();

const loading = ref(false);
const error = ref('');
const htmlContent = ref('');
const excelSheets = ref<any[]>([]);
const blobUrl = ref('');
const htmlBlobUrl = ref('');

const previewData = computed(() => uiStore.documentPreviewData);

const fileName = computed(() => previewData.value?.fileName || '');
const fileType = computed(() => inferFileType(previewData.value?.fileType, previewData.value?.fileName));
const fileSize = computed(() => previewData.value?.fileSize);
const fileUrl = computed(() => previewData.value?.fileUrl || '');
const previewUrl = computed(() => previewData.value?.previewUrl || fileUrl.value);

const isWord = computed(() => ['docx', 'doc'].includes(fileType.value));
const isExcel = computed(() => ['xlsx', 'xls'].includes(fileType.value));
const isPdf = computed(() => fileType.value === 'pdf');
const isHtml = computed(() => ['html', 'htm'].includes(fileType.value));

const fileTypeClass = computed(() => `badge-${getFileTypeClass(fileType.value)}`);
const fileTypeAbbr = computed(() => getFileTypeAbbr(fileType.value));
const fileTypeLabel = computed(() => getFileTypeLabel(fileType.value) || t('common.document'));

const skeletonWidth = (n: number): string => {
    const widths = ['90%', '70%', '100%', '85%', '60%', '95%', '75%', '50%'];
    return widths[(n - 1) % widths.length];
};

// 加载文档内容
// 使用递增 requestId 防止竞态条件：快速切换文件时，旧请求的结果不会覆盖新请求的结果
let loadRequestId = 0;

const loadDocument = async () => {
    if (!previewUrl.value) {
        error.value = t('chat.previewLoadFailed');
        return;
    }

    const currentRequestId = ++loadRequestId;

    // PDF：下载为 Blob，创建 object URL 供 iframe 使用（绕过鉴权限制）
    if (isPdf.value) {
        loading.value = true;
        error.value = '';
        try {
            const blob = (await getDown(previewUrl.value)) as unknown as Blob;
            if (currentRequestId !== loadRequestId) return; // 过时请求，丢弃
            if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
            blobUrl.value = URL.createObjectURL(blob);
        } catch (err: any) {
            if (currentRequestId !== loadRequestId) return;
            error.value = err?.message || t('chat.previewLoadFailed');
        } finally {
            if (currentRequestId === loadRequestId) loading.value = false;
        }
        return;
    }

    // HTML：下载为 Blob，创建 object URL 供沙箱 iframe 使用
    // （与 PDF 同构，避免签名 URL 直接暴露在 DOM 属性中；
    //  iframe sandbox 不含 allow-same-origin，HTML 内的脚本无法访问父窗口）
    if (isHtml.value) {
        loading.value = true;
        error.value = '';
        try {
            const blob = (await getDown(previewUrl.value)) as unknown as Blob;
            if (currentRequestId !== loadRequestId) return;
            if (htmlBlobUrl.value) URL.revokeObjectURL(htmlBlobUrl.value);
            htmlBlobUrl.value = URL.createObjectURL(blob);
        } catch (err: any) {
            if (currentRequestId !== loadRequestId) return;
            error.value = err?.message || t('chat.previewLoadFailed');
        } finally {
            if (currentRequestId === loadRequestId) loading.value = false;
        }
        return;
    }

    // Word / Excel：下载并解析
    if (!isWord.value && !isExcel.value) return; // 其他类型不加载

    loading.value = true;
    error.value = '';
    htmlContent.value = '';
    excelSheets.value = [];

    try {
        const blob = (await getDown(previewUrl.value)) as unknown as Blob;
        const arrayBuffer = await blob.arrayBuffer();

        if (currentRequestId !== loadRequestId) return; // 过时请求，丢弃

        if (isWord.value) {
            const result = await mammoth.convertToHtml({ arrayBuffer });
            if (currentRequestId !== loadRequestId) return;
            htmlContent.value = result.value;
        } else if (isExcel.value) {
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheets: any[] = [];
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                // Use raw: false so formatted values (number formats, formula results)
                // are displayed exactly as they appear in Excel.
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
                if (jsonData.length > 0) {
                    sheets.push({
                        name: sheetName,
                        headers: jsonData[0] || [],
                        rows: jsonData.slice(1)
                    });
                }
            });
            if (currentRequestId !== loadRequestId) return;
            excelSheets.value = sheets;
        }
    } catch (err: any) {
        if (currentRequestId !== loadRequestId) return;
        error.value = err?.message || t('chat.previewLoadFailed');
    } finally {
        if (currentRequestId === loadRequestId) loading.value = false;
    }
};

const handleDownload = async () => {
    if (!fileUrl.value) return;
    try {
        const blob = (await getDown(fileUrl.value)) as unknown as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName.value;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Download failed:', err);
    }
};

const handleClose = () => {
    uiStore.closeDocumentPreview();
};

// 统一监听预览状态变化：打开/切换文件时加载，关闭时清理
// 合并 visible + previewUrl 为单个 watch，避免 openDocumentPreview
// 同时修改两个状态时触发两次 loadDocument（重复网络请求）
watch(
    () => [uiStore.documentPreviewVisible, uiStore.documentPreviewData?.previewUrl],
    ([visible, url]) => {
        if (visible && url) {
            loadDocument();
        } else if (!visible) {
            // 关闭预览：清理状态和 Blob URL，防止内存泄漏
            if (blobUrl.value) {
                URL.revokeObjectURL(blobUrl.value);
                blobUrl.value = '';
            }
            if (htmlBlobUrl.value) {
                URL.revokeObjectURL(htmlBlobUrl.value);
                htmlBlobUrl.value = '';
            }
            htmlContent.value = '';
            excelSheets.value = [];
            error.value = '';
            loading.value = false;
        }
    }
);

// 组件卸载时清理 Blob URL
onUnmounted(() => {
    if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
    if (htmlBlobUrl.value) URL.revokeObjectURL(htmlBlobUrl.value);
});
</script>

<style scoped lang="scss">
.doc-preview-panel {
    flex: 0 0 45%;
    max-width: 900px;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    background: var(--td-bg-color-container, #fff);
    border-left: 1px solid var(--td-border-level-1-color, rgba(0, 0, 0, 0.08));
    height: 100%;
    overflow: hidden;
}

/* 顶部栏 */
.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid var(--td-border-level-1-color, rgba(0, 0, 0, 0.06));
    flex-shrink: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
}

.file-badge {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    flex-shrink: 0;

    &.badge-word {
        background: linear-gradient(135deg, #2b579a, #1e3f6f);
    }
    &.badge-excel {
        background: linear-gradient(135deg, #217346, #155430);
    }
    &.badge-ppt {
        background: linear-gradient(135deg, #d24726, #b03818);
    }
    &.badge-pdf {
        background: linear-gradient(135deg, #ff4d4f, #cf1322);
    }
    &.badge-html {
        background: linear-gradient(135deg, #e44d26, #f16529);
    }
    &.badge-default {
        background: linear-gradient(135deg, #8c8c8c, #595959);
    }
}

.header-info {
    min-width: 0;
    flex: 1;
}

.header-filename {
    font-size: 14px;
    font-weight: 600;
    color: var(--td-text-color-primary, #1a1a1a);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.header-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--td-text-color-secondary, #999);
    margin-top: 2px;
}

.meta-dot {
    opacity: 0.5;
}

.header-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}

.icon-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--td-text-color-secondary, #666);
    font-size: 18px;

    &:hover {
        background: var(--td-bg-color-container-hover, rgba(0, 0, 0, 0.06));
        color: var(--td-text-color-primary, #1a1a1a);
    }

    &.close-btn:hover {
        background: rgba(255, 77, 79, 0.1);
        color: #ff4d4f;
    }
}

/* 内容区域 */
.panel-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
}

/* 状态容器（加载/错误/不支持） */
.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 300px;
    gap: 16px;
    color: var(--td-text-color-secondary, #999);

    .state-icon {
        font-size: 48px;
    }

    &.state-error .state-icon {
        color: #ff4d4f;
    }
}

/* 骨架屏 */
.skeleton-lines {
    width: 80%;
    max-width: 600px;
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.skeleton-line {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.06) 25%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.06) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Word 内容 */
.word-content {
    padding: 32px 40px;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.8;
    color: var(--td-text-color-primary, #1a1a1a);

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
        margin-top: 24px;
        margin-bottom: 12px;
        font-weight: 600;
    }

    :deep(h1) {
        font-size: 24px;
    }
    :deep(h2) {
        font-size: 20px;
    }
    :deep(h3) {
        font-size: 18px;
    }

    :deep(p) {
        margin: 12px 0;
    }

    :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
    }

    :deep(th),
    :deep(td) {
        border: 1px solid var(--td-border-level-2-color, #e8e8e8);
        padding: 8px 12px;
        text-align: left;
    }

    :deep(th) {
        background: var(--td-bg-color-secondarycontainer, #fafafa);
        font-weight: 600;
    }

    :deep(img) {
        max-width: 100%;
        height: auto;
    }

    :deep(blockquote) {
        border-left: 3px solid var(--td-brand-color, #1890ff);
        padding-left: 16px;
        margin: 16px 0;
        color: var(--td-text-color-secondary, #666);
    }

    :deep(code) {
        background: var(--td-bg-color-secondarycontainer, #f5f5f5);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 13px;
    }
}

/* Excel 内容 */
.excel-content {
    padding: 20px;
}

.excel-sheet {
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
}

.sheet-tab {
    display: inline-block;
    padding: 4px 12px;
    background: var(--td-brand-color, #1890ff);
    color: #fff;
    border-radius: 4px 4px 0 0;
    font-size: 13px;
    font-weight: 500;
}

.excel-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th,
    td {
        border: 1px solid var(--td-border-level-2-color, #e8e8e8);
        padding: 8px 10px;
        text-align: left;
        white-space: nowrap;
    }

    th {
        background: var(--td-bg-color-secondarycontainer, #fafafa);
        font-weight: 600;
        color: var(--td-text-color-primary, #1a1a1a);
        position: sticky;
        top: 0;
        z-index: 1;
    }

    tbody tr:hover {
        background: var(--td-bg-color-container-hover, #f5f5f5);
    }
}

/* PDF iframe */
.pdf-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

/* HTML iframe（沙箱渲染） */
.html-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    background: #fff;
}

/* 入场动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
