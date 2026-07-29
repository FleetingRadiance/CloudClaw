import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export interface DocumentPreviewState {
  fileName: string
  fileType: string
  fileUrl: string
  previewUrl: string
  fileSize?: number
}

export const useUIStore = defineStore('ui', {
  state: () => ({
    showSettingsModal: false,
    showKBEditorModal: false,
    kbEditorMode: 'create' as 'create' | 'edit',
    currentKBId: null as string | null,
    kbEditorType: 'document' as 'document' | 'faq',
    // 当前选中的分类ID，用于文件上传时传递
    selectedTagId: '__untagged__' as string,
    kbEditorInitialSection: null as string | null,
    settingsInitialSection: null as string | null,
    settingsInitialSubSection: null as string | null,
    manualEditorVisible: false,
    manualEditorMode: 'create' as 'create' | 'edit',
    manualEditorKBId: null as string | null,
    manualEditorKnowledgeId: null as string | null,
    manualEditorInitialTitle: '',
    manualEditorInitialContent: '',
    manualEditorInitialStatus: 'draft' as 'draft' | 'publish',
    manualEditorOnSuccess: null as null | ((payload: { kbId: string; knowledgeId: string; status: 'draft' | 'publish' }) => void),
    sidebarCollapsed: localStorage.getItem('sidebar_collapsed') === 'true',
    // 豆包式分栏预览：点击文档卡片后，右侧展开预览面板，同时自动收起左侧菜单
    documentPreviewVisible: false,
    documentPreviewData: null as DocumentPreviewState | null
  }),

  actions: {
    openSettings(section?: string, subSection?: string) {
      // LDAP 用户不允许打开设置页面
      const authStore = useAuthStore()
      if (authStore.user?.user_type === 'ldap_user') {
        return
      }
      this.settingsInitialSection = section || null
      this.settingsInitialSubSection = subSection || null
      this.showSettingsModal = true
    },

    closeSettings() {
      this.showSettingsModal = false
      this.settingsInitialSection = null
      this.settingsInitialSubSection = null
    },

    toggleSettings() {
      // LDAP 用户不允许打开设置页面
      const authStore = useAuthStore()
      if (authStore.user?.user_type === 'ldap_user') {
        return
      }
      this.showSettingsModal = !this.showSettingsModal
    },

    openKBSettings(kbId: string, initialSection?: string) {
      this.currentKBId = kbId
      this.kbEditorMode = 'edit'
       this.kbEditorType = 'document'
      this.kbEditorInitialSection = initialSection || null
      this.showKBEditorModal = true
    },

    openEditKB(kbId: string, initialSection?: string) {
      this.openKBSettings(kbId, initialSection)
    },

    openCreateKB(type: 'document' | 'faq' = 'document') {
      this.currentKBId = null
      this.kbEditorMode = 'create'
      this.kbEditorType = type
      this.kbEditorInitialSection = null
      this.showKBEditorModal = true
    },

    closeKBEditor() {
      this.showKBEditorModal = false
      this.currentKBId = null
      this.kbEditorInitialSection = null
      this.kbEditorType = 'document'
    },

    openManualEditor(options: {
      mode?: 'create' | 'edit'
      kbId?: string | null
      knowledgeId?: string | null
      title?: string
      content?: string
      status?: 'draft' | 'publish'
      onSuccess?: (payload: { kbId: string; knowledgeId: string; status: 'draft' | 'publish' }) => void
    } = {}) {
      this.manualEditorMode = options.mode || 'create'
      this.manualEditorKBId = options.kbId ?? null
      this.manualEditorKnowledgeId = options.knowledgeId ?? null
      this.manualEditorInitialTitle = options.title || ''
      this.manualEditorInitialContent = options.content || ''
      this.manualEditorInitialStatus = options.status || 'draft'
      this.manualEditorOnSuccess = options.onSuccess || null
      this.manualEditorVisible = true
    },

    closeManualEditor() {
      this.manualEditorVisible = false
      this.manualEditorKnowledgeId = null
      this.manualEditorInitialContent = ''
      this.manualEditorInitialTitle = ''
      this.manualEditorInitialStatus = 'draft'
      this.manualEditorOnSuccess = null
    },

    notifyManualEditorSuccess(payload: { kbId: string; knowledgeId: string; status: 'draft' | 'publish' }) {
      if (typeof this.manualEditorOnSuccess === 'function') {
        try {
          this.manualEditorOnSuccess(payload)
        } catch (err) {
          console.error('Manual editor success callback error:', err)
        }
      }
      this.manualEditorOnSuccess = null
    },

    // 设置当前选中的分类ID
    setSelectedTagId(tagId: string) {
      this.selectedTagId = tagId
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebar_collapsed', String(this.sidebarCollapsed))
    },

    collapseSidebar() {
      this.sidebarCollapsed = true
      localStorage.setItem('sidebar_collapsed', 'true')
    },

    expandSidebar() {
      this.sidebarCollapsed = false
      localStorage.setItem('sidebar_collapsed', 'false')
    },

    // 豆包式分栏预览：打开文档预览面板，自动收起左侧菜单以腾出空间
    openDocumentPreview(data: DocumentPreviewState) {
      this.documentPreviewData = data
      this.documentPreviewVisible = true
      this.collapseSidebar()
    },

    closeDocumentPreview() {
      this.documentPreviewVisible = false
      this.documentPreviewData = null
    }
  }
})

