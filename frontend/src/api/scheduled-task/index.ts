import { get, post, put, del } from "../../utils/request";

// 调度类型
export type ScheduleType = 'cron' | 'interval' | 'once' | 'daily' | 'weekly' | 'monthly';

// 定时任务状态
export type ScheduledTaskStatus = 'active' | 'paused' | 'disabled';

// 执行状态
export type ExecStatus = 'pending' | 'running' | 'success' | 'failed' | 'timeout' | 'rate_limit';

// 执行过程步骤
export interface TaskProcessStep {
  type: 'thought' | 'tool_call' | 'tool_result' | 'reference';
  content: string;
  tool_name?: string;
  hint?: string;
  success?: boolean;
  iteration: number;
  timestamp: number;
  data?: any;
}

// 定时任务接口
export interface ScheduledTask {
  id: string;
  tenant_id: number;
  name: string;
  description: string;
  agent_id: string;
  prompt: string;
  schedule_type: ScheduleType;
  cron_expr: string;
  interval_minutes: number;
  run_once_at: string | null;
  schedule_time: string;
  schedule_day_of_week: number;
  schedule_day_of_month: number;
  status: ScheduledTaskStatus;
  timeout_minutes: number;
  enable_sandbox: boolean;
  max_retries: number;
  web_search_enabled: boolean;
  selected_skills: string;
  last_run_at: string | null;
  last_run_status: string;
  last_run_result: string;
  next_run_at: string | null;
  success_count: number;
  failure_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  // 回填字段
  agent_name?: string;
  creator_name?: string;
}

// 执行日志接口
export interface TaskExecution {
  id: string;
  tenant_id: number;
  task_id: string;
  status: ExecStatus;
  result: string;
  error: string;
  duration_ms: number;
  process_data: string;
  session_id: string;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  task_name?: string;
}

// 统计接口
export interface ScheduledTaskStats {
  total_tasks: number;
  active_tasks: number;
  total_execs: number;
  success_execs: number;
  failed_execs: number;
  concurrent_now: number;
}

// 限流配置
export interface RateLimiterConfig {
  max_concurrent: number;
  max_per_user: number;
}

// 创建请求
export interface CreateScheduledTaskRequest {
  name: string;
  description?: string;
  agent_id: string;
  prompt: string;
  schedule_type: ScheduleType;
  cron_expr?: string;
  interval_minutes?: number;
  run_once_at?: string;
  schedule_time?: string;
  schedule_day_of_week?: number;
  schedule_day_of_month?: number;
  timeout_minutes?: number;
  enable_sandbox?: boolean;
  max_retries?: number;
  web_search_enabled?: boolean;
  selected_skills?: string[];
}

// 更新请求
export interface UpdateScheduledTaskRequest {
  name?: string;
  description?: string;
  agent_id?: string;
  prompt?: string;
  schedule_type?: ScheduleType;
  cron_expr?: string;
  interval_minutes?: number;
  run_once_at?: string;
  schedule_time?: string;
  schedule_day_of_week?: number;
  schedule_day_of_month?: number;
  timeout_minutes?: number;
  enable_sandbox?: boolean;
  max_retries?: number;
  status?: ScheduledTaskStatus;
  web_search_enabled?: boolean;
  selected_skills?: string[];
}

// API 函数

export function listScheduledTasks() {
  return get("/api/v1/scheduled-tasks");
}

export function getScheduledTask(id: string) {
  return get(`/api/v1/scheduled-tasks/${id}`);
}

export function createScheduledTask(data: CreateScheduledTaskRequest) {
  return post("/api/v1/scheduled-tasks", data);
}

export function updateScheduledTask(id: string, data: UpdateScheduledTaskRequest) {
  return put(`/api/v1/scheduled-tasks/${id}`, data);
}

export function deleteScheduledTask(id: string) {
  return del(`/api/v1/scheduled-tasks/${id}`);
}

export function toggleScheduledTask(id: string) {
  return post(`/api/v1/scheduled-tasks/${id}/toggle`);
}

export function triggerScheduledTask(id: string) {
  return post(`/api/v1/scheduled-tasks/${id}/trigger`);
}

export function listTaskExecutions(id: string, page = 1, pageSize = 20) {
  return get(`/api/v1/scheduled-tasks/${id}/executions?page=${page}&page_size=${pageSize}`);
}

export function getScheduledTaskStats() {
  return get("/api/v1/scheduled-tasks/stats");
}

export function getRateLimiterConfig() {
  return get("/api/v1/scheduled-tasks/rate-limiter");
}
