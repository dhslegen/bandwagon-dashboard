/**
 * 获取使用统计数据
 * GET /api/vps/stats
 */

export default defineEventHandler(async (event) => {
  try {
    // 获取原始数据
    const rawStats = await getRawUsageStats()

    // 如果 rawStats 本身就是 string，必须先转成对象，后续逻辑才能生效
    let stats
    try {
      stats = typeof rawStats === 'string' ? JSON.parse(rawStats) : rawStats
    } catch {
      throw createError({ statusCode: 500, message: '上游数据格式错误，非有效JSON' })
    }

    if (stats && stats.data && Array.isArray(stats.data)) {
      const oneYearAgo = Math.floor(Date.now() / 1000) - 366 * 24 * 60 * 60
      // 明确指定 point 类型，避免使用 any
      stats.data = stats.data.filter((point: { timestamp: number }) => point.timestamp >= oneYearAgo)
    }

    // 明确设置响应头为 JSON
    setResponseHeader(event, 'Content-Type', 'application/json')

    // 手动序列化以去除空格和换行，使响应更紧凑
    return JSON.stringify(stats)
  } catch (error) {
    const err = error as { statusCode?: number; message?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Server Error',
    })
  }
})
