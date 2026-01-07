<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-500/5 to-transparent dark:from-primary-500/10 rounded-full blur-3xl"
      />
      <div
        class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary-500/5 to-transparent dark:from-primary-500/10 rounded-full blur-3xl"
      />
    </div>

    <!-- 登录卡片 -->
    <div class="relative w-full max-w-md animate-slide-up">
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10"
      >
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20"
          >
            <Icon name="heroicons:server-stack-20-solid" class="w-9 h-9 text-white" />
          </div>
        </div>

        <!-- 标题 -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">欢迎回来</h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">登录以管理您的 VPS</p>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3 animate-fade-in"
        >
          <Icon name="heroicons:exclamation-circle-20-solid" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- 登录表单 -->
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- 用户名 -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> 用户名 </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              autocomplete="username"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="请输入用户名"
            />
          </div>

          <!-- 密码 -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> 密码 </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="请输入密码"
            />
          </div>

          <!-- 记住我 -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label for="remember" class="ml-2 text-sm text-gray-600 dark:text-gray-400"> 记住我 </label>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">登录</span>
            <span v-else class="flex items-center justify-center space-x-2">
              <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5 animate-spin" />
              <span>登录中...</span>
            </span>
          </button>
        </form>
      </div>

      <!-- 底部提示 -->
      <p class="text-center mt-6 text-sm text-gray-500 dark:text-gray-500">搬瓦工 VPS 管理看板 © 2026</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const isLoading = ref(false)
const errorMessage = ref('')

// 检查是否已登录，如果已登录则跳转到首页
const checkSession = async () => {
  try {
    const { data: session } = await useFetch('/api/auth/session')
    if (session.value && session.value.user) {
      await navigateTo('/')
    }
  } catch {
    // 忽略错误，继续显示登录页
  }
}

// 页面加载时检查登录状态
onMounted(() => {
  checkSession()
})

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password,
      },
    })

    // 登录成功，使用 replace 跳转（强制刷新，确保 Safari 正确读取 cookie）
    window.location.href = '/'
  } catch (error: unknown) {
    errorMessage.value =
      typeof error === 'object' && error !== null && 'data' in error
        ? (error as { data?: { statusMessage?: string } }).data?.statusMessage || '登录失败，请检查用户名和密码'
        : '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}
</script>
