/**
 * 前端认证中间件
 * 检查用户是否已登录，未登录则跳转到登录页
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // 跳过登录页的检查
  if (to.path === '/login') {
    return
  }

  // 检查用户会话
  const { data: session } = await useFetch('/api/auth/session')

  // 检查是否已登录（session 存在且 user 不为 null）
  if (!session.value || !session.value.user) {
    // 未登录，跳转到登录页
    return navigateTo('/login')
  }
})
