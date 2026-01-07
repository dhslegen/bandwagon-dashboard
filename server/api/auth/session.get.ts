/**
 * 获取当前会话信息
 * GET /api/auth/session
 */

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // 如果没有 session 或没有 user，返回 null 表示未登录
  if (!session || !session.user) {
    return {
      user: null,
      loggedInAt: null,
    }
  }

  return {
    user: session.user,
    loggedInAt: session.loggedInAt,
  }
})
