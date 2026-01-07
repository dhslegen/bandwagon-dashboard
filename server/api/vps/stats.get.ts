/**
 * 获取使用统计数据
 * GET /api/vps/stats
 */

export default defineEventHandler(async () => {
  try {
    const stats = await getRawUsageStats()
    return stats
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode || 500
        : 500

    const statusMessage =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || '获取使用统计失败'
        : '获取使用统计失败'

    throw createError({ statusCode, statusMessage })
  }
})
