/**
 * 搬瓦工 API 客户端
 * 封装所有 API 调用，确保密钥安全
 */

import type {
  ServiceInfo,
  LiveServiceInfo,
  ControlResponse,
  SnapshotListResponse,
  RawUsageStatsResponse,
  AuditLogResponse,
} from '../../app/types/bwg'

const BWG_API_BASE = 'https://api.64clouds.com/v1'

// API 参数类型
type ApiParams = Record<string, string | number | boolean | undefined | null>

/**
 * 构建 API URL
 */
function buildApiUrl(endpoint: string, params: ApiParams = {}): string {
  const config = useRuntimeConfig()
  const url = new URL(`${BWG_API_BASE}/${endpoint}`)

  // 添加 VEID 和 API Key
  url.searchParams.set('veid', config.bwg.veid)
  url.searchParams.set('api_key', config.bwg.apiKey)

  // 添加其他参数
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

/**
 * 发起 API 请求
 */
async function apiRequest<T>(endpoint: string, params: ApiParams = {}): Promise<T> {
  const url = buildApiUrl(endpoint, params)

  try {
    const response = (await $fetch<T>(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bandwagon-Dashboard/1.0',
      },
    })) as T

    return response
  } catch (error: unknown) {
    console.error('[BWG API] 请求失败:', error)

    // 类型守卫：检查错误对象是否有 statusCode 和 statusMessage
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode || 500
        : 500

    const statusMessage =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || '搬瓦工 API 请求失败'
        : '搬瓦工 API 请求失败'

    throw createError({
      statusCode,
      statusMessage,
    })
  }
}

/**
 * 获取 VPS 基本信息
 */
export async function getServiceInfo(): Promise<ServiceInfo> {
  return apiRequest<ServiceInfo>('getServiceInfo')
}

/**
 * 获取 VPS 实时状态
 */
export async function getLiveServiceInfo(): Promise<LiveServiceInfo> {
  return apiRequest<LiveServiceInfo>('getLiveServiceInfo')
}

/**
 * 启动 VPS
 */
export async function startVps(): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('start')
}

/**
 * 停止 VPS
 */
export async function stopVps(): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('stop')
}

/**
 * 重启 VPS
 */
export async function restartVps(): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('restart')
}

/**
 * 强制停止 VPS
 */
export async function killVps(): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('kill')
}

/**
 * 获取快照列表
 */
export async function getSnapshotList(): Promise<SnapshotListResponse> {
  return apiRequest<SnapshotListResponse>('snapshot/list')
}

/**
 * 创建快照
 */
export async function createSnapshot(description?: string): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('snapshot/create', { description })
}

/**
 * 删除快照
 */
export async function deleteSnapshot(fileName: string): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('snapshot/delete', { snapshot: fileName })
}

/**
 * 恢复快照
 */
export async function restoreSnapshot(fileName: string): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('snapshot/restore', { snapshot: fileName })
}

/**
 * 获取使用统计数据
 */
export async function getRawUsageStats(): Promise<RawUsageStatsResponse> {
  return apiRequest<RawUsageStatsResponse>('getRawUsageStats')
}

/**
 * 获取审计日志
 */
export async function getAuditLog(): Promise<AuditLogResponse> {
  return apiRequest<AuditLogResponse>('getAuditLog')
}
