<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 页面标题 -->
    <div class="mb-6 animate-fade-in">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">VPS 概览</h1>
      <p class="text-xs text-gray-600 dark:text-gray-400">实时监控您的服务器状态和资源使用情况</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 上半部分：VPS 状态和流量监控 -->
      <!-- 加载状态 -->
      <template v-if="livePending && !liveInfo">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse"
        >
          <div class="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4" />
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          </div>
        </div>
      </template>

      <!-- 错误状态 -->
      <template v-else-if="liveError && !liveInfo">
        <div
          class="lg:col-span-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl p-6 animate-fade-in"
        >
          <div class="flex items-start space-x-3">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">加载失败</h3>
              <p class="text-sm text-red-700 dark:text-red-300">{{ liveError.message }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- 数据展示 -->
      <template v-else-if="currentInfo">
        <!-- VPS 状态卡片 -->
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-slide-up"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">VPS 状态</h2>
            <StatusBadge :status="vpsStatus" />
          </div>

          <!-- 资源使用进度条 -->
          <div class="space-y-5 mb-8">
            <ProgressBar
              label="内存"
              :percentage="memoryPercentage"
              :used="memoryUsed"
              :total="currentInfo.plan_ram"
              show-details
            />
            <ProgressBar
              label="磁盘"
              :percentage="diskPercentage"
              :used="liveInfo?.ve_used_disk_space_b || 0"
              :total="currentInfo.plan_disk"
              show-details
            />
          </div>

          <!-- 控制按钮 -->
          <div class="grid grid-cols-3 gap-3">
            <button
              :disabled="isControlling || vpsStatus === 'running'"
              class="flex flex-col items-center justify-center space-y-1 p-3 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-emerald-700 dark:text-emerald-400 disabled:text-gray-400 dark:disabled:text-gray-600 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              @click="() => handleControl('start')"
            >
              <Icon name="heroicons:play-20-solid" class="w-5 h-5" />
              <span class="text-xs font-medium">启动</span>
            </button>

            <button
              :disabled="isControlling || vpsStatus === 'stopped'"
              class="flex flex-col items-center justify-center space-y-1 p-3 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-red-700 dark:text-red-400 disabled:text-gray-400 dark:disabled:text-gray-600 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              @click="() => handleControl('stop')"
            >
              <Icon name="heroicons:stop-20-solid" class="w-5 h-5" />
              <span class="text-xs font-medium">停止</span>
            </button>

            <button
              :disabled="isControlling"
              class="flex flex-col items-center justify-center space-y-1 p-3 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-blue-700 dark:text-blue-400 disabled:text-gray-400 dark:disabled:text-gray-600 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              @click="() => handleControl('restart')"
            >
              <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5" :class="{ 'animate-spin': isControlling }" />
              <span class="text-xs font-medium">重启</span>
            </button>
          </div>
        </div>

        <!-- 流量监控卡片 -->
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-slide-up"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">流量监控</h2>
            <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
              <Icon name="heroicons:clock-20-solid" class="w-4 h-4" />
              <span>{{ timeUntilReset }}</span>
            </div>
          </div>

          <ProgressBar
            label="月度流量"
            :percentage="trafficPercentage"
            :used="currentInfo.data_counter * (currentInfo.monthly_data_multiplier || 1)"
            :total="currentInfo.plan_monthly_data * (currentInfo.monthly_data_multiplier || 1)"
            show-details
          />

          <div class="mt-6 grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p class="text-xs text-gray-500 dark:text-gray-500 mb-1">已使用</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
                {{ formatBytes(currentInfo.data_counter * (currentInfo.monthly_data_multiplier || 1)) }}
              </p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p class="text-xs text-gray-500 dark:text-gray-500 mb-1">总配额</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
                {{ formatBytes(currentInfo.plan_monthly_data * (currentInfo.monthly_data_multiplier || 1)) }}
              </p>
            </div>
          </div>

          <!-- IP 地址列表 -->
          <div class="mt-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(ip, index) in currentInfo.ip_addresses"
                :key="index"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                @click="copyToClipboard(ip)"
              >
                <span>{{ ip }}</span>
                <Icon name="heroicons:clipboard-document-20-solid" class="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- 下半部分：流量统计图表 -->
      <!-- 加载状态 -->
      <template v-if="usagePending && !usageStats">
        <div
          class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse"
        >
          <div class="flex justify-between items-center mb-6">
            <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" />
            <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          </div>
          <div class="h-[250px] bg-gray-200 dark:bg-gray-800 rounded w-full" />
        </div>
      </template>

      <!-- 错误状态 -->
      <template v-else-if="usageError && !usageStats">
        <!-- 如果上面已经因为 liveError 显示了错误，这里可能不需要重复显示，或者显示特定的图表加载失败 -->
        <!-- 这里选择不显示重复的大红框，而是简单的文字提示，除非上面的成功了下面的失败了 -->
        <div v-if="!liveError" class="lg:col-span-2 p-6 text-center text-gray-500">
          <p>流量统计加载失败: {{ usageError.message }}</p>
        </div>
      </template>

      <!-- 数据展示 -->
      <template v-else-if="usageStats?.data">
        <div class="lg:col-span-2 animate-slide-up">
          <NetworkChart :data="usageStats.data" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LiveServiceInfo, RawUsageStatsResponse } from '~/types/bwg'

definePageMeta({
  middleware: 'auth',
})

const isControlling = ref(false)

// 彻底禁用 SSR，改为纯客户端渲染
// 实时状态（10秒刷新）
const {
  data: liveInfo,
  pending: livePending,
  error: liveError,
  refresh: refreshLive,
} = useApi<LiveServiceInfo>('/api/vps/live', {
  lazy: true,
  server: false,
  immediate: false,
  onResponse({ response }) {
    if (import.meta.dev) {
      console.log('[Live Info] API 响应:', response._data)
    }
  },
  onResponseError({ response }) {
    console.error('[Live Info] API 错误:', response._data)
  },
})

// 流量统计（5分钟刷新）
const {
  data: usageStats,
  pending: usagePending,
  error: usageError,
  refresh: refreshUsage,
} = useApi<RawUsageStatsResponse>('/api/vps/stats', {
  lazy: true,
  server: false,
  immediate: false,
  onResponse({ response }) {
    if (import.meta.dev) {
      console.log('[Usage Stats] API 响应:', response._data)
    }
  },
  onResponseError({ response }) {
    console.error('[Usage Stats] API 错误:', response._data)
  },
})

// 当前显示的信息（优先使用 Live Info）
const currentInfo = computed(() => liveInfo.value)

// 组件挂载后首次加载数据
onMounted(async () => {
  await Promise.all([refreshLive(), refreshUsage()])
})

// 实时状态自动刷新（10秒）
const { pause: pauseLive } = useIntervalFn(() => {
  refreshLive()
}, 10000)

// 流量统计自动刷新（5分钟）
const { pause: pauseUsage } = useIntervalFn(
  () => {
    refreshUsage()
  },
  5 * 60 * 1000,
)

// VPS 状态
const vpsStatus = computed(() => {
  if (!liveInfo.value || !liveInfo.value.ve_status) return 'stopped'
  if (liveInfo.value.is_cpu_throttled) return 'throttled'
  return liveInfo.value.ve_status.toLowerCase() as 'running' | 'stopped' | 'starting'
})

// 流量百分比
const trafficPercentage = computed(() => {
  const info = currentInfo.value
  if (!info?.data_counter || !info?.plan_monthly_data) return 0
  const used = info.data_counter * (info.monthly_data_multiplier || 1)
  const total = info.plan_monthly_data * (info.monthly_data_multiplier || 1)
  if (total === 0) return 0
  const percentage = (used / total) * 100
  return Math.round(percentage)
})

// 距离重置时间
const timeUntilReset = computed(() => {
  const info = currentInfo.value
  if (!info) return ''
  const now = Date.now() / 1000
  const reset = info.data_next_reset
  const diff = reset - now

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)

  return `${days}天${hours}小时后重置`
})

// 内存使用率
const memoryPercentage = computed(() => {
  const info = currentInfo.value
  if (!info?.plan_ram || typeof liveInfo.value?.mem_available_kb !== 'number') return 0
  const total = info.plan_ram / 1024 // 转为 KB
  const available = liveInfo.value.mem_available_kb
  if (total === 0) return 0
  const used = total - available
  const percentage = (used / total) * 100
  return Math.round(Math.max(0, Math.min(100, percentage)))
})

const memoryUsed = computed(() => {
  const info = currentInfo.value
  if (!info?.plan_ram || typeof liveInfo.value?.mem_available_kb !== 'number') return 0
  const total = info.plan_ram / 1024
  const available = liveInfo.value.mem_available_kb
  const used = total - available
  return Math.max(0, used) * 1024 // 转回字节
})

// 磁盘使用率
const diskPercentage = computed(() => {
  const info = currentInfo.value
  if (!info?.plan_disk || typeof liveInfo.value?.ve_used_disk_space_b !== 'number') return 0
  const total = info.plan_disk
  const used = liveInfo.value.ve_used_disk_space_b
  if (total === 0) return 0
  const percentage = (used / total) * 100
  return Math.round(Math.max(0, Math.min(100, percentage)))
})

// 控制操作
const handleControl = async (action: 'start' | 'stop' | 'restart') => {
  const actionNames = { start: '启动', stop: '停止', restart: '重启' }

  if (!confirm(`确定要${actionNames[action]} VPS 吗？`)) {
    return
  }

  isControlling.value = true

  try {
    await $fetch('/api/vps/control', {
      method: 'POST',
      body: { action },
    })

    alert(`${actionNames[action]}命令已发送`)
    await refreshLive()
  } catch (error: unknown) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'data' in error
        ? (error as { data?: { statusMessage?: string } }).data?.statusMessage || '未知错误'
        : '未知错误'

    alert(`${actionNames[action]}失败: ${errorMessage}`)
  } finally {
    isControlling.value = false
  }
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 格式化字节
function formatBytes(bytes: number): string {
  // 处理 NaN、undefined 和负数
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0.0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// 组件卸载时停止自动刷新
onUnmounted(() => {
  pauseLive()
  pauseUsage()
})

// 开发环境监控数据变化
if (import.meta.dev) {
  watch(
    [liveInfo, usageStats],
    ([newLive, newUsage]) => {
      console.log('[数据更新] Live Info:', newLive)
      console.log('[数据更新] Usage Stats:', newUsage)
    },
    { immediate: true },
  )
}
</script>
