/**
 * 获取 VPS 基本信息
 * GET /api/vps/info
 */

export default defineEventHandler(async (event) => {
  try {
    const info = await getServiceInfo()

    // 明确设置响应头为 JSON
    setResponseHeader(event, 'Content-Type', 'application/json')

    return info
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode || 500
        : 500

    const message =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || '获取 VPS 信息失败'
        : typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : '获取 VPS 信息失败'

    throw createError({ statusCode, message })
  }
})
