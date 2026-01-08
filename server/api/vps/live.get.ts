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

    const message =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || '获取 VPS 实时状态失败'
        : typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : '获取 VPS 实时状态失败'

    throw createError({ statusCode, message })
  }
})
