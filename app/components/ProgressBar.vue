<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">{{ label }}</span>
      <span class="font-medium tabular-nums" :class="percentageColor"> {{ percentage }}% </span>
    </div>

    <div class="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        class="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        :class="barColorClass"
        :style="{ width: `${percentage}%` }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>

    <div v-if="showDetails" class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
      <span>{{ formatBytes(used) }}</span>
      <span>/ {{ formatBytes(total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  percentage: number
  used?: number
  total?: number
  showDetails?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  used: undefined,
  total: undefined,
  showDetails: false,
  variant: 'default',
})

const barColorClass = computed(() => {
  if (props.variant !== 'default') {
    const variants = {
      success: 'bg-emerald-500 dark:bg-emerald-600',
      warning: 'bg-amber-500 dark:bg-amber-600',
      danger: 'bg-red-500 dark:bg-red-600',
    }
    return variants[props.variant]
  }

  // 基于百分比自动选择颜色
  if (props.percentage >= 90) return 'bg-red-500 dark:bg-red-600'
  if (props.percentage >= 75) return 'bg-amber-500 dark:bg-amber-600'
  return 'bg-primary-500 dark:bg-primary-600'
})

const percentageColor = computed(() => {
  if (props.percentage >= 90) return 'text-red-600 dark:text-red-400'
  if (props.percentage >= 75) return 'text-amber-600 dark:text-amber-400'
  return 'text-gray-900 dark:text-white'
})

function formatBytes(bytes: number | undefined): string {
  // 处理 undefined、NaN 和负数
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return '0.0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
