<template>
    <div class="ted-page">
        <!-- Top bar -->
        <div class="ted-topbar">
            <button class="ted-back" :disabled="saving" @click="goBack">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                返回任务列表
            </button>
        </div>

        <!-- Editor card (no dialog / no gray mask) -->
        <div class="ted-task-editor">
            <div class="ted-task-editor__inner">
                <!-- Header -->
                <div class="ted-head">
                    <div class="ted-head-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.7" />
                            <path d="M3 9h18" stroke="currentColor" stroke-width="1.7" />
                            <path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                        </svg>
                    </div>
                    <div class="ted-head-text">
                        <h2>{{ isEdit ? $t('scheduledTask.editTask') : $t('scheduledTask.createTask') }}</h2>
                        <p>{{ $t('scheduledTask.subtitle') }}</p>
                    </div>
                    <button class="ted-head-close" :disabled="saving" @click="goBack" :title="$t('common.cancel')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="ted-body">
                    <!-- ============ Left column ============ -->
                    <div class="ted-col">
                        <!-- Card 1: 基础信息 -->
                        <div class="ted-card">
                            <div class="ted-card-head">
                                <span class="ted-num">1</span>
                                <h4>基础信息</h4>
                                <span class="ted-sub">任务名称、关联智能体与说明</span>
                            </div>
                            <div class="ted-card-body">
                                <div class="ted-field">
                                    <label class="ted-label">{{ $t('scheduledTask.taskName') }} <span class="ted-req">*</span></label>
                                    <t-input v-model="formData.name" :placeholder="$t('scheduledTask.taskNamePlaceholder')" class="ted-ipt" />
                                </div>

                                <div class="ted-field">
                                    <label class="ted-label">{{ $t('scheduledTask.selectAgent') }} <span class="ted-req">*</span></label>
                                    <t-select v-model="formData.agent_id" :placeholder="$t('scheduledTask.selectAgentPlaceholder')" :loading="agentsLoading" filterable>
                                        <t-option v-for="a in agents" :key="a.id" :value="a.id" :label="a.shared ? `${a.name}（共享）` : a.name" />
                                    </t-select>
                                </div>

                                <div class="ted-field" style="margin-bottom: 0">
                                    <label class="ted-label">{{ $t('scheduledTask.description') }}</label>
                                    <t-textarea v-model="formData.description" :autosize="{ minRows: 2, maxRows: 4 }" :placeholder="$t('scheduledTask.descriptionPlaceholder')" class="ted-ipt" />
                                    <div class="ted-hint">选填，便于团队成员理解任务用途</div>
                                </div>
                            </div>
                        </div>

                        <!-- Card 3: 调度设置 -->
                        <div class="ted-card">
                            <div class="ted-card-head">
                                <span class="ted-num">3</span>
                                <h4>调度设置</h4>
                                <span class="ted-sub">选择调度方式与时间</span>
                            </div>
                            <div class="ted-card-body">
                                <div class="ted-field" style="margin-bottom: 0">
                                    <label class="ted-label">{{ $t('scheduledTask.scheduleType') }}</label>
                                    <div class="ted-type-grid">
                                        <div class="ted-type-card" :class="{ active: formData.schedule_type === 'daily' }" @click="setScheduleType('daily')">
                                            <div class="ted-type-icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
                                                    <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                            <div class="ted-type-name">{{ $t('scheduledTask.typeDaily') }}</div>
                                            <div class="ted-type-desc">Daily</div>
                                        </div>
                                        <div class="ted-type-card" :class="{ active: formData.schedule_type === 'weekly' }" @click="setScheduleType('weekly')">
                                            <div class="ted-type-icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.7" />
                                                    <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                            <div class="ted-type-name">{{ $t('scheduledTask.typeWeekly') }}</div>
                                            <div class="ted-type-desc">Weekly</div>
                                        </div>
                                        <div class="ted-type-card" :class="{ active: formData.schedule_type === 'monthly' }" @click="setScheduleType('monthly')">
                                            <div class="ted-type-icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M3 8h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" stroke-width="1.7" />
                                                    <path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                            <div class="ted-type-name">{{ $t('scheduledTask.typeMonthly') }}</div>
                                            <div class="ted-type-desc">Monthly</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="ted-field" style="margin-top: 14px">
                                    <label class="ted-label">{{ $t('scheduledTask.scheduleTime') }}</label>
                                    <div class="ted-time-row">
                                        <t-time-picker v-model="formData.schedule_time" format="HH:mm" value-type="HH:mm" :clearable="false" class="ted-ipt ted-time-picker" />
                                    </div>
                                    <div class="ted-quick-times">
                                        <button v-for="qt in quickTimes" :key="qt" :class="{ active: formData.schedule_time === qt }" @click="formData.schedule_time = qt">
                                            {{ qt }}
                                        </button>
                                    </div>
                                </div>

                                <div v-if="formData.schedule_type === 'weekly'" class="ted-field" style="margin-top: 12px">
                                    <label class="ted-label">{{ $t('scheduledTask.dayOfWeek') }}</label>
                                    <div class="ted-ipt-wrap ted-with-icon">
                                        <span class="ted-lead-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.7" />
                                                <path d="M3 9h18M8 4v5M16 4v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                                            </svg>
                                        </span>
                                        <t-select v-model="formData.schedule_day_of_week">
                                            <t-option :value="1" :label="$t('scheduledTask.monday')" />
                                            <t-option :value="2" :label="$t('scheduledTask.tuesday')" />
                                            <t-option :value="3" :label="$t('scheduledTask.wednesday')" />
                                            <t-option :value="4" :label="$t('scheduledTask.thursday')" />
                                            <t-option :value="5" :label="$t('scheduledTask.friday')" />
                                            <t-option :value="6" :label="$t('scheduledTask.saturday')" />
                                            <t-option :value="7" :label="$t('scheduledTask.sunday')" />
                                        </t-select>
                                    </div>
                                </div>

                                <div v-if="formData.schedule_type === 'monthly'" class="ted-field" style="margin-top: 12px">
                                    <label class="ted-label">{{ $t('scheduledTask.dayOfMonth') }}</label>
                                    <div class="ted-stepper">
                                        <button type="button" @click="stepField('schedule_day_of_month', -1)">−</button>
                                        <input type="number" v-model.number="formData.schedule_day_of_month" min="1" max="31" />
                                        <button type="button" @click="stepField('schedule_day_of_month', 1)">+</button>
                                    </div>
                                    <div class="ted-hint">范围 1 - 31 日</div>
                                </div>

                                <div class="ted-next-run">
                                    <span class="ted-nr-ic">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span class="ted-nr-label">{{ $t('scheduledTask.nextRun') }}：</span>
                                        <span class="ted-nr-val">{{ nextRunText.dateLabel }}</span>
                                        <span class="ted-nr-label" style="margin-left: 6px">·</span>
                                        <span class="ted-nr-label" style="margin-left: 6px">距今</span>
                                        <span class="ted-nr-val">{{ nextRunText.rel }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- ============ Right column ============ -->
                    <div class="ted-col">
                        <!-- Card 2: Prompt 内容 -->
                        <div class="ted-card">
                            <div class="ted-card-head">
                                <span class="ted-num">2</span>
                                <h4>Prompt 内容</h4>
                                <span class="ted-sub">将发送给智能体的指令</span>
                            </div>
                            <div class="ted-card-body">
                                <div class="ted-field" style="margin-bottom: 0">
                                    <label class="ted-label">{{ $t('scheduledTask.prompt') }} <span class="ted-req">*</span></label>
                                    <t-textarea v-model="formData.prompt" :autosize="{ minRows: 10, maxRows: 14 }" :placeholder="$t('scheduledTask.promptPlaceholder')" class="ted-prompt-area ted-ipt" />
                                    <div class="ted-prompt-counter">已输入 <span>{{ promptLength }}</span> 字符</div>
                                </div>
                            </div>
                        </div>

                        <!-- Card 4: 高级设置 -->
                        <div class="ted-card">
                            <div class="ted-card-head">
                                <span class="ted-num">4</span>
                                <h4>高级设置</h4>
                            </div>
                            <div class="ted-card-body">
                                <div class="ted-grid-2">
                                    <div class="ted-field" style="margin-bottom: 0">
                                        <label class="ted-label">{{ $t('scheduledTask.timeoutMinutes') }}</label>
                                        <div class="ted-stepper">
                                            <button type="button" @click="stepField('timeout_minutes', -1)">−</button>
                                            <input type="number" v-model.number="formData.timeout_minutes" min="1" max="120" />
                                            <button type="button" @click="stepField('timeout_minutes', 1)">+</button>
                                        </div>
                                        <div class="ted-hint">范围 1 - 120 分钟</div>
                                    </div>
                                    <div class="ted-field" style="margin-bottom: 0">
                                        <label class="ted-label">{{ $t('scheduledTask.maxRetries') }}</label>
                                        <div class="ted-stepper">
                                            <button type="button" @click="stepField('max_retries', -1)">−</button>
                                            <input type="number" v-model.number="formData.max_retries" min="0" max="10" />
                                            <button type="button" @click="stepField('max_retries', 1)">+</button>
                                        </div>
                                        <div class="ted-hint">范围 0 - 10 次</div>
                                    </div>
                                </div>
                                <div v-if="isBuiltinSmartAgent" class="ted-switch-row" style="margin-top: 6px">
                                    <div class="ted-switch-text">
                                        <div class="ted-switch-title">{{ $t('scheduledTask.webSearchEnabled') }}</div>
                                        <div class="ted-switch-desc">{{ $t('scheduledTask.webSearchEnabledHint') }}</div>
                                    </div>
                                    <div class="ted-switch" :class="{ on: formData.web_search_enabled }" @click="formData.web_search_enabled = !formData.web_search_enabled"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Card 5: 选择技能 -->
                        <div v-if="isBuiltinSmartAgent" class="ted-card">
                            <div class="ted-card-head">
                                <span class="ted-num">5</span>
                                <h4>选择技能</h4>
                                <span class="ted-sub">ReAct 智能体专属 · {{ formData.selected_skills.length }} / {{ availableSkills.length }} 已选</span>
                            </div>
                            <div class="ted-card-body">
                                <div class="ted-skill-search">
                                    <span class="ted-skill-ic">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
                                            <path d="M16 16l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                                        </svg>
                                    </span>
                                    <input v-model="skillKeyword" :placeholder="$t('scheduledTask.skillSearchPlaceholder')" />
                                    <span class="ted-filter-tag">已选 {{ formData.selected_skills.length }}</span>
                                </div>

                                <div v-if="skillsLoading" class="ted-skills-loading">
                                    <t-loading :loading="skillsLoading" size="small" />
                                </div>

                                <div v-else-if="filteredSkills.length === 0" class="ted-skills-empty">
                                    <t-icon name="search" size="24px" />
                                    <span>{{ $t('scheduledTask.noSkillsMatch') }}</span>
                                </div>

                                <div v-else class="ted-skill-grid">
                                    <div v-for="skill in filteredSkills" :key="skill.name" class="ted-skill-pick" :class="{ on: isSkillSelected(skill.name) }" @click="toggleSkill(skill.name)">
                                        <span class="ted-check">
                                            <svg v-if="isSkillSelected(skill.name)" width="11" height="11" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </span>
                                        <div class="ted-skill-pick-body">
                                            <div class="ted-skill-pick-name">
                                                {{ skill.name }}
                                                <span v-if="isPresetSkill(skill)" class="ted-tag">预设</span>
                                            </div>
                                            <div class="ted-skill-pick-desc">
                                                {{ skill.description || $t('skill.noDescription') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="!skillsLoading && filteredSkills.length > 0" class="ted-skill-footer">
                                    <span>已选 <span class="ted-picked"><b>{{ formData.selected_skills.length }}</b></span> / {{ availableSkills.length }} 个技能</span>
                                    <a href="#" class="ted-view-all" @click.prevent>查看全部 →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="ted-foot">
                    <div class="ted-foot-left">
                        <span class="ted-foot-dot"></span>
                        <span>所有更改将自动保存到当前租户</span>
                    </div>
                    <div class="ted-foot-right">
                        <button type="button" class="ted-btn ted-btn-ghost" :disabled="saving" @click="goBack">{{ $t('common.cancel') }}</button>
                        <button type="button" class="ted-btn ted-btn-primary" :disabled="saving" @click="handleSave">
                            <t-loading v-if="saving" size="small" />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            {{ isEdit ? $t('common.save') : $t('scheduledTask.createTask') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import {
    createScheduledTask,
    updateScheduledTask,
    getScheduledTask,
    type CreateScheduledTaskRequest
} from '@/api/scheduled-task';
import { listAgents } from '@/api/agent';
import { listSharedAgents } from '@/api/organization';
import { listSkillsForUser, type SkillInfo, type UserSkillInfo } from '@/api/skill';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const taskId = computed(() => (route.params.taskId as string) || undefined);
const isEdit = computed(() => !!taskId.value);
const saving = ref(false);

const agents = ref<{ id: string; name: string; shared?: boolean }[]>([]);
const agentsLoading = ref(false);

const availableSkills = ref<SkillInfo[]>([]);
const skillsLoading = ref(false);
const skillKeyword = ref('');

const quickTimes = ['06:00', '08:00', '09:00', '12:00', '18:00', '21:00'];

function defaultFormData() {
    return {
        name: '',
        description: '',
        agent_id: '',
        prompt: '',
        schedule_type: 'daily',
        cron_expr: '',
        interval_minutes: 30,
        run_once_at: '',
        schedule_time: '09:00',
        schedule_day_of_week: 1,
        schedule_day_of_month: 1,
        timeout_minutes: 10,
        max_retries: 3,
        web_search_enabled: false,
        selected_skills: [] as string[]
    };
}

const formData = reactive(defaultFormData());

const isBuiltinSmartAgent = computed(() => {
    return formData.agent_id === 'builtin-smart';
});

const promptLength = computed(() => (formData.prompt || '').length);

const filteredSkills = computed(() => {
    const kw = skillKeyword.value.trim().toLowerCase();
    if (!kw) return availableSkills.value;
    return availableSkills.value.filter(
        (s) => (s.name || '').toLowerCase().includes(kw) || (s.description || '').toLowerCase().includes(kw)
    );
});

const nextRunText = computed(() => {
    try {
        const now = new Date();
        const [hh, mm] = (formData.schedule_time || '09:00').split(':').map(Number);
        const next = new Date(now);
        next.setHours(hh, mm, 0, 0);

        if (formData.schedule_type === 'daily') {
            if (next <= now) next.setDate(next.getDate() + 1);
        } else if (formData.schedule_type === 'weekly') {
            const target = formData.schedule_day_of_week || 1;
            const cur = now.getDay() === 0 ? 7 : now.getDay();
            let diff = (target - cur + 7) % 7;
            next.setDate(now.getDate() + diff);
            next.setHours(hh, mm, 0, 0);
            if (next <= now) {
                next.setDate(next.getDate() + 7);
            }
        } else if (formData.schedule_type === 'monthly') {
            next.setDate(formData.schedule_day_of_month || 1);
            next.setHours(hh, mm, 0, 0);
            if (next <= now) next.setMonth(next.getMonth() + 1);
        }

        const dateLabel = `${next.getMonth() + 1}月${next.getDate()}日 ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
        const totalMin = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 60000));
        const dh = Math.floor(totalMin / 60);
        const dm = totalMin % 60;
        const rel = dh > 0 ? `${dh}h ${dm}m` : `${dm}m`;
        return { dateLabel, rel };
    } catch {
        return { dateLabel: '—', rel: '—' };
    }
});

function isSkillSelected(name: string) {
    return formData.selected_skills.includes(name);
}

function isPresetSkill(skill: SkillInfo | UserSkillInfo): boolean {
    if ('source' in skill) {
        return skill.source === 'preloaded';
    }
    return 'is_preloaded' in skill && skill.is_preloaded === true;
}

function toggleSkill(name: string) {
    const idx = formData.selected_skills.indexOf(name);
    if (idx >= 0) {
        formData.selected_skills.splice(idx, 1);
    } else {
        formData.selected_skills.push(name);
    }
}

function setScheduleType(val: string) {
    formData.schedule_type = val;
    onScheduleTypeChange();
}

type StepperField = 'timeout_minutes' | 'max_retries' | 'schedule_day_of_month';

function stepField(field: StepperField, delta: number) {
    const min = field === 'schedule_day_of_month' ? 1 : field === 'timeout_minutes' ? 1 : 0;
    const max = field === 'schedule_day_of_month' ? 31 : field === 'timeout_minutes' ? 120 : 10;
    const current = formData[field];
    let v = current + delta;
    v = Math.max(min, Math.min(max, v));
    formData[field] = v;
}

async function fetchAgents() {
    agentsLoading.value = true;
    try {
        const [ownRes, sharedRes] = await Promise.all([listAgents().catch(() => ({ data: [] })), listSharedAgents().catch(() => ({ data: [] }))]);
        const own = ((ownRes as any).data || []).map((a: any) => ({ id: a.id, name: a.name }));
        const shared = ((sharedRes as any).data || [])
            .filter((s: any) => s.agent && !s.disabled_by_me)
            .map((s: any) => ({ id: s.agent.id, name: s.agent.name, shared: true }));
        agents.value = [...own, ...shared];
    } catch {
        /* ignore */
    } finally {
        agentsLoading.value = false;
    }
}

async function fetchSkills() {
    skillsLoading.value = true;
    try {
        const res = await listSkillsForUser();
        availableSkills.value = (res as any).data || [];
    } catch {
        availableSkills.value = [];
    } finally {
        skillsLoading.value = false;
    }
}

function onScheduleTypeChange() {
    formData.cron_expr = '';
    formData.interval_minutes = 30;
    formData.schedule_time = '09:00';
}

function validateForm(): boolean {
    if (!formData.name.trim()) {
        MessagePlugin.warning(t('scheduledTask.taskNameRequired'));
        return false;
    }
    if (!formData.agent_id) {
        MessagePlugin.warning(t('scheduledTask.agentRequired'));
        return false;
    }
    if (!formData.prompt.trim()) {
        MessagePlugin.warning(t('scheduledTask.promptRequired'));
        return false;
    }
    return true;
}

async function handleSave() {
    if (!validateForm()) return;
    saving.value = true;
    try {
        const data: CreateScheduledTaskRequest = {
            name: formData.name,
            description: formData.description,
            agent_id: formData.agent_id,
            prompt: formData.prompt,
            schedule_type: formData.schedule_type as any,
            cron_expr: formData.cron_expr || undefined,
            interval_minutes: formData.interval_minutes || undefined,
            run_once_at: formData.run_once_at || undefined,
            schedule_time: formData.schedule_time || undefined,
            schedule_day_of_week: formData.schedule_day_of_week || undefined,
            schedule_day_of_month: formData.schedule_day_of_month || undefined,
            timeout_minutes: formData.timeout_minutes,
            enable_sandbox: true,
            max_retries: formData.max_retries,
            web_search_enabled: isBuiltinSmartAgent.value ? formData.web_search_enabled : undefined,
            selected_skills: isBuiltinSmartAgent.value ? formData.selected_skills : undefined
        };

        if (isEdit.value && taskId.value) {
            await updateScheduledTask(taskId.value, data);
            MessagePlugin.success(t('scheduledTask.updateSuccess'));
        } else {
            await createScheduledTask(data);
            MessagePlugin.success(t('scheduledTask.createSuccess'));
        }
        // 跳转前先复位 saving，否则 goBack 内的 saving 守卫会直接 return，
        // 导致创建/保存成功后无法自动返回列表页。
        saving.value = false;
        goBack();
    } catch (e: any) {
        MessagePlugin.error(e?.message || t('scheduledTask.saveError'));
    } finally {
        saving.value = false;
    }
}

function goBack() {
    if (saving.value) return;
    router.push({ name: 'scheduledTaskList' });
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        goBack();
    }
}

onMounted(async () => {
    skillKeyword.value = '';
    window.addEventListener('keydown', onKeydown);

    if (isEdit.value && taskId.value) {
        try {
            const res = (await getScheduledTask(taskId.value)) as any;
            const task = res?.data || res;
            let selectedSkills: string[] = [];
            if (task.selected_skills) {
                try {
                    selectedSkills = JSON.parse(task.selected_skills);
                } catch {
                    selectedSkills = [];
                }
            }
            Object.assign(formData, {
                name: task.name,
                description: task.description,
                agent_id: task.agent_id,
                prompt: task.prompt,
                schedule_type: task.schedule_type,
                cron_expr: task.cron_expr,
                interval_minutes: task.interval_minutes,
                run_once_at: task.run_once_at || '',
                schedule_time: task.schedule_time,
                schedule_day_of_week: task.schedule_day_of_week,
                schedule_day_of_month: task.schedule_day_of_month,
                timeout_minutes: task.timeout_minutes,
                max_retries: task.max_retries,
                web_search_enabled: task.web_search_enabled || false,
                selected_skills: selectedSkills
            });
        } catch (e: any) {
            MessagePlugin.error(e?.message || t('scheduledTask.fetchError'));
            router.push({ name: 'scheduledTaskList' });
            return;
        }
    } else {
        Object.assign(formData, defaultFormData());
    }

    fetchAgents();
    fetchSkills();
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>

<!-- ═══════════════════════════════════════════════════════════════
     Standalone page styles (extracted from the old t-dialog modal).
     All selectors are namespaced with .ted- to avoid global pollution.
     ═══════════════════════════════════════════════════════════════ -->
<style>
/* ========== Design Tokens ========== */
.ted-task-editor {
    --ted-brand-50: #ecfdf5;
    --ted-brand-100: #d1fae5;
    --ted-brand-200: #a7f3d0;
    --ted-brand-300: #6ee7b7;
    --ted-brand-400: #34d399;
    --ted-brand-500: #10b981;
    --ted-brand-600: #059669;
    --ted-brand-700: #047857;

    --ted-ink-900: #0f172a;
    --ted-ink-800: #1e293b;
    --ted-ink-700: #334155;
    --ted-ink-600: #475569;
    --ted-ink-500: #64748b;
    --ted-ink-400: #94a3b8;
    --ted-ink-300: #cbd5e1;
    --ted-ink-200: #e2e8f0;
    --ted-ink-100: #f1f5f9;
    --ted-ink-50: #f8fafc;

    --ted-border-soft: rgba(15, 23, 42, 0.06);
    --ted-border: rgba(15, 23, 42, 0.1);
    --ted-border-strong: rgba(15, 23, 42, 0.16);

    --ted-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06);
    --ted-shadow-md: 0 4px 12px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.04);
    --ted-shadow-lg: 0 24px 60px rgba(15, 23, 42, 0.18), 0 8px 20px rgba(15, 23, 42, 0.08);
    --ted-shadow-brand: 0 8px 24px rgba(16, 185, 129, 0.18);

    --ted-r-xs: 6px;
    --ted-r-sm: 8px;
    --ted-r-md: 12px;
    --ted-r-lg: 16px;
    --ted-r-xl: 20px;
    --ted-r-2xl: 24px;

    --ted-ease: cubic-bezier(0.4, 0, 0.2, 1);

    width: 100%;
    max-width: 1040px;
    flex: 1;
    min-height: 0;
    margin: 0 auto;
    border-radius: var(--ted-r-2xl);
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: var(--ted-shadow-lg);
    display: flex;
    flex-direction: column;
}

.ted-task-editor__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background:
        radial-gradient(1200px 600px at 100% 0%, rgba(16, 185, 129, 0.04), transparent 60%),
        #fff;
}

.ted-task-editor__inner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--ted-brand-400), var(--ted-brand-600), var(--ted-brand-400));
    background-size: 200% 100%;
    animation: tedShimmer 4s linear infinite;
    z-index: 5;
}
@keyframes tedShimmer { to { background-position: 200% 0; } }

/* ========== Page layout ========== */
.ted-page {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px 24px 24px;
    box-sizing: border-box;
    overflow: hidden;
}

.ted-topbar {
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.ted-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--ted-ink-600);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--ted-border);
    border-radius: var(--ted-r-sm);
    padding: 8px 14px;
    cursor: pointer;
    transition: all 0.2s var(--ted-ease);
}
.ted-back:hover:not(:disabled) {
    color: var(--ted-ink-900);
    background: #fff;
    box-shadow: var(--ted-shadow-sm);
}
.ted-back:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ========== Header ========== */
.ted-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 28px 8px;
    border-bottom: 1px solid var(--ted-border-soft);
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.6), transparent);
    flex-shrink: 0;
}
.ted-head-icon {
    width: 46px; height: 46px;
    border-radius: var(--ted-r-md);
    display: flex; align-items: center; justify-content: center;
    background:
        radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.22), rgba(16, 185, 129, 0.08) 70%),
        linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(16, 185, 129, 0.04));
    color: var(--ted-brand-600);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 16px rgba(16, 185, 129, 0.18);
}
.ted-head-text { flex: 1; min-width: 0; }
.ted-head-text h2 {
    margin: 0; font-size: 17px; font-weight: 700; color: var(--ted-ink-900); letter-spacing: -0.01em;
}
.ted-head-text p {
    margin: 3px 0 0; font-size: 12.5px; color: var(--ted-ink-500); letter-spacing: 0.01em;
}
.ted-head-close {
    width: 34px; height: 34px;
    border: 0; background: transparent; border-radius: 10px;
    cursor: pointer; color: var(--ted-ink-400);
    display: inline-flex; align-items: center; justify-content: center;
    transition: all 0.25s var(--ted-ease);
}
.ted-head-close:hover:not(:disabled) {
    background: var(--ted-ink-100); color: var(--ted-ink-800); transform: rotate(90deg);
}

/* ========== Body two-column ========== */
.ted-body {
    padding: 22px 28px;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 22px;
    flex: 1; overflow-y: auto; min-height: 0;
}
.ted-body::-webkit-scrollbar { width: 8px; }
.ted-body::-webkit-scrollbar-thumb { background: var(--ted-ink-200); border-radius: 4px; }
.ted-body::-webkit-scrollbar-thumb:hover { background: var(--ted-ink-300); }

.ted-col { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

/* ========== Card ========== */
.ted-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.7));
    border: 1px solid var(--ted-border-soft);
    border-radius: var(--ted-r-lg);
    box-shadow: var(--ted-shadow-sm);
    overflow: hidden;
    transition: all 0.25s var(--ted-ease);
}
.ted-card:hover { box-shadow: var(--ted-shadow-md); }

.ted-card-head {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--ted-border-soft);
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.5), transparent);
}
.ted-num {
    width: 22px; height: 22px; border-radius: 7px;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    background: var(--ted-brand-50); color: var(--ted-brand-700);
    border: 1px solid var(--ted-brand-200);
}
.ted-card-head h4 {
    margin: 0; font-size: 13.5px; font-weight: 700; color: var(--ted-ink-900); letter-spacing: -0.005em;
}
.ted-sub { font-size: 11.5px; color: var(--ted-ink-500); }
.ted-card-body { padding: 16px 18px 18px; }

/* ========== Field ========== */
.ted-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.ted-field:last-child { margin-bottom: 0; }
.ted-label {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 600; color: var(--ted-ink-700);
}
.ted-req { color: #ef4444; font-size: 14px; line-height: 1; }
.ted-hint { font-size: 11px; color: var(--ted-ink-500); margin-top: 2px; }
.ted-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ========== Input overrides (TDesign components inside page) ========== */
.ted-ipt-wrap { position: relative; }
.ted-lead-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--ted-ink-400); pointer-events: none; z-index: 2;
}
.ted-with-icon .t-input,
.ted-with-icon .t-select { --td-comp-paddingLR: 38px !important; }

.ted-task-editor__inner .t-input,
.ted-task-editor__inner .t-select,
.ted-task-editor__inner .t-textarea,
.ted-task-editor__inner .t-time-picker { width: 100%; }

.ted-task-editor__inner .t-input__inner,
.ted-task-editor__inner .t-textarea__inner,
.ted-task-editor__inner .t-select__input {
    border-radius: var(--ted-r-sm) !important;
    border-color: var(--ted-border) !important;
    background: rgba(255, 255, 255, 0.85) !important;
    color: var(--ted-ink-900) !important;
    transition: all 0.25s var(--ted-ease) !important;
}
.ted-task-editor__inner .t-input__inner:hover,
.ted-task-editor__inner .t-textarea__inner:hover,
.ted-task-editor__inner .t-select__input:hover {
    border-color: var(--ted-ink-300) !important;
}
.ted-task-editor__inner .t-input__inner:focus,
.ted-task-editor__inner .t-textarea__inner:focus,
.ted-task-editor__inner .t-select__input:focus,
.ted-task-editor__inner .t-is-focused {
    border-color: var(--ted-brand-500) !important;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12) !important;
    background: #fff !important;
}
.ted-task-editor__inner .t-input__inner { height: 38px !important; }

/* ========== Schedule type cards ========== */
.ted-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ted-type-card {
    position: relative; padding: 14px 12px;
    border: 1.5px solid var(--ted-border);
    background: rgba(255, 255, 255, 0.6);
    border-radius: var(--ted-r-md);
    cursor: pointer; transition: all 0.25s var(--ted-ease);
    text-align: center;
}
.ted-type-card:hover {
    border-color: var(--ted-brand-300);
    background: rgba(255, 255, 255, 0.85);
    transform: translateY(-1px);
}
.ted-type-card.active {
    border-color: var(--ted-brand-500);
    background: linear-gradient(135deg, var(--ted-brand-50), rgba(255, 255, 255, 0.85));
    box-shadow: 0 6px 18px rgba(16, 185, 129, 0.12), inset 0 0 0 1px var(--ted-brand-200);
}
.ted-type-card.active::before {
    content: '\2713'; position: absolute; top: 6px; right: 8px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--ted-brand-500); color: #fff;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.32);
}
.ted-type-icon {
    width: 36px; height: 36px; margin: 0 auto 8px;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--ted-ink-100), var(--ted-ink-50));
    color: var(--ted-ink-600); transition: all 0.25s var(--ted-ease);
}
.ted-type-card.active .ted-type-icon {
    background: linear-gradient(135deg, var(--ted-brand-400), var(--ted-brand-600));
    color: #fff; box-shadow: 0 6px 14px rgba(16, 185, 129, 0.3);
}
.ted-type-name { font-size: 12.5px; font-weight: 700; color: var(--ted-ink-800); }
.ted-type-desc { font-size: 10.5px; color: var(--ted-ink-500); margin-top: 2px; }

/* ========== Time picker quick presets ========== */
.ted-time-row { display: flex; gap: 8px; align-items: center; }
.ted-time-row .ted-time-picker { flex: 1; }
.ted-quick-times { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.ted-quick-times button {
    font: inherit; font-size: 11px; font-weight: 500;
    padding: 4px 10px; border-radius: 6px;
    border: 1px solid var(--ted-border);
    background: rgba(255, 255, 255, 0.7);
    color: var(--ted-ink-600); cursor: pointer;
    transition: all 0.2s var(--ted-ease);
}
.ted-quick-times button:hover {
    border-color: var(--ted-brand-400); color: var(--ted-brand-700); background: var(--ted-brand-50);
}
.ted-quick-times button.active {
    border-color: var(--ted-brand-500); background: var(--ted-brand-500); color: #fff;
}

/* ========== Next-run preview ========== */
.ted-next-run {
    margin-top: 14px; padding: 10px 12px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(16, 185, 129, 0.02));
    border: 1px dashed var(--ted-brand-300);
    border-radius: var(--ted-r-sm);
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: var(--ted-brand-700);
}
.ted-nr-ic {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--ted-brand-100); color: var(--ted-brand-700);
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ted-nr-label { color: var(--ted-ink-500); margin-right: 2px; }
.ted-nr-val { font-weight: 700; color: var(--ted-ink-900); }

/* ========== Toggle switch ========== */
.ted-switch-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 10px 12px;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.5));
    border: 1px solid var(--ted-border-soft); border-radius: var(--ted-r-sm);
}
.ted-switch-text { display: flex; flex-direction: column; gap: 2px; }
.ted-switch-title { font-size: 12.5px; font-weight: 600; color: var(--ted-ink-800); }
.ted-switch-desc { font-size: 11px; color: var(--ted-ink-500); }

.ted-switch {
    position: relative; flex-shrink: 0;
    width: 38px; height: 22px;
    background: var(--ted-ink-200); border-radius: 999px;
    cursor: pointer; transition: all 0.25s var(--ted-ease);
}
.ted-switch::after {
    content: ''; position: absolute; top: 2px; left: 2px;
    width: 18px; height: 18px;
    background: #fff; border-radius: 50%;
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.18);
    transition: all 0.25s var(--ted-ease);
}
.ted-switch.on { background: var(--ted-brand-500); }
.ted-switch.on::after { left: 18px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4); }

/* ========== Number stepper ========== */
.ted-stepper {
    display: inline-flex; align-items: center;
    border: 1px solid var(--ted-border); border-radius: var(--ted-r-sm);
    background: rgba(255, 255, 255, 0.85); overflow: hidden; width: 100%;
}
.ted-stepper button {
    width: 32px; height: 36px; border: 0; background: transparent;
    cursor: pointer; color: var(--ted-ink-500);
    font-size: 14px; font-weight: 600;
    display: inline-flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
}
.ted-stepper button:hover { background: var(--ted-ink-100); color: var(--ted-ink-800); }
.ted-stepper input {
    width: 60px; height: 36px; border: 0; background: transparent;
    text-align: center; font: inherit; font-size: 13px; font-weight: 600;
    color: var(--ted-ink-900); outline: 0;
    -moz-appearance: textfield;
}
.ted-stepper input::-webkit-outer-spin-button,
.ted-stepper input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

/* ========== Prompt textarea ========== */
.ted-prompt-area .t-textarea__inner {
    min-height: 220px !important;
    border: 1px solid var(--ted-border) !important;
    border-radius: var(--ted-r-sm) !important;
    background: rgba(255, 255, 255, 0.85) !important;
    font-family: inherit !important;
    font-size: 13px !important;
    line-height: 1.65 !important;
    resize: vertical !important;
}
.ted-prompt-area .t-textarea__inner:focus {
    border-color: var(--ted-brand-500) !important;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12) !important;
    background: #fff !important;
}
.ted-prompt-counter {
    display: flex; justify-content: flex-end; margin-top: 6px;
    font-size: 11px; color: var(--ted-ink-500);
}
.ted-prompt-counter span { color: var(--ted-brand-700); font-weight: 700; font-variant-numeric: tabular-nums; margin: 0 2px; }

/* ========== Skills picker ========== */
.ted-skill-search { position: relative; margin-bottom: 12px; }
.ted-skill-search input {
    width: 100%; height: 36px; padding: 0 12px 0 36px;
    border: 1px solid var(--ted-border); border-radius: var(--ted-r-sm);
    background: rgba(255, 255, 255, 0.85); font: inherit;
    font-size: 12.5px; color: var(--ted-ink-900); outline: 0;
    transition: all 0.25s;
}
.ted-skill-search input:focus {
    border-color: var(--ted-brand-500);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}
.ted-skill-ic {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--ted-ink-400);
}
.ted-filter-tag {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    font-size: 10.5px; font-weight: 600; padding: 3px 8px;
    border-radius: 999px; background: var(--ted-brand-50); color: var(--ted-brand-700);
}

.ted-skill-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    max-height: 280px; overflow-y: auto; padding-right: 4px;
}
.ted-skill-grid::-webkit-scrollbar { width: 6px; }
.ted-skill-grid::-webkit-scrollbar-thumb { background: var(--ted-ink-200); border-radius: 3px; }

.ted-skill-pick {
    position: relative; display: flex; gap: 10px; align-items: flex-start;
    padding: 12px; background: rgba(255, 255, 255, 0.6);
    border: 1.5px solid var(--ted-border-soft); border-radius: var(--ted-r-sm);
    cursor: pointer; transition: all 0.2s var(--ted-ease);
}
.ted-skill-pick:hover {
    border-color: var(--ted-brand-300); background: rgba(255, 255, 255, 0.85);
    transform: translateY(-1px);
}
.ted-skill-pick.on {
    border-color: var(--ted-brand-500);
    background: linear-gradient(135deg, var(--ted-brand-50), rgba(255, 255, 255, 0.85));
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.12);
}
.ted-check {
    flex-shrink: 0; width: 18px; height: 18px; border-radius: 5px;
    border: 1.5px solid var(--ted-ink-300); background: #fff;
    display: inline-flex; align-items: center; justify-content: center;
    color: #fff; transition: all 0.2s;
}
.ted-skill-pick.on .ted-check { background: var(--ted-brand-500); border-color: var(--ted-brand-500); }
.ted-skill-pick-body { min-width: 0; flex: 1; }
.ted-skill-pick-name {
    display: flex; align-items: center; gap: 6px;
    font-size: 12.5px; font-weight: 700; color: var(--ted-ink-900);
}
.ted-tag {
    font-size: 9.5px; padding: 1px 5px; border-radius: 3px;
    background: #dbeafe; color: #1d4ed8; font-weight: 700; text-transform: uppercase;
}
.ted-skill-pick-desc {
    font-size: 11px; color: var(--ted-ink-500); margin-top: 3px;
    line-height: 1.5; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.ted-skill-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 10px; border-top: 1px solid var(--ted-border-soft);
    margin-top: 10px; font-size: 11.5px; color: var(--ted-ink-500);
}
.ted-picked { color: var(--ted-brand-700); font-weight: 600; }
.ted-picked b { color: var(--ted-brand-700); font-size: 13px; }
.ted-view-all { color: var(--ted-brand-700); font-weight: 600; text-decoration: none; }

.ted-skills-loading,
.ted-skills-empty {
    display: flex; align-items: center; gap: 8px;
    padding: 28px; color: var(--ted-ink-400); font-size: 13px; justify-content: center;
}

/* ========== Footer ========== */
.ted-foot {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 5px 28px;
    background: rgba(255, 255, 255, 0.85);
    border-top: 1px solid var(--ted-border-soft);
    backdrop-filter: blur(12px); flex-shrink: 0;
}
.ted-foot-left {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--ted-ink-500);
}
.ted-foot-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--ted-brand-500);
    box-shadow: 0 0 0 4px var(--ted-brand-100);
    animation: tedPulse 1.5s ease-in-out infinite;
}
@keyframes tedPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.ted-foot-right { display: inline-flex; gap: 10px; }

.ted-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 6px; height: 40px; padding: 0 20px;
    border-radius: var(--ted-r-sm); font: inherit;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    border: 1px solid transparent; transition: all 0.25s var(--ted-ease);
    letter-spacing: 0.01em;
}
.ted-btn-ghost {
    background: rgba(15, 23, 42, 0.04); border-color: var(--ted-border); color: var(--ted-ink-700);
}
.ted-btn-ghost:hover:not(:disabled) { background: rgba(15, 23, 42, 0.08); color: var(--ted-ink-900); }
.ted-btn-primary {
    color: #fff;
    background: linear-gradient(135deg, var(--ted-brand-500), var(--ted-brand-700));
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.18);
    min-width: 132px;
}
.ted-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(16, 185, 129, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.ted-btn-primary:active:not(:disabled) { transform: translateY(0); }
.ted-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

/* ========== Responsive ========== */
@media (max-width: 880px) {
    .ted-body { grid-template-columns: 1fr; }
    .ted-grid-2, .ted-skill-grid, .ted-type-grid { grid-template-columns: 1fr; }
}
</style>
