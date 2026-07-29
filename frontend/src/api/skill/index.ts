import { get, post, del, postUpload } from "../../utils/request";

// Skill信息
export interface SkillInfo {
  name: string;
  description: string;
  source?: "preloaded" | "user";
  /** 通过共享空间（组织）共享获得 */
  shared?: boolean;
  /** 仅可查看名称/描述，不可查看详情（如 LDAP 用户通过共享获得） */
  read_only?: boolean;
}

// Skill文件内容
export interface SkillFile {
  name: string;
  content: string;
  size: number;
}

// 用户Skill详情
export interface UserSkillInfo {
  id: string;
  user_id: string;
  tenant_id: number;
  skill_name: string;
  full_name: string;
  description: string;
  ldap_login_name: string;
  is_preloaded: boolean;
  file_count: number;
  total_size: number;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

// Skill格式规范
export interface SkillFormatSpec {
  required_files: string[];
  optional_files: string[];
  name_pattern: string;
  name_max_length: number;
  desc_max_length: number;
  max_file_count: number;
  max_file_size_mb: number;
  skill_md_example: string;
  directory_example: string;
}

// 获取预装Skills列表；skills_available 为 false 表示沙箱未启用，前端应隐藏/禁用 Skills 配置
export function listSkills() {
  return get<{ data: SkillInfo[]; skills_available?: boolean }>('/api/v1/skills');
}

// 获取当前用户可见的所有Skills（预装+自己的）
export function listSkillsForUser() {
  return get<{ data: SkillInfo[]; skills_available?: boolean }>('/api/v1/skills/mine');
}

// 获取当前用户自己创建的Skills列表
export function listUserSkills() {
  return get<{ data: SkillInfo[] }>('/api/v1/skills/user');
}

// 上传创建Skill（zip压缩包方式）
export function uploadSkillZip(zipFile: File, onUploadProgress?: (progressEvent: any) => void) {
  const formData = new FormData();
  formData.append('zip', zipFile);
  return postUpload('/api/v1/skills/upload', formData, onUploadProgress);
}

// 上传创建Skill（多文件方式，兼容旧版）
export function uploadSkill(files: File[], onUploadProgress?: (progressEvent: any) => void) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return postUpload('/api/v1/skills/upload', formData, onUploadProgress);
}

// 删除用户Skill
export function deleteUserSkill(fullName: string) {
  return del(`/api/v1/skills/user/${encodeURIComponent(fullName)}`);
}

// 管理员：获取所有用户Skills
export function adminListAllSkills(ldapLoginName?: string) {
  const params: Record<string, string> = {};
  if (ldapLoginName) {
    params.ldap_login_name = ldapLoginName;
  }
  return get<{ data: UserSkillInfo[] }>('/api/v1/skills/admin/all', { params });
}

// 获取Skill上传格式规范
export function getSkillFormatSpec() {
  return get<{ data: SkillFormatSpec }>('/api/v1/skills/format-spec');
}

// 获取Skill内容（查看所有文件）
export function getSkillContent(fullName: string) {
  return get<{ data: SkillFile[] }>('/api/v1/skills/content/' + encodeURIComponent(fullName));
}

// Skill共享相关类型（按共享空间/组织）
export interface SkillOrgShare {
  id: string;
  skill_name: string;
  organization_id: string;
  organization_name: string;
  created_at: string;
}

// 将预设Skill共享到指定共享空间（组织）
export function shareSkillToOrganization(skillName: string, organizationId: string) {
  return post(`/api/v1/skills/preloaded/${encodeURIComponent(skillName)}/share-org`, { organization_id: organizationId });
}

// 取消Skill与共享空间的共享
export function unshareSkillFromOrganization(skillName: string, organizationId: string) {
  return del(`/api/v1/skills/preloaded/${encodeURIComponent(skillName)}/share-org/${encodeURIComponent(organizationId)}`);
}

// 获取指定Skill已共享到的所有共享空间（含名称）
export function listOrganizationsBySkill(skillName: string) {
  return get<{ data: SkillOrgShare[] }>(`/api/v1/skills/preloaded/${encodeURIComponent(skillName)}/org-shares`);
}

// 可分配技能的共享空间（组织）列表，用于分配技能时的选择器
export interface SkillShareOrganization {
  id: string;
  name: string;
}

export function listSkillShareOrganizations() {
  return get<{ data: SkillShareOrganization[] }>('/api/v1/skills/organizations');
}
