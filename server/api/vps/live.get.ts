/**
 * 获取 VPS 实时状态
 * GET /api/vps/live
 */

export default defineEventHandler(async (event) => {
  try {
    const liveInfo = await getLiveServiceInfo()

    // 明确设置响应头为 JSON
    setResponseHeader(event, 'Content-Type', 'application/json')

    return liveInfo
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode || 500
        : 500

    const statusMessage =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || '获取 VPS 实时状态失败'
        : '获取 VPS 实时状态失败'

    throw createError({ statusCode, statusMessage })
  }
})
