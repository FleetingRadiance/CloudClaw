<template>
    <div class="skill-upload-page">
        <!-- Top bar -->
        <div class="su-topbar">
            <button class="su-back" :disabled="uploading" @click="goBack">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                返回技能列表
            </button>
        </div>

        <!-- Upload card (no dialog / no gray mask) -->
        <div class="upload-dialog">
            <!-- Header -->
            <div class="d-head">
                <div class="d-head-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M3.3 7L12 12l8.7-5M12 22V12"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <div class="d-head-text">
                    <h3>{{ $t('skill.uploadSkill') }}</h3>
                    <p>支持 .zip 格式 · 单文件 · 最大 20MB</p>
                </div>
                <span class="d-head-step">步骤 1 / 2</span>
                <button class="d-head-close" :disabled="uploading" @click="goBack" aria-label="close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="d-body">
                <!-- Left: file picker -->
                <div class="col">
                    <div class="section-label"><span class="dot"></span>选择文件</div>

                    <t-upload
                        v-model="uploadFiles"
                        :auto-upload="false"
                        :multiple="false"
                        :max="1"
                        :size-limit="{ size: 20, unit: 'MB' }"
                        accept=".zip"
                        theme="custom"
                        @validate="handleUploadValidate"
                        class="upload-trigger"
                    >
                        <template #default>
                            <div
                                class="dropzone"
                                :class="{ dragging: isDragging }"
                                @mousemove="onDropzoneMove"
                                @dragover.prevent="isDragging = true"
                                @dragleave="isDragging = false"
                                @drop.prevent="onDropzoneDrop"
                            >
                                <div class="dropzone-illust">
                                    <div class="blob"></div>
                                    <div class="icon">
                                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
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
                                    </div>
                                    <div class="badge">ZIP</div>
                                </div>
                                <div>
                                    <div class="dropzone-title">拖拽文件到此处</div>
                                    <div class="dropzone-sub">或点击下方按钮选择 .zip 技能包，目录结构请遵循右侧说明</div>
                                </div>
                                <span class="dropzone-cta">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                    </svg>
                                    选择文件
                                </span>
                                <div class="dropzone-hints">
                                    <span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="2" />
                                            <path d="M3 9h18M9 3v18" stroke="currentColor" stroke-width="2" />
                                        </svg>
                                        1 个文件
                                    </span>
                                    <span>·</span>
                                    <span>≤ 20 MB</span>
                                    <span>·</span>
                                    <span>.zip</span>
                                </div>
                            </div>
                        </template>
                        <template #file-list-display>
                            <div></div>
                        </template>
                    </t-upload>

                    <div v-if="uploadFiles.length > 0" class="file-card">
                        <div class="file-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linejoin="round"
                                />
                                <path d="M14 3v6h6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="file-body">
                            <div class="file-name-row">
                                <span class="file-name">{{ uploadFiles[0].name }}</span>
                                <span class="file-pct" v-if="uploading">{{ uploadPercent }}%</span>
                            </div>
                            <div class="file-bar" v-if="uploading">
                                <i :style="{ width: uploadPercent + '%' }"></i>
                            </div>
                            <div class="file-meta">
                                <span>{{ formatFileSize(uploadFiles[0].size) }}</span>
                                <span v-if="uploading" class="status">上传中</span>
                                <span v-else-if="uploadError">· {{ uploadError }}</span>
                                <span v-else>· 准备上传</span>
                            </div>
                        </div>
                        <button v-if="!uploading" class="file-remove" :title="$t('common.cancel')" @click="removeFile(uploadFiles[0])">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div class="tip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;margin-top:1px;">
                            <circle cx="12" cy="12" r="9" stroke="#d97706" stroke-width="1.8" />
                            <path d="M12 8v5M12 16h.01" stroke="#d97706" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <div>
                            <strong>小贴士：</strong>技能包需要包含 <code>SKILL.md</code> 描述文件，其他目录可选。下载示例包可参考右侧结构。
                        </div>
                    </div>
                </div>

                <!-- Right: spec & structure -->
                <div class="col">
                    <div class="section-label"><span class="dot"></span>格式规范</div>

                    <div class="specs">
                        <div class="spec">
                            <div class="spec-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                        stroke-linejoin="round"
                                    />
                                    <path d="M14 3v6h6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div class="spec-body">
                                <div class="spec-title">SKILL.md <span class="pill req">必需</span></div>
                                <div class="spec-desc">技能描述与用法说明文件</div>
                            </div>
                        </div>
                        <div class="spec">
                            <div class="spec-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.7" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.7" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.7" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.7" />
                                </svg>
                            </div>
                            <div class="spec-body">
                                <div class="spec-title">scripts/ <span class="pill opt">可选</span></div>
                                <div class="spec-desc">可执行脚本目录</div>
                            </div>
                        </div>
                        <div class="spec">
                            <div class="spec-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M4 4h12l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                        stroke-linejoin="round"
                                    />
                                    <path d="M16 4v4h4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div class="spec-body">
                                <div class="spec-title">references/ <span class="pill opt">可选</span></div>
                                <div class="spec-desc">参考文档与资料</div>
                            </div>
                        </div>
                        <div class="spec">
                            <div class="spec-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                            <div class="spec-body">
                                <div class="spec-title">requirements.txt <span class="pill opt">可选</span></div>
                                <div class="spec-desc">Python 依赖声明</div>
                            </div>
                        </div>
                    </div>

                    <div class="tree-card">
                        <div class="tree-head">
                            <h4>📦 目录结构示例</h4>
                            <button class="dl-btn" @click="downloadDemo">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 4v12M6 12l6 6 6-6M4 20h16"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                下载示例
                            </button>
                        </div>
                        <div class="tree">
                            <ul>
                                <li>
                                    <span class="file-ic">📄</span>
                                    <strong>my-skill.zip</strong>
                                </li>
                                <li>
                                    <span class="indent"></span>
                                    <span class="file-ic">📄</span>
                                    SKILL.md
                                    <span class="req-tag">REQ</span>
                                </li>
                                <li>
                                    <span class="indent"></span>
                                    <span class="dir-ic">📁</span>
                                    scripts/
                                </li>
                                <li>
                                    <span class="indent" style="width: 36px"></span>
                                    <span class="file-ic">🐍</span>
                                    main.py
                                </li>
                                <li>
                                    <span class="indent"></span>
                                    <span class="dir-ic">📁</span>
                                    references/
                                    <span class="opt-tag">OPT</span>
                                </li>
                                <li>
                                    <span class="indent"></span>
                                    <span class="file-ic">📄</span>
                                    requirements.txt
                                    <span class="opt-tag">OPT</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="d-foot">
                <div class="foot-left">按 <kbd>Enter</kbd> 上传 · <kbd>Esc</kbd> 返回</div>
                <div class="foot-right">
                    <button class="btn btn-ghost" :disabled="uploading" @click="goBack">
                        {{ $t('common.cancel') }}
                    </button>
                    <button class="btn btn-primary" :disabled="uploading || uploadFiles.length === 0" @click="handleUpload">
                        <t-loading v-if="uploading" size="small" />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 16V4M6 10l6-6 6 6"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        开始上传
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { uploadSkillZip } from '@/api/skill';

const { t } = useI18n();
const router = useRouter();

const uploading = ref(false);
const uploadPercent = ref(0);
const uploadFiles = ref<any[]>([]);
const uploadError = ref('');
const isDragging = ref(false);

function goBack() {
    if (uploading.value) return;
    router.push({ name: 'skillList' });
}

async function handleUpload() {
    if (uploadFiles.value.length === 0) {
        uploadError.value = t('skill.noFilesSelected');
        return;
    }

    const file = uploadFiles.value[0];
    const rawFile = file.raw || file;

    if (!rawFile.name.endsWith('.zip')) {
        uploadError.value = t('skill.zipFileRequired');
        return;
    }

    uploading.value = true;
    uploadError.value = '';
    uploadPercent.value = 0;
    try {
        const res = (await uploadSkillZip(rawFile, (e: any) => {
            if (e?.total) {
                uploadPercent.value = Math.round((e.loaded / e.total) * 100);
            }
        })) as any;
        if (res?.success) {
            uploadPercent.value = 100;
            MessagePlugin.success(t('skill.uploadSuccess'));
            resetUploadState();
            router.push({ name: 'skillList' });
        } else {
            uploadError.value = res?.message || t('skill.uploadFailed');
        }
    } catch (e: any) {
        const msg = e?.response?.data?.message || e?.message || t('skill.uploadFailed');
        uploadError.value = msg;
    } finally {
        uploading.value = false;
    }
}

function handleUploadValidate(params: any) {
    const { type } = params;
    if (type === 'FILE_OVER_SIZE_LIMIT') {
        uploadError.value = t('skill.fileTooLarge', { size: 20 });
    } else if (type === 'FILES_OVER_LENGTH_LIMIT') {
        uploadError.value = t('skill.tooManyFiles', { count: 1 });
    }
}

function removeFile(file: any) {
    const idx = uploadFiles.value.findIndex((f) => f.name === file.name);
    if (idx >= 0) {
        uploadFiles.value.splice(idx, 1);
    }
    uploadError.value = '';
}

function resetUploadState() {
    uploadFiles.value = [];
    uploadError.value = '';
    uploadPercent.value = 0;
    uploading.value = false;
    isDragging.value = false;
}

function onDropzoneMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
}

function onDropzoneDrop(e: DragEvent) {
    isDragging.value = false;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
        const dt = new DataTransfer();
        dt.items.add(files[0]);
        const input = document.querySelector('.skill-upload-page input[type="file"]') as HTMLInputElement | null;
        if (input) {
            input.files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

function downloadDemo() {
    const a = document.createElement('a');
    a.href = '/demo-skill.zip';
    a.download = 'demo-skill.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        goBack();
    } else if (e.key === 'Enter' && !uploading.value && uploadFiles.value.length > 0) {
        e.preventDefault();
        handleUpload();
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.skill-upload-page {
    --brand-50: #ecfdf5;
    --brand-100: #d1fae5;
    --brand-200: #a7f3d0;
    --brand-300: #6ee7b7;
    --brand-400: #34d399;
    --brand-500: #10b981;
    --brand-600: #059669;
    --brand-700: #047857;

    --ink-900: #0f172a;
    --ink-800: #1e293b;
    --ink-700: #334155;
    --ink-600: #475569;
    --ink-500: #64748b;
    --ink-400: #94a3b8;
    --ink-300: #cbd5e1;
    --ink-200: #e2e8f0;
    --ink-100: #f1f5f9;
    --ink-50: #f8fafc;

    --border-soft: rgba(15, 23, 42, 0.06);
    --border: rgba(15, 23, 42, 0.1);
    --border-strong: rgba(15, 23, 42, 0.16);

    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06);
    --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.04);
    --shadow-lg: 0 24px 60px rgba(15, 23, 42, 0.18), 0 8px 20px rgba(15, 23, 42, 0.08);
    --shadow-brand: 0 8px 24px rgba(16, 185, 129, 0.18);

    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 16px;
    --r-xl: 20px;
    --r-2xl: 24px;

    --ease: cubic-bezier(0.4, 0, 0.2, 1);

    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 16px 24px 24px;
    box-sizing: border-box;
    overflow: hidden;
}

/* ============ Top bar ============ */
.su-topbar {
    width: 100%;
    max-width: 960px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.su-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-600);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 8px 14px;
    cursor: pointer;
    transition: all 0.2s var(--ease);
}

.su-back:hover:not(:disabled) {
    color: var(--ink-900);
    background: #fff;
    box-shadow: var(--shadow-sm);
}

.su-back:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ============ Card ============ */
.upload-dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 960px;
    flex: 1;
    min-height: 0;
    border-radius: var(--r-2xl);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(28px) saturate(140%);
    -webkit-backdrop-filter: blur(28px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.7);
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
    flex: 1;
    min-height: 0;
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
</style>
