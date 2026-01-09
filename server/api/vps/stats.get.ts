/**
 * 获取使用统计数据
 * GET /api/vps/stats
 */

export default defineEventHandler(async (event) => {
  try {
    // 获取原始数据
    const rawStats = await getRawUsageStats()

    // 明确设置响应头为 JSON
    setResponseHeader(event, 'Content-Type', 'application/json')

    return rawStats
  } catch (error) {
    const err = error as { statusCode?: number; message?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Server Error',
    })
  }
})
