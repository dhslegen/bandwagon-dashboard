/**
 * VPS 控制操作
 * POST /api/vps/control
 * Body: { action: 'start' | 'stop' | 'restart' | 'kill' }
 */

export default defineEventHandler(async (event) => {
  const { action } = await readBody(event)

  if (!['start', 'stop', 'restart', 'kill'].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的操作类型',
    })
  }

  try {
    let result

    switch (action) {
      case 'start':
        result = await startVps()
        break
      case 'stop':
        result = await stopVps()
        break
      case 'restart':
        result = await restartVps()
        break
      case 'kill':
        result = await killVps()
        break
    }

    return result
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode || 500
        : 500

    const statusMessage =
      typeof error === 'object' && error !== null && 'statusMessage' in error
        ? (error as { statusMessage?: string }).statusMessage || `执行 ${action} 操作失败`
        : `执行 ${action} 操作失败`

    throw createError({ statusCode, statusMessage })
  }
})
