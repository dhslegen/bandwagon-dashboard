<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-12">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
            >
              <Icon name="heroicons:server-stack-20-solid" class="w-5 h-5 text-white" />
            </div>
            <span class="text-lg font-semibold text-gray-900 dark:text-white tracking-tight"> 搬瓦工看板 </span>
          </div>

          <!-- 用户信息 + 登出 -->
          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="heroicons:user-circle-20-solid" class="w-5 h-5" />
              <span>{{ user?.username || 'Admin' }}</span>
            </div>

            <button
              class="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              @click="handleLogout"
            >
              <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="w-4 h-4" />
              <span class="hidden sm:inline">登出</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="pt-16">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const user = ref({ username: 'admin' })

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
  } catch (error) {
    console.error('登出失败:', error)
  }
}
</script>
