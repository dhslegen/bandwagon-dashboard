/**
 * 搬瓦工 API 类型定义
 */

// VPS 基本信息
export interface ServiceInfo {
  vm_type: 'kvm' | 'ovz'
  hostname: string
  node_alias: string
  node_location: string
  location_ipv6_ready: boolean
  plan: string
  plan_disk: number // 字节
  plan_ram: number // 字节
  plan_swap: number // 字节
  plan_monthly_data: number // 字节
  os: string
  email: string
  data_counter: number // 已使用流量（字节）
  monthly_data_multiplier: number // 流量系数
  data_next_reset: number // Unix 时间戳
  ip_addresses: string[]
  private_ip_addresses?: string[]
  rdns_api_available: boolean
  ptr: Record<string, string>
  suspended: boolean
  policy_violation: boolean
  suspension_count: number
  total_abuse_points: number
  max_abuse_points: number
  error: number
}

// VPS 实时状态（KVM）
export interface LiveServiceInfo extends ServiceInfo {
  ve_status: 'Starting' | 'Running' | 'Stopped'
  ve_mac1: string
  ve_used_disk_space_b: number
  ve_disk_quota_gb: number
  is_cpu_throttled: boolean
  is_disk_throttled: boolean
  ssh_port?: number
  live_hostname?: string
  load_average?: string
  mem_available_kb?: number
  swap_total_kb?: number
  swap_available_kb?: number
  screendump_png_base64?: string
}

// API 响应基础类型
export interface BwgApiResponse {
  error: number
  message?: string
}

// 控制操作响应（与基础响应相同）
export type ControlResponse = BwgApiResponse

// 快照列表项
export interface Snapshot {
  fileName: string
  os: string
  description: string
  size: number
  md5: string
  sticky: boolean
  purgesIn: number
  downloadLink: string
  downloadLinkSSL: string
}

// 快照列表响应
export interface SnapshotListResponse extends BwgApiResponse {
  snapshots: Snapshot[]
}

// 使用统计数据点
export interface UsageDataPoint {
  timestamp: number
  network_in_bytes: number
  network_out_bytes: number
  disk_read_bytes?: number
  disk_write_bytes?: number
  cpu_usage?: number
}

// 使用统计响应
export interface RawUsageStatsResponse extends BwgApiResponse {
  data: UsageDataPoint[]
}

// 审计日志项
export interface AuditLogEntry {
  timestamp: number
  action: string
  user: string
  ip: string
  details?: string
}

// 审计日志响应
export interface AuditLogResponse extends BwgApiResponse {
  log: AuditLogEntry[]
}
