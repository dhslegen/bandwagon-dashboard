/**
 * 登出 API
 * POST /api/auth/logout
 */

export default defineEventHandler(async (event) => {
  // 清除用户会话
  await clearUserSession(event)

  return {
    success: true,
    message: '登出成功',
  }
})
