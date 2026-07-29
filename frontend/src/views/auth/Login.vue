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
            <div class="knowledge-node node-7">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            </div>
            <div class="knowledge-node node-8">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </div>
            <div class="knowledge-node node-9">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </div>
            <div class="knowledge-node node-10">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3" />
                    <path
                        d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"
                    />
                </svg>
            </div>
            <div class="knowledge-node node-11">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            </div>
            <div class="knowledge-node node-12">
                <svg class="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    />
                </svg>
            </div>

            <svg class="knowledge-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line class="connection-line line-1" x1="20" y1="15" x2="35" y2="25" />
                <line class="connection-line line-2" x1="35" y1="25" x2="55" y2="20" />
                <line class="connection-line line-3" x1="55" y1="20" x2="85" y2="12" />
                <line class="connection-line line-4" x1="8" y1="35" x2="25" y2="45" />
                <line class="connection-line line-5" x1="25" y1="45" x2="65" y2="48" />
                <line class="connection-line line-6" x1="20" y1="60" x2="60" y2="75" />
                <line class="connection-line line-7" x1="20" y1="15" x2="20" y2="60" />
                <line class="connection-line line-8" x1="55" y1="20" x2="45" y2="50" />
                <line class="connection-line line-9" x1="65" y1="48" x2="90" y2="38" />
                <line class="connection-line line-10" x1="40" y1="70" x2="75" y2="80" />
                <line class="connection-line line-11" x1="35" y1="25" x2="25" y2="45" />
                <line class="connection-line line-12" x1="75" y1="30" x2="65" y2="48" />
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
                    <span class="lang-flag-icon">{{ currentLangOption?.flag }}</span>
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

                <!-- Language Dropdown -->
                <div v-if="showLanguageMenu" class="language-dropdown">
                    <div
                        v-for="lang in languageOptions"
                        :key="lang.value"
                        @click="selectLanguage(lang.value)"
                        class="language-option"
                        :class="{ active: currentLanguage === lang.value }"
                    >
                        <span class="lang-flag">{{ lang.flag }}</span>
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
                <!-- Login Card -->
                <div class="form-card" v-if="!isRegisterMode">
                    <div class="form-header">
                        <h2 class="form-title">{{ $t('auth.login') }}</h2>
                        <p class="form-welcome">{{ $t('auth.subtitle') }}</p>
                        <p v-if="registrationEnabled" class="form-hint">{{ $t('auth.loginHint') }}</p>
                    </div>

                    <div class="form-content">
                        <!-- 管理员登录表单 -->
                        <t-form
                            ref="formRef"
                            :data="formData"
                            :rules="formRules"
                            @submit="handleLogin"
                            layout="vertical"
                        >
                            <t-form-item :label="$t('auth.email')" name="email">
                                <t-input
                                    v-model="formData.email"
                                    :placeholder="$t('auth.emailPlaceholder')"
                                    type="text"
                                    autocomplete="email"
                                    size="large"
                                    :disabled="loading"
                                />
                            </t-form-item>

                            <t-form-item :label="$t('auth.password')" name="password">
                                <t-input
                                    v-model="formData.password"
                                    :placeholder="$t('auth.passwordPlaceholder')"
                                    type="password"
                                    size="large"
                                    :disabled="loading"
                                    @enter="handleLogin"
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

                            <div class="register-cta" v-if="registrationEnabled">
                                <div class="register-cta__divider">
                                    <span>{{ $t('auth.firstTime') }}</span>
                                </div>
                                <t-button
                                    theme="default"
                                    variant="outline"
                                    size="large"
                                    block
                                    class="register-cta__button"
                                    :disabled="loading"
                                    @click="toggleMode"
                                >
                                    {{ $t('auth.createAccount') }}
                                </t-button>
                            </div>

                            <div v-if="oidcEnabled" class="oidc-divider">
                                <span>{{ $t('auth.orContinueWith') }}</span>
                            </div>

                            <t-button
                                v-if="oidcEnabled"
                                theme="default"
                                size="large"
                                block
                                :loading="oidcLoading"
                                :disabled="loading"
                                class="oidc-button"
                                @click="handleOIDCLogin"
                            >
                                {{ oidcLoading ? $t('auth.redirectingToOIDC') : oidcLoginText }}
                            </t-button>
                        </t-form>

                        <!-- LDAP 域登录入口 -->
                        <div class="ldap-login-link">
                            <div class="register-cta__divider">
                                <span>{{ $t('auth.orContinueWith') }}</span>
                            </div>
                            <t-button
                                theme="default"
                                variant="outline"
                                size="large"
                                block
                                :disabled="loading"
                                class="ldap-button"
                                @click="$router.push('/ldap-login')"
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
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                {{ $t('auth.ldapDomainLogin') }}
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

                <!-- Register Card. Renders when the user is in register mode
             AND either self-service registration is enabled OR they
             arrived with a valid share-link token (which bypasses the
             invite_only gate). -->
                <div class="form-card" v-if="isRegisterMode && (registrationEnabled || inviteLookup)">
                    <!-- Share-link banner: shown only when ?token= resolved to a
               real invitation row. Sits above the form header so the
               invitee instantly sees who invited them and into which
               workspace, without bumping the existing register UX. -->
                    <div v-if="inviteLookup" class="invite-banner">
                        <t-icon name="link" class="invite-banner__icon" />
                        <div class="invite-banner__text">
                            <div class="invite-banner__title">
                                {{ $t('inviteRegister.bannerTitle', { tenant: inviteLookup.tenant_name || '' }) }}
                            </div>
                            <div class="invite-banner__hint">
                                {{ $t('inviteRegister.bannerHint') }}
                            </div>
                        </div>
                    </div>
                    <div v-else-if="inviteLookupError" class="invite-banner invite-banner--error">
                        {{ inviteLookupError }}
                    </div>
                    <div class="form-header">
                        <h2 class="form-title">{{ $t('auth.createAccount') }}</h2>
                        <p class="form-subtitle">{{ $t('auth.registerSubtitle') }}</p>
                    </div>

                    <div class="form-content">
                        <t-form
                            ref="registerFormRef"
                            :data="registerData"
                            :rules="registerRules"
                            @submit="handleRegister"
                            layout="vertical"
                        >
                            <t-form-item :label="$t('auth.username')" name="username">
                                <t-input
                                    v-model="registerData.username"
                                    :placeholder="$t('auth.usernamePlaceholder')"
                                    size="large"
                                    :disabled="loading"
                                />
                            </t-form-item>

                            <t-form-item :label="$t('auth.email')" name="email">
                                <t-input
                                    v-model="registerData.email"
                                    :placeholder="$t('auth.emailPlaceholder')"
                                    type="text"
                                    autocomplete="email"
                                    size="large"
                                    :disabled="loading"
                                />
                            </t-form-item>

                            <t-form-item :label="$t('auth.password')" name="password">
                                <t-input
                                    v-model="registerData.password"
                                    :placeholder="$t('auth.passwordPlaceholder')"
                                    type="password"
                                    size="large"
                                    :disabled="loading"
                                />
                            </t-form-item>

                            <t-form-item :label="$t('auth.confirmPassword')" name="confirmPassword">
                                <t-input
                                    v-model="registerData.confirmPassword"
                                    :placeholder="$t('auth.confirmPasswordPlaceholder')"
                                    type="password"
                                    size="large"
                                    :disabled="loading"
                                    @enter="handleRegister"
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
                                {{ loading ? $t('auth.registering') : $t('auth.register') }}
                            </t-button>
                        </t-form>

                        <div class="form-footer">
                            <span>{{ $t('auth.haveAccount') }}</span>
                            <a href="#" @click.prevent="toggleMode" class="link-button">
                                {{ $t('auth.backToLogin') }}
                            </a>
                        </div>

                        <!-- Features list for register -->
                        <div class="login-features">
                            <div class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">{{ $t('platform.independentTenant') }}</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">{{ $t('platform.fullApiAccess') }}</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">{{ $t('platform.knowledgeBaseManagement') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRoleLabel } from '@/composables/useRoleLabel';
import { notifyLoginSuccess } from '@/utils/loginNotify';
import {
    login,
    ldapLogin,
    register,
    getOIDCAuthorizationURL,
    getOIDCConfig,
    autoSetup,
    getAuthConfig,
    userInfoFromApi,
    getInvitationByToken,
    registerByInvite,
    type InviteLookup
} from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t, tm, locale } = useI18n();
const { formatRole, roleIcon } = useRoleLabel();

// Form references
const formRef = ref();
const registerFormRef = ref();

// State management
const loading = ref(false);
const oidcLoading = ref(false);
const isRegisterMode = ref(false);
const showLanguageMenu = ref(false);
const oidcEnabled = ref(false);
const oidcProviderName = ref('');
// registrationEnabled defaults to true so that on first paint the Register
// link is visible; the actual mode is fetched from /auth/config in onMounted.
// In invite_only mode the link/card are hidden.
const registrationEnabled = ref(true);

// invite-link state. When the URL carries ?token=xxx we resolve it to
// the originating tenant + role and switch the form into a "register
// via invitation" mode. The token bypasses the normal invite_only
// gate — possessing it IS the authorisation. Submitting the register
// form with this set hits /auth/register-by-invite (auto-login on
// success) instead of /auth/register.
const inviteToken = ref('');
const inviteLookup = ref<InviteLookup | null>(null);
const inviteLookupError = ref('');
const inviteLookupLoading = ref(false);

// Language options
const languageOptions = [
    { value: 'zh-CN', label: '简体中文', shortLabel: '中文', flag: '🇨🇳' },
    { value: 'en-US', label: 'English', shortLabel: 'EN', flag: '🇺🇸' }
];

const currentLanguage = computed(() => locale.value);
const oidcLoginText = computed(() => {
    if (oidcProviderName.value) {
        return t('auth.oidcLoginWithProvider', { provider: oidcProviderName.value });
    }
    return t('auth.oidcLogin');
});
const currentLangOption = computed(() => languageOptions.find((l) => l.value === currentLanguage.value));

// Login form data
const formData = reactive<{ [key: string]: any }>({
    email: '',
    password: ''
});

// LDAP login mode toggle
// LDAP login form data
const ldapFormData = reactive<{ [key: string]: any }>({
    login_name: '',
    password: ''
});

// LDAP login form validation rules
const ldapFormRules = {
    login_name: [{ required: true, message: '请输入域账户名', type: 'error' }],
    password: [{ required: true, message: '请输入密码', type: 'error' }]
};

const ldapFormRef = ref();

// Register form data
const registerData = reactive<{ [key: string]: any }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

// Login form validation rules
const formRules = computed(() => ({
    email: [
        { required: true, message: t('auth.emailRequired'), type: 'error' },
        { email: true, message: t('auth.emailInvalid'), type: 'error' }
    ],
    password: [
        { required: true, message: t('auth.passwordRequired'), type: 'error' },
        { min: 8, message: t('auth.passwordMinLength'), type: 'error' },
        { max: 32, message: t('auth.passwordMaxLength'), type: 'error' },
        { pattern: /[a-zA-Z]/, message: t('auth.passwordMustContainLetter'), type: 'error' },
        { pattern: /\d/, message: t('auth.passwordMustContainNumber'), type: 'error' }
    ]
}));

// Register form validation rules
const registerRules = computed(() => ({
    username: [
        { required: true, message: t('auth.usernameRequired'), type: 'error' },
        { min: 2, message: t('auth.usernameMinLength'), type: 'error' },
        { max: 20, message: t('auth.usernameMaxLength'), type: 'error' },
        {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: t('auth.usernameInvalid'),
            type: 'error'
        }
    ],
    email: [
        { required: true, message: t('auth.emailRequired'), type: 'error' },
        { email: true, message: t('auth.emailInvalid'), type: 'error' }
    ],
    password: [
        { required: true, message: t('auth.passwordRequired'), type: 'error' },
        { min: 8, message: t('auth.passwordMinLength'), type: 'error' },
        { max: 32, message: t('auth.passwordMaxLength'), type: 'error' },
        { pattern: /[a-zA-Z]/, message: t('auth.passwordMustContainLetter'), type: 'error' },
        { pattern: /\d/, message: t('auth.passwordMustContainNumber'), type: 'error' }
    ],
    confirmPassword: [
        { required: true, message: t('auth.confirmPasswordRequired'), type: 'error' },
        {
            validator: (val: string) => val === registerData.password,
            message: t('auth.passwordMismatch'),
            type: 'error'
        }
    ]
}));

// Toggle login/register mode
const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value;

    Object.keys(registerData).forEach((key) => {
        (registerData as any)[key] = '';
    });
};

// Toggle language menu
const toggleLanguageMenu = () => {
    showLanguageMenu.value = !showLanguageMenu.value;
};

// Select language
const selectLanguage = (lang: string) => {
    locale.value = lang;
    localStorage.setItem('locale', lang);
    showLanguageMenu.value = false;
    MessagePlugin.success(t('language.languageSaved'));
};

// Close language menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-switch')) {
        showLanguageMenu.value = false;
    }
};

// Add click outside listener
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const persistLoginResponse = async (response: any) => {
    // Backend renamed `tenant` to `active_tenant` and added `memberships`
    // when tenant-level RBAC landed (issue #1303). The two are otherwise
    // identical — `active_tenant` is the tenant whose ID is encoded in the
    // JWT, defaulting to the user's home tenant on a fresh login.
    const activeTenant = response.active_tenant || response.tenant;
    if (response.user && activeTenant && response.token) {
        // user.tenant_id must be the user's HOME tenant (the immutable row
        // on the users table); useHomeTenant() and the home-badge logic both
        // assume so. The ACTIVE tenant (which can differ from home when the
        // server honoured a remembered last-active-tenant preference) is
        // expressed separately via setSelectedTenant below.
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
        // If the backend dropped us into a non-home tenant (honoured a
        // remembered "last active tenant" preference), set the override so
        // subsequent requests carry X-Tenant-ID and the UI stays consistent.
        // Otherwise clear any stale override left in localStorage by a
        // previous session for a different account.
        const activeIdNum = Number(activeTenant.id);
        const homeIdNum = Number(homeTenantIdRaw);
        if (Number.isFinite(activeIdNum) && Number.isFinite(homeIdNum) && activeIdNum !== homeIdNum) {
            authStore.setSelectedTenant(activeIdNum, activeTenant.name || null);
        } else {
            authStore.setSelectedTenant(null, null);
        }
    }

    await nextTick();
    router.replace('/platform/knowledge-bases');
};

const getBackendOIDCRedirectURI = () => `${window.location.origin}/api/v1/auth/oidc/callback`;

const loadOIDCConfig = async () => {
    try {
        const response = await getOIDCConfig();
        oidcEnabled.value = !!response.success && !!response.enabled;
        oidcProviderName.value = response.provider_display_name || '';
    } catch {
        oidcEnabled.value = false;
        oidcProviderName.value = '';
    }
};

// loadAuthConfig fetches /auth/config and caches whether self-service
// registration is allowed. Failures fall back to "enabled" so a transient
// network glitch doesn't lock new users out of an open deployment.
const loadAuthConfig = async () => {
    try {
        const response = await getAuthConfig();
        registrationEnabled.value = response.registration_mode !== 'invite_only';
    } catch {
        registrationEnabled.value = true;
    }
};

const handleOIDCLogin = async () => {
    try {
        oidcLoading.value = true;
        const response = await getOIDCAuthorizationURL(getBackendOIDCRedirectURI());
        const authorizationURL = response.authorization_url;

        if (!response.success || !authorizationURL) {
            MessagePlugin.error(response.message || t('auth.oidcLoginFailed'));
            return;
        }

        window.location.href = authorizationURL;
    } catch (error: any) {
        console.error('OIDC 登录跳转失败:', error);
        MessagePlugin.error(error.message || t('auth.oidcLoginFailed'));
    } finally {
        oidcLoading.value = false;
    }
};

// Handle login
const handleLogin = async () => {
    try {
        const valid = await formRef.value?.validate();
        if (valid !== true) return;

        loading.value = true;

        const response = await login({
            email: formData.email,
            password: formData.password
        });

        if (response.success) {
            await persistLoginResponse(response);
            notifyLoginSuccess(response, t, tm, formatRole, roleIcon);
        } else {
            MessagePlugin.error(response.message || t('auth.loginError'));
        }
    } catch (error: any) {
        console.error('登录错误:', error);
        MessagePlugin.error(error.message || t('auth.loginErrorRetry'));
    } finally {
        loading.value = false;
    }
};

// LDAP login handler
const handleLdapLogin = async () => {
    try {
        const valid = await ldapFormRef.value?.validate();
        if (valid !== true) return;

        loading.value = true;

        const response = await ldapLogin({
            login_name: ldapFormData.login_name,
            password: ldapFormData.password
        });

        if (response.success) {
            await persistLoginResponse(response);
            notifyLoginSuccess(response, t, tm, formatRole, roleIcon);
        } else {
            MessagePlugin.error(response.message || t('auth.ldapLoginFailed'));
        }
    } catch (error: any) {
        console.error('LDAP登录错误:', error);
        MessagePlugin.error(error.message || t('auth.loginErrorRetry'));
    } finally {
        loading.value = false;
    }
};

// Handle registration. Dispatches based on whether the user arrived
// with a share-link token: with token -> register-by-invite (auto-
// login on success); without -> the normal self-service register
// (drops back to the login form for the user to sign in).
const handleRegister = async () => {
    try {
        const valid = await registerFormRef.value?.validate();
        if (valid !== true) return;

        loading.value = true;

        if (inviteToken.value) {
            const response = await registerByInvite({
                token: inviteToken.value,
                username: registerData.username,
                email: registerData.email,
                password: registerData.password
            });
            if (!response.success) {
                MessagePlugin.error(response.message || t('auth.registerFailed'));
                return;
            }
            MessagePlugin.success(t('auth.registerSuccess'));
            // register-by-invite returns the same shape as login (token +
            // active_tenant + memberships), so reuse the login persistence
            // path — same store writes, same redirect target.
            await persistLoginResponse(response);
            return;
        }

        const response = await register({
            username: registerData.username,
            email: registerData.email,
            password: registerData.password
        });

        if (response.success) {
            MessagePlugin.success(t('auth.registerSuccess'));

            // Switch to login mode and fill in email
            isRegisterMode.value = false;
            formData.email = registerData.email;

            // Clear register form
            Object.keys(registerData).forEach((key) => {
                (registerData as any)[key] = '';
            });
        } else {
            MessagePlugin.error(response.message || t('auth.registerFailed'));
        }
    } catch (error: any) {
        console.error('注册错误:', error);
        MessagePlugin.error(error.message || t('auth.registerError'));
    } finally {
        loading.value = false;
    }
};

// Check if already logged in; for lite edition, attempt transparent auto-setup
onMounted(async () => {
    // Share-link landing: ?token=xxx switches the form into invite-
    // register mode before any other auto-flow (logged-in redirect /
    // auto-setup / OIDC) gets a chance to redirect. Resolution failure
    // surfaces inline; the user can still log in normally if they
    // already have an account. We check this BEFORE the isLoggedIn
    // redirect so an existing session doesn't bounce the user to
    // /platform (and possibly back to /login if the session is stale),
    // dropping the invite token along the way.
    const tokenFromQuery = String(route.query.token || '').trim();
    if (tokenFromQuery) {
        inviteToken.value = tokenFromQuery;
        inviteLookupLoading.value = true;
        try {
            const resp = await getInvitationByToken(tokenFromQuery);
            if (resp.success && resp.data) {
                inviteLookup.value = resp.data;
                // Token bypasses invite_only — show the register card even
                // when self-service registration is otherwise disabled.
                registrationEnabled.value = true;
                isRegisterMode.value = true;
            } else {
                inviteLookupError.value = resp.message || t('inviteRegister.invalidBody');
            }
        } catch {
            inviteLookupError.value = t('inviteRegister.invalidBody');
        } finally {
            inviteLookupLoading.value = false;
        }
        // Don't run auto-setup when the user came in via an invite link —
        // they're explicitly trying to register, not bootstrap a Lite
        // single-user instance.
        loadOIDCConfig();
        return;
    }

    if (authStore.isLoggedIn) {
        router.replace('/platform/knowledge-bases');
        return;
    }

    const AUTO_SETUP_FAILED_KEY = 'cloudclow_auto_setup_failed';
    if (localStorage.getItem(AUTO_SETUP_FAILED_KEY) !== 'true') {
        try {
            const response = await autoSetup();
            if (response.success) {
                authStore.setLiteMode(true);
                await persistLoginResponse(response);
                return;
            } else {
                localStorage.setItem(AUTO_SETUP_FAILED_KEY, 'true');
            }
        } catch {
            localStorage.setItem(AUTO_SETUP_FAILED_KEY, 'true');
        }
    }

    loadOIDCConfig();
    loadAuthConfig();
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

/* Floating glass orbs for ambient atmosphere */
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
    animation: nodePulse 6s infinite ease-in-out;
    will-change: transform, opacity;
    backdrop-filter: blur(4px);
}

.node-icon {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.7);
}

.node-1 {
    top: 12%;
    left: 18%;
    animation-delay: 0s;
}
.node-2 {
    top: 22%;
    left: 32%;
    animation-delay: 0.8s;
}
.node-3 {
    top: 18%;
    left: 52%;
    animation-delay: 1.6s;
}
.node-4 {
    top: 28%;
    left: 72%;
    animation-delay: 2.4s;
}
.node-5 {
    top: 42%;
    left: 22%;
    animation-delay: 3.2s;
}
.node-6 {
    top: 48%;
    left: 42%;
    animation-delay: 4s;
}
.node-7 {
    top: 46%;
    left: 62%;
    animation-delay: 1.2s;
}
.node-8 {
    top: 58%;
    left: 18%;
    animation-delay: 2s;
}
.node-9 {
    top: 10%;
    right: 18%;
    animation-delay: 2.8s;
}
.node-10 {
    top: 36%;
    right: 12%;
    animation-delay: 3.6s;
}
.node-11 {
    top: 68%;
    left: 38%;
    animation-delay: 0.4s;
}
.node-12 {
    top: 62%;
    left: 78%;
    animation-delay: 1.4s;
}

@keyframes nodePulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.4;
    }
    50% {
        transform: scale(1.12);
        opacity: 0.75;
    }
}

.knowledge-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
}

.connection-line {
    stroke: rgba(255, 255, 255, 0.35);
    stroke-width: 1;
    stroke-dasharray: 8, 4;
    stroke-linecap: round;
    animation: lineFlow 12s infinite linear;
    will-change: stroke-dashoffset;
}

.line-1 {
    animation-delay: 0s;
}
.line-2 {
    animation-delay: 0.6s;
}
.line-3 {
    animation-delay: 1.2s;
}
.line-4 {
    animation-delay: 0.4s;
}
.line-5 {
    animation-delay: 1s;
}
.line-6 {
    animation-delay: 1.6s;
}
.line-7 {
    animation-delay: 2.2s;
}
.line-8 {
    animation-delay: 2.8s;
}
.line-9 {
    animation-delay: 0.3s;
}
.line-10 {
    animation-delay: 0.9s;
}
.line-11 {
    animation-delay: 1.5s;
}
.line-12 {
    animation-delay: 2.1s;
}

@keyframes lineFlow {
    0% {
        stroke-dashoffset: 0;
    }
    100% {
        stroke-dashoffset: -24;
    }
}

@media (prefers-reduced-motion: reduce) {
    .knowledge-node,
    .animated-bg::before,
    .animated-bg::after {
        animation: none;
        opacity: 0.5;
    }
    .connection-line {
        animation: none;
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
    margin-bottom: 48px;
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
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--app-font-family);
    letter-spacing: 0.2px;
    cursor: pointer;
    position: relative;
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;

    svg {
        flex-shrink: 0;
    }

    .link-text {
        line-height: 1;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;
        transform: translateY(-1px);
    }
}

.language-switch {
    position: relative;

    button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        transition: all 0.3s ease;

        .lang-flag-icon {
            font-size: 16px;
            line-height: 1;
            flex-shrink: 0;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }

        svg:last-child {
            margin-left: 2px;
            flex-shrink: 0;
        }
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

.invite-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    margin-bottom: 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
}

.invite-banner__icon {
    margin-top: 2px;
    font-size: 18px;
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.6);
}

.invite-banner__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.invite-banner__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: #ffffff;
}

.invite-banner__hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.5;
}

.invite-banner--error {
    background: rgba(220, 38, 38, 0.1);
    border-color: rgba(220, 38, 38, 0.25);
    color: #f87171;
    font-size: 13px;
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

.form-hint {
    margin: 12px 0 0;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.2);
    color: #34d399;
    font-size: 13px;
    line-height: 1.5;
    font-family: var(--app-font-family);
}

/* 注册入口 */
.register-cta {
    margin-top: 8px;

    &__divider {
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

    &__button {
        height: 46px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 500;
        border-color: rgba(255, 255, 255, 0.25);
        color: rgba(255, 255, 255, 0.9);
        background: rgba(255, 255, 255, 0.06);

        &:hover {
            border-color: rgba(255, 255, 255, 0.4);
            color: #ffffff;
            background: rgba(255, 255, 255, 0.12);
        }
    }
}

.form-subtitle {
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

.oidc-divider {
    position: relative;
    margin: 4px 0 6px;
    text-align: center;
    color: rgba(255, 255, 255, 0.35);
    font-size: 12px;

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

.oidc-button {
    height: 46px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.85);

    &:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
        color: #ffffff;
    }
}

.ldap-login-link {
    margin-top: 4px;

    .ldap-button {
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

.form-footer {
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    font-family: var(--app-font-family);
    margin-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .link-button {
        color: #34d399;
        text-decoration: none;
        margin-left: 4px;
        font-weight: 500;
        transition: all 0.2s;

        &:hover {
            color: #6ee7b7;
            text-decoration: underline;
        }
    }
}

.login-form-footer {
    border-bottom: none;
    padding-bottom: 8px;
    margin-top: 12px;
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

/* Responsive Design */
@media (max-width: 1024px) {
    .knowledge-node:nth-of-type(n + 13) {
        display: none;
    }

    .connection-line:nth-of-type(n + 13) {
        display: none;
    }

    .showcase-subtitle {
        font-size: 32px;
    }

    .showcase-description {
        font-size: 15px;
    }

    .header-logo {
        top: 24px;
        left: 32px;

        .logo-image {
            width: 110px;
        }
    }

    .header-links {
        top: 20px;
        right: 20px;
        gap: 8px;

        .link-text {
            display: none;
        }

        .header-link {
            padding: 10px;
            gap: 0;
        }
    }
}

@media (max-width: 768px) {
    .login-layout {
        flex-direction: column;
        background: linear-gradient(180deg, #0f172a 0%, #134e4a 50%, #0f766e 100%);
    }

    .knowledge-node:nth-of-type(n + 9) {
        display: none;
    }

    .connection-line:nth-of-type(n + 9) {
        display: none;
    }

    .showcase-section {
        flex: 0 0 auto;
        min-height: auto;
        padding: 80px 28px 32px;
        align-items: flex-start;
    }

    .showcase-content {
        max-width: 100%;
    }

    .header-logo {
        top: 20px;
        left: 24px;

        .logo-image {
            width: 90px;
        }
    }

    .showcase-subtitle {
        font-size: 28px;
        margin-bottom: 12px;
    }

    .showcase-description {
        margin-bottom: 24px;
    }

    .feature-tags {
        margin-bottom: 28px;
    }

    .carousel-container {
        margin-top: 0;
        max-width: 100%;
    }

    .form-section {
        flex: 0 0 auto;
        padding: 20px 24px 40px;
    }

    .header-links {
        top: 16px;
        right: 16px;
        gap: 8px;

        .link-text {
            display: inline;
        }

        .header-link {
            padding: 8px 12px;
            font-size: 12px;
        }
    }

    .form-card {
        padding: 32px 24px;
        border-radius: 20px;
    }

    .form-title {
        font-size: 22px;
    }
}

@media (max-width: 480px) {
    .animated-bg {
        display: none;
    }

    .showcase-section {
        padding: 72px 20px 24px;
    }

    .header-logo {
        top: 16px;
        left: 18px;

        .logo-image {
            width: 80px;
        }
    }

    .showcase-subtitle {
        font-size: 24px;
    }

    .showcase-description {
        font-size: 14px;
    }

    .tag {
        font-size: 12px;
        padding: 6px 14px;
    }

    .form-section {
        padding: 16px 20px 32px;
    }

    .header-links {
        top: 14px;
        right: 14px;
        gap: 6px;
        flex-wrap: wrap;

        .header-link {
            padding: 7px 10px;
            font-size: 11px;
        }
    }

    .form-card {
        padding: 28px 20px;
        border-radius: 18px;
    }

    .form-header {
        margin-bottom: 24px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .knowledge-node,
    .connection-line {
        animation: none !important;
        transition: none !important;
    }

    .animated-bg {
        display: none;
    }
}
</style>

<style lang="less">
html[theme-mode='dark'] {
    .login-layout {
        background:
            radial-gradient(ellipse at 10% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 60%),
            linear-gradient(135deg, #0a0f1a 0%, #141b2d 25%, #0f3d3e 55%, #0a5c56 80%, #0a4a46 100%);
    }

    .knowledge-node {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.06);
    }

    .connection-line {
        stroke: rgba(255, 255, 255, 0.2);
    }

    .header-logo .logo-image {
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }

    .header-link {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);

        &:hover {
            background: rgba(255, 255, 255, 0.15);
        }
    }

    .language-switch button {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);

        &:hover {
            background: rgba(255, 255, 255, 0.15);
        }
    }

    .language-dropdown {
        background: rgba(15, 23, 42, 0.98) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5) !important;
    }

    .tag {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .form-card {
        background: rgba(15, 23, 42, 0.6) !important;
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
    }

    .register-cta__divider span {
        background: transparent;
    }

    .form-content .t-input {
        background: rgba(0, 0, 0, 0.25) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;

        &:hover {
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        &:focus-within {
            border-color: rgba(52, 211, 153, 0.4) !important;
            box-shadow:
                0 0 0 3px rgba(52, 211, 153, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
        }
    }

    .screenshot-swiper .swiper-pagination-bullet-active {
        background: #ffffff !important;
    }

    .login-features .feature-icon {
        background: rgba(52, 211, 153, 0.1);
    }
}
</style>
