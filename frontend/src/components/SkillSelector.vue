<template>
    <div v-if="visible" class="skill-selector" :style="style" ref="menuRef" @click.stop>
        <div class="skill-selector-header">
            <span>{{ $t('chat.skillSelector.title') }}</span>
        </div>
        <div v-if="loading" class="skill-selector-loading">
            <t-loading size="small" />
        </div>
        <div v-else-if="skills.length === 0" class="skill-selector-empty">
            {{ $t('chat.skillSelector.empty') }}
        </div>
        <div v-else class="skill-selector-list">
            <div
                v-for="skill in skills"
                :key="skill.name"
                class="skill-item"
                :class="{ selected: isSelected(skill.name) }"
                @click="toggleSkill(skill.name)"
            >
                <div class="skill-item-check">
                    <svg v-if="isSelected(skill.name)" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect width="16" height="16" rx="3" fill="var(--td-brand-color)" />
                        <path
                            d="M4 8L7 11L12 5"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect
                            width="16"
                            height="16"
                            rx="3"
                            stroke="var(--td-border-level-2-color)"
                            stroke-width="1.2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div class="skill-item-info">
                    <span class="skill-item-name">{{ skill.name }}</span>
                    <span v-if="skill.description" class="skill-item-desc">{{ skill.description }}</span>
                </div>
            </div>
        </div>
        <div v-if="skills.length > 0" class="skill-selector-footer">
            <button class="skill-btn skill-btn-confirm" @click="confirm">{{ $t('common.confirm') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { listSkillsForUser, type SkillInfo } from '@/api/skill';

const props = defineProps<{
    visible: boolean;
    style?: Record<string, string>;
    selectedSkills: string[];
}>();

const emit = defineEmits<{
    (e: 'update:selectedSkills', skills: string[]): void;
    (e: 'close'): void;
}>();

const menuRef = ref<HTMLElement | null>(null);
const skills = ref<SkillInfo[]>([]);
const loading = ref(false);
const localSelected = ref<string[]>([]);

const isSelected = (name: string) => localSelected.value.includes(name);

const toggleSkill = (name: string) => {
    if (isSelected(name)) {
        localSelected.value = localSelected.value.filter((s) => s !== name);
    } else {
        localSelected.value = [...localSelected.value, name];
    }
};

const confirm = () => {
    emit('update:selectedSkills', [...localSelected.value]);
    emit('close');
};

// Load skills when visible
watch(
    () => props.visible,
    async (newVal) => {
        if (newVal) {
            localSelected.value = [...props.selectedSkills];
            if (skills.value.length === 0) {
                loading.value = true;
                try {
                    const res = await listSkillsForUser();
                    const list = res.data || [];
                    // 让"联网模式"(web-search)始终排在第一位
                    list.sort((a, b) => {
                        if (a.name === '联网模式') return -1;
                        if (b.name === '联网模式') return 1;
                        return 0;
                    });
                    skills.value = list;
                } catch (e) {
                    console.error('[SkillSelector] Failed to load skills:', e);
                    skills.value = [];
                } finally {
                    loading.value = false;
                }
            }
        }
    },
    { immediate: true }
);

// Click outside to close
const handleClickOutside = (e: MouseEvent) => {
    if (props.visible && menuRef.value && !menuRef.value.contains(e.target as Node)) {
        // Also check if click was on the # button itself (which has its own toggle)
        const skillBtn = document.querySelector('.skill-btn');
        if (skillBtn && skillBtn.contains(e.target as Node)) {
            return;
        }
        emit('close');
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.skill-selector {
    position: fixed;
    z-index: 9999;
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-border-level-2-color);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    width: 280px;
    max-height: 360px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.skill-selector-header {
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: var(--td-text-color-primary);
    border-bottom: 1px solid var(--td-border-level-1-color);
    flex-shrink: 0;
}

.skill-selector-loading,
.skill-selector-empty {
    padding: 24px 14px;
    text-align: center;
    color: var(--td-text-color-secondary);
    font-size: 13px;
}

.skill-selector-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
}

.skill-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 14px;
    cursor: pointer;
    transition: background-color 0.15s;
}

.skill-item:hover {
    background-color: var(--td-bg-color-container-hover);
}

.skill-item.selected {
    background-color: var(--td-bg-color-container-active);
}

.skill-item-check {
    flex-shrink: 0;
    margin-top: 2px;
}

.skill-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.skill-item-name {
    font-size: 13px;
    color: var(--td-text-color-primary);
    font-weight: 500;
    word-break: break-all;
}

.skill-item-desc {
    font-size: 12px;
    color: var(--td-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.skill-selector-footer {
    padding: 8px 14px;
    border-top: 1px solid var(--td-border-level-1-color);
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
}

.skill-btn-confirm {
    padding: 4px 16px;
    font-size: 12px;
    border-radius: 4px;
    border: none;
    background: var(--td-brand-color);
    color: #fff;
    cursor: pointer;
    transition: opacity 0.15s;
}

.skill-btn-confirm:hover {
    opacity: 0.85;
}
</style>
