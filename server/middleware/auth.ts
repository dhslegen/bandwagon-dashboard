/**
 * 认证中间件
 * 保护需要登录才能访问的 API 路由
 */

export default defineEventHandler(async (event) => {
  // 允许的公开路径
  const publicPaths = ['/api/auth/login', '/api/auth/logout', '/api/auth/session']

  // 检查是否是 API 请求
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) {
    return
  }

  // 公开路径不需要认证
  if (publicPaths.includes(path)) {
    return
  }

  // 验证会话
  const session = await getUserSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权，请先登录',
    })
  }

  // 会话有效，继续处理请求
})
