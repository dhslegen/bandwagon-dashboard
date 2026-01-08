/**
 * 获取使用统计数据
 * GET /api/vps/stats
 */

export default defineEventHandler(async (event) => {
  try {
    const stats = await getRawUsageStats()

    // 明确设置响应头为 JSON
    setResponseHeader(event, 'Content-Type', 'application/json')

    return stats
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode || 500
        : 500

    const message =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || '获取使用统计失败'
        : typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : '获取使用统计失败'

    throw createError({ statusCode, message })
  }
})
