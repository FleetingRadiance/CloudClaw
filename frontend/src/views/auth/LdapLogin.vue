<template>
    <div class="login-layout">
        <div class="animated-bg">
            <div class="knowledge-node node-1">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            </div>
            <div class="knowledge-node node-2">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            </div>
            <div class="knowledge-node node-3">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            </div>
            <div class="knowledge-node node-4">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
            </div>
            <div class="knowledge-node node-5">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
            </div>
            <div class="knowledge-node node-6">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
            </div>

            <svg class="knowledge-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line class="connection-line line-1" x1="20" y1="15" x2="35" y2="25" />
                <line class="connection-line line-2" x1="35" y1="25" x2="55" y2="20" />
                <line class="connection-line line-3" x1="55" y1="20" x2="85" y2="12" />
                <line class="connection-line line-4" x1="8" y1="35" x2="25" y2="45" />
                <line class="connection-line line-5" x1="25" y1="45" x2="65" y2="48" />
                <line class="connection-line line-6" x1="20" y1="60" x2="60" y2="75" />
            </svg>
        </div>

        <!-- Logo - Top Left -->
        <router-link to="/" class="header-logo" title="商业西北智能体">
            <img src="@/assets/img/cloudclow.png" alt="商业西北智能体" class="logo-image" />
        </router-link>

        <!-- Header Links - Top Right -->
        <div class="header-links">
            <div class="language-switch">
                <button @click="toggleLanguageMenu" class="header-link" :title="currentLangOption?.label">
                    <span class="link-text">{{ currentLangOption?.shortLabel }}</span>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                <div v-if="showLanguageMenu" class="language-dropdown">
                    <div
                        v-for="lang in languageOptions"
                        :key="lang.value"
                        @click="selectLanguage(lang.value)"
                        class="language-option"
                        :class="{ active: currentLanguage === lang.value }"
                    >
                        <span class="lang-label">{{ lang.label }}</span>
                        <span v-if="currentLanguage === lang.value" class="check-icon">✓</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Left Showcase Section -->
        <div class="showcase-section">
            <div class="showcase-content">
                <h1 class="showcase-title">{{ $t('platform.name') }}</h1>
                <p class="showcase-subtitle">{{ $t('platform.subtitle') }}</p>
                <p class="showcase-description">{{ $t('platform.description') }}</p>

                <div class="feature-tags">
                    <span class="tag">{{ $t('platform.agent') }}</span>
                    <span class="tag">{{ $t('platform.rag') }}</span>
                    <span class="tag">{{ $t('platform.wiki') }}</span>
                    <span class="tag">{{ $t('platform.hybridSearch') }}</span>
                </div>
            </div>
        </div>

        <!-- Right Form Section -->
        <div class="form-section">
            <div class="form-panel">
                <div class="form-card">
                    <div class="form-header">
                        <h2 class="form-title">{{ $t('auth.ldapDomainLogin') }}</h2>
                        <p class="form-welcome">{{ $t('auth.ldapLoginHint') }}</p>
                    </div>

                    <div class="form-content">
                        <t-form
                            ref="ldapFormRef"
                            :data="ldapFormData"
                            :rules="ldapFormRules"
                            @submit="handleLdapLogin"
                            layout="vertical"
                        >
                            <t-form-item :label="$t('auth.ldapLoginName')" name="login_name">
                                <t-input
                                    v-model="ldapFormData.login_name"
                                    :placeholder="$t('auth.ldapLoginNamePlaceholder')"
                                    type="text"
                                    autocomplete="username"
                                    size="large"
                                    :disabled="loading"
                                />
                            </t-form-item>

                            <t-form-item :label="$t('auth.password')" name="password">
                                <t-input
                                    v-model="ldapFormData.password"
                                    :placeholder="$t('auth.passwordPlaceholder')"
                                    type="password"
                                    size="large"
                                    :disabled="loading"
                                    @enter="handleLdapLogin"
                                />
                            </t-form-item>

                            <t-button
                                type="submit"
                                theme="primary"
                                size="large"
                                block
                                :loading="loading"
                                class="submit-button"
                            >
                                {{ loading ? $t('auth.loggingIn') : $t('auth.login') }}
                            </t-button>
                        </t-form>

                        <!-- 返回管理员登录 -->
                        <div class="back-to-login">
                            <div class="register-cta__divider">
                                <span>{{ $t('auth.orContinueWith') }}</span>
                            </div>
                            <t-button
                                theme="default"
                                variant="outline"
                                size="large"
                                block
                                class="back-button"
                                :disabled="loading"
                                @click="$router.push('/login')"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    style="margin-right: 8px; flex-shrink: 0"
                                >
                                    <path d="M19 12H5" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                {{ $t('auth.switchToEmail') }}
                            </t-button>
                        </div>

                        <!-- Features list -->
                        <div class="login-features">
                            <div class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">{{ $t('platform.multimodalParsing') }}</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">{{ $t('platform.hybridSearchEngine') }}</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">{{ $t('platform.ragQandA') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import { ldapLogin, userInfoFromApi } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import { useRoleLabel } from '@/composables/useRoleLabel';
import { notifyLoginSuccess } from '@/utils/loginNotify';

const { t, tm, locale } = useI18n();
const { formatRole, roleIcon } = useRoleLabel();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const ldapFormRef = ref();
const showLanguageMenu = ref(false);

// Language options
const languageOptions = [
    { value: 'zh-CN', label: '简体中文', shortLabel: 'CN' },
    { value: 'en-US', label: 'English', shortLabel: 'EN' }
];

const currentLanguage = computed(() => locale.value);
const currentLangOption = computed(() => languageOptions.find((l) => l.value === currentLanguage.value));

const ldapFormData = reactive({
    login_name: '',
    password: ''
});

const ldapFormRules = {
    login_name: [{ required: true, message: t('auth.ldapLoginNameRequired'), trigger: 'blur' }],
    password: [{ required: true, message: t('auth.passwordRequired'), trigger: 'blur' }]
};

const toggleLanguageMenu = () => {
    showLanguageMenu.value = !showLanguageMenu.value;
};

const selectLanguage = (lang: string) => {
    locale.value = lang;
    localStorage.setItem('locale', lang);
    showLanguageMenu.value = false;
    MessagePlugin.success(t('language.languageSaved'));
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-switch')) {
        showLanguageMenu.value = false;
    }
};

const handleLdapLogin = async () => {
    const valid = await ldapFormRef.value?.validate();
    if (valid !== true) return;

    loading.value = true;
    try {
        const response = await ldapLogin({
            login_name: ldapFormData.login_name,
            password: ldapFormData.password
        });
        if (response.success) {
            const activeTenant = response.active_tenant || response.tenant;
            if (response.user && activeTenant && response.token) {
                const homeTenantIdRaw = response.user.tenant_id ?? activeTenant.id;
                authStore.setUser(userInfoFromApi(response.user, homeTenantIdRaw));
                authStore.setToken(response.token);
                if (response.refresh_token) {
                    authStore.setRefreshToken(response.refresh_token);
                }
                authStore.setTenant({
                    id: String(activeTenant.id) || '',
                    name: activeTenant.name || '',
                    api_key: activeTenant.api_key || '',
                    owner_id: response.user.id || '',
                    created_at: activeTenant.created_at || new Date().toISOString(),
                    updated_at: activeTenant.updated_at || new Date().toISOString()
                });
                if (Array.isArray(response.memberships)) {
                    authStore.setMemberships(response.memberships);
                }
                const activeIdNum = Number(activeTenant.id);
                const homeIdNum = Number(homeTenantIdRaw);
                if (Number.isFinite(activeIdNum) && Number.isFinite(homeIdNum) && activeIdNum !== homeIdNum) {
                    authStore.setSelectedTenant(activeIdNum, activeTenant.name || null);
                } else {
                    authStore.setSelectedTenant(null, null);
                }
            }
            notifyLoginSuccess(response, t, tm, formatRole, roleIcon);
            await nextTick();
            try {
                await router.replace('/platform/knowledge-bases');
            } catch (navError) {
                window.location.replace('/platform/knowledge-bases');
            }
        } else {
            MessagePlugin.error(response.message || t('auth.ldapLoginFailed'));
        }
    } catch (error: any) {
        MessagePlugin.error(error?.message || t('auth.ldapLoginFailed'));
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    if (authStore.isLoggedIn) {
        router.replace('/platform/knowledge-bases');
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="less" scoped>
.login-layout {
    display: flex;
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    position: relative;
    background:
        radial-gradient(ellipse at 10% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 90% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 60%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #134e4a 55%, #0f766e 80%, #115e59 100%);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%);
        pointer-events: none;
    }
}

.animated-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
    contain: strict;
}

.animated-bg::before,
.animated-bg::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
}

.animated-bg::before {
    width: 500px;
    height: 500px;
    top: -10%;
    left: -5%;
    background: rgba(6, 182, 212, 0.12);
    animation: orbFloat1 20s infinite ease-in-out;
}

.animated-bg::after {
    width: 400px;
    height: 400px;
    bottom: -5%;
    right: -5%;
    background: rgba(16, 185, 129, 0.1);
    animation: orbFloat2 25s infinite ease-in-out;
}

@keyframes orbFloat1 {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(60px, 40px) scale(1.1);
    }
    66% {
        transform: translate(-30px, 80px) scale(0.95);
    }
}

@keyframes orbFloat2 {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(-50px, -30px) scale(1.05);
    }
    66% {
        transform: translate(40px, -60px) scale(0.9);
    }
}

.knowledge-node {
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
        0 0 20px rgba(255, 255, 255, 0.08),
        inset 0 0 10px rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: nodePulse 4s infinite ease-in-out;

    .node-icon {
        width: 18px;
        height: 18px;
        color: rgba(255, 255, 255, 0.5);
    }
}

.node-1 {
    top: 15%;
    left: 20%;
    animation-delay: 0s;
}
.node-2 {
    top: 25%;
    left: 35%;
    animation-delay: 0.5s;
}
.node-3 {
    top: 20%;
    left: 55%;
    animation-delay: 1s;
}
.node-4 {
    top: 35%;
    left: 8%;
    animation-delay: 1.5s;
}
.node-5 {
    top: 45%;
    left: 65%;
    animation-delay: 2s;
}
.node-6 {
    top: 60%;
    left: 20%;
    animation-delay: 2.5s;
}

@keyframes nodePulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.1);
        opacity: 1;
    }
}

.knowledge-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.connection-line {
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 0.3;
    stroke-dasharray: 4 4;
    animation: lineDash 3s infinite linear;
}

@keyframes lineDash {
    0% {
        stroke-dashoffset: 0;
    }
    100% {
        stroke-dashoffset: -24;
    }
}

.header-logo {
    position: fixed;
    top: 28px;
    left: 48px;
    z-index: 100;
    cursor: pointer;
    transition: opacity 0.3s ease;

    .logo-image {
        width: 200px;
        height: auto;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    }

    &:hover {
        opacity: 0.85;
    }
}

.header-links {
    position: fixed;
    top: 24px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 100;
}

.header-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.85);
    font-size: 13px;
    font-family: var(--app-font-family);
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);

    .lang-flag-icon {
        font-size: 16px;
    }
    .link-text {
        font-weight: 500;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.2);
        color: #ffffff;
    }

    svg {
        transition: transform 0.2s ease;
    }
    &:hover svg {
        transform: rotate(180deg);
    }
}

.language-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 170px;
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    z-index: 1000;
    backdrop-filter: blur(20px);
}

.language-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    cursor: pointer;
    font-size: 13px;
    font-family: var(--app-font-family);
    color: rgba(255, 255, 255, 0.85);
    transition: all 0.2s ease;

    .lang-flag {
        font-size: 16px;
        flex-shrink: 0;
    }
    .lang-label {
        flex: 1;
    }
    .check-icon {
        color: #34d399;
        font-weight: 700;
        font-size: 14px;
        flex-shrink: 0;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
    }
    &.active {
        background: rgba(52, 211, 153, 0.12);
        color: #34d399;
    }
}

/* Left Showcase Section */
.showcase-section {
    flex: 0 0 52%;
    display: flex;
    align-items: center;
    padding: 80px 50px 80px 60px;
    box-sizing: border-box;
    position: relative;
}

.showcase-content {
    width: 100%;
    max-width: 640px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
}

.showcase-title {
    font-size: 52px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px 0;
    font-family: var(--app-font-family);
    line-height: 1.15;
    letter-spacing: -1px;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.showcase-subtitle {
    font-size: 20px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 16px 0;
    font-family: var(--app-font-family);
    line-height: 1.5;
}

.showcase-description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 32px 0;
    font-family: var(--app-font-family);
    line-height: 1.7;
    max-width: 520px;
}

.feature-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.tag {
    display: inline-flex;
    align-items: center;
    padding: 8px 18px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 100px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 500;
    font-family: var(--app-font-family);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }
}

/* Right Form Section */
.form-section {
    flex: 0 0 48%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 50px 60px 30px;
    box-sizing: border-box;
    position: relative;
}

.form-panel {
    width: 100%;
    max-width: 440px;
    position: relative;
    z-index: 2;
}

.form-card {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.12);
    width: 100%;
    backdrop-filter: blur(24px);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    }
}

.form-header {
    text-align: center;
    margin-bottom: 32px;
}

.form-title {
    font-size: 26px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 8px 0;
    font-family: var(--app-font-family);
    letter-spacing: -0.3px;
}

.form-welcome {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    font-family: var(--app-font-family);
}

.form-content {
    :deep(.t-form-item__label) {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.75);
        font-weight: 500;
        margin-bottom: 8px;
        font-family: var(--app-font-family);
        display: block;
        text-align: left;
    }

    :deep(.t-input) {
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.2);
        transition: all 0.25s ease;

        &:focus-within {
            border-color: rgba(52, 211, 153, 0.5);
            box-shadow:
                0 0 0 3px rgba(52, 211, 153, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        &:hover {
            border-color: rgba(255, 255, 255, 0.25);
        }

        .t-input__inner {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            background: transparent;
            font-size: 15px;
            font-family: var(--app-font-family);
            color: rgba(255, 255, 255, 0.9);

            &::placeholder {
                color: rgba(255, 255, 255, 0.35);
            }
            &:focus {
                border: none !important;
                box-shadow: none !important;
                outline: none !important;
            }
        }

        .t-input__wrap {
            border: none !important;
            box-shadow: none !important;
        }
    }

    :deep(.t-form-item) {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    :deep(.t-form-item__control) {
        width: 100%;
    }
}

.submit-button {
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    font-family: var(--app-font-family);
    margin: 8px 0 16px 0;
    background: linear-gradient(135deg, #10b981, #059669);
    border: none;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #34d399, #10b981);
        box-shadow: 0 6px 24px rgba(16, 185, 129, 0.4);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
}

.register-cta__divider {
    position: relative;
    text-align: center;
    margin: 4px 0 14px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
    font-family: var(--app-font-family);

    span {
        position: relative;
        z-index: 1;
        padding: 0 12px;
        background: transparent;
    }

    &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
}

.back-to-login {
    margin-top: 4px;

    .back-button {
        height: 46px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 500;
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            border-color: rgba(255, 255, 255, 0.35);
            color: #ffffff;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

@media (max-width: 1024px) {
    .showcase-section {
        display: none;
    }
    .form-section {
        flex: 1;
        padding: 60px 30px;
    }
    .header-logo {
        left: 24px;
        top: 20px;
    }
    .header-links {
        right: 16px;
        top: 16px;
    }
}

@media (max-width: 768px) {
    .form-section {
        padding: 40px 20px;
    }
    .form-card {
        padding: 28px 20px;
    }
    .showcase-title {
        font-size: 36px;
    }
}

.login-features {
    margin-top: 24px;
    padding: 0;

    .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.55);
        font-family: var(--app-font-family);

        &:last-child {
            margin-bottom: 0;
        }

        .feature-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(52, 211, 153, 0.12);
            color: #34d399;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            margin-right: 10px;
            flex-shrink: 0;
        }

        .feature-text {
            line-height: 1.4;
        }
    }
}
</style>
