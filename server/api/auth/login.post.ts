/**
 * 登录 API
 * POST /api/auth/login
 */

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const config = useRuntimeConfig()

  // 验证用户名和密码
  if (username === config.auth.username && password === config.auth.password) {
    // 设置用户会话
    await setUserSession(event, {
      user: {
        username,
      },
      loggedInAt: Date.now(),
    })

    return {
      success: true,
      message: '登录成功',
    }
  }

  // 登录失败
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: '用户名或密码错误',
  })
})
