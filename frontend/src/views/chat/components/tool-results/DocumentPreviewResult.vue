<template>
    <div class="document-preview-result">
        <div class="document-card" @click="handlePreview">
            <div class="card-glow" :class="fileTypeClass"></div>
            <div class="file-badge" :class="fileTypeClass">
                <span>{{ fileTypeAbbr }}</span>
            </div>
            <div class="document-info">
                <div class="document-name">{{ fileName }}</div>
                <div class="document-meta">
                    <span class="meta-type">{{ fileTypeLabel }}</span>
                    <span v-if="fileSize" class="meta-dot">·</span>
                    <span v-if="fileSize" class="meta-size">{{ formatFileSize(fileSize) }}</span>
                    <span class="meta-dot">·</span>
                    <span class="meta-status">
                        <span class="status-dot"></span>
                        {{ t('chat.documentGenerated') }}
                    </span>
                </div>
            </div>
            <div class="document-actions">
                <button class="action-btn action-preview" @click.stop="handlePreview" :title="t('common.preview')">
                    <BrowseIcon />
                </button>
                <button class="action-btn action-download" @click.stop="handleDownload" :title="t('common.download')">
                    <DownloadIcon />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getDown } from '@/utils/request';
import { BrowseIcon, DownloadIcon } from 'tdesign-icons-vue-next';
import { useUIStore } from '@/stores/ui';
import { inferFileType, getFileTypeClass, getFileTypeAbbr, getFileTypeLabel, formatFileSize } from '@/utils/document';

interface Props {
    toolData: {
        display_type: 'document_preview';
        file_type: string;
        file_name: string;
        file_url: string;
        preview_url?: string;
        file_size?: number;
    };
    output?: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const uiStore = useUIStore();

const fileType = computed(() => inferFileType(props.toolData.file_type, props.toolData.file_name));

const fileTypeClass = computed(() => `type-${getFileTypeClass(fileType.value)}`);
const fileTypeAbbr = computed(() => getFileTypeAbbr(fileType.value));
const fileName = computed(() => props.toolData.file_name || t('common.untitledDocument'));
const fileSize = computed(() => props.toolData.file_size);
const fileTypeLabel = computed(() => getFileTypeLabel(fileType.value) || t('common.document'));

// 豆包式：点击卡片直接打开右侧分栏预览面板（同时自动收起左侧菜单）
const handlePreview = () => {
    uiStore.openDocumentPreview({
        fileName: fileName.value,
        fileType: fileType.value,
        fileUrl: props.toolData.file_url,
        previewUrl: props.toolData.preview_url || props.toolData.file_url,
        fileSize: fileSize.value
    });
};

const handleDownload = async () => {
    try {
        const blob = (await getDown(props.toolData.file_url)) as unknown as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName.value;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
    }
};
</script>

<style scoped lang="scss">
.document-preview-result {
    width: 100%;
    margin: 8px 0;
}

.document-card {
    position: relative;
    display: flex;
    align-items: center;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    overflow: hidden;

    &:hover {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
    }
}

/* 品牌色光晕 */
.card-glow {
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.12;
    pointer-events: none;

    &.type-word {
        background: #2b579a;
    }
    &.type-excel {
        background: #217346;
    }
    &.type-ppt {
        background: #d24726;
    }
    &.type-pdf {
        background: #ff4d4f;
    }
    &.type-html {
        background: #e44d26;
    }
    &.type-default {
        background: #8c8c8c;
    }
}

/* 文件类型徽章 */
.file-badge {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    margin-right: 14px;
    z-index: 1;

    &.type-word {
        background: linear-gradient(135deg, #2b579a, #1e3f6f);
        box-shadow: 0 2px 6px rgba(43, 87, 154, 0.3);
    }
    &.type-excel {
        background: linear-gradient(135deg, #217346, #155430);
        box-shadow: 0 2px 6px rgba(33, 115, 70, 0.3);
    }
    &.type-ppt {
        background: linear-gradient(135deg, #d24726, #b03818);
        box-shadow: 0 2px 6px rgba(210, 71, 38, 0.3);
    }
    &.type-pdf {
        background: linear-gradient(135deg, #ff4d4f, #cf1322);
        box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
    }
    &.type-html {
        background: linear-gradient(135deg, #e44d26, #f16529);
        box-shadow: 0 2px 6px rgba(228, 77, 38, 0.3);
    }
    &.type-default {
        background: linear-gradient(135deg, #8c8c8c, #595959);
        box-shadow: 0 2px 6px rgba(140, 140, 140, 0.3);
    }
}

.document-info {
    flex: 1;
    min-width: 0;
    z-index: 1;
}

.document-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.document-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #999;
}

.meta-dot {
    opacity: 0.5;
}

.meta-status {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #52c41a;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #52c41a;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.document-actions {
    display: flex;
    gap: 4px;
    margin-left: 12px;
    z-index: 1;
}

.action-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.2s;
    color: #666;
    font-size: 16px;

    &:hover {
        background: rgba(0, 0, 0, 0.08);
        color: #1a1a1a;
    }

    &.action-preview:hover {
        background: rgba(24, 144, 255, 0.12);
        color: #1890ff;
    }

    &.action-download:hover {
        background: rgba(82, 196, 26, 0.12);
        color: #52c41a;
    }
}
</style>
