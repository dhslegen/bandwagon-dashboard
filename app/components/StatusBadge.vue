<template>
  <div
    class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
    :class="badgeClasses"
  >
    <span class="relative flex h-2 w-2">
      <span
        v-if="status === 'running'"
        class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        :class="dotClass"
      />
      <span class="relative inline-flex rounded-full h-2 w-2" :class="dotClass" />
    </span>
    <span>{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  status: 'running' | 'stopped' | 'starting' | 'throttled'
}

const props = defineProps<Props>()

const statusConfig = {
  running: {
    text: '运行中',
    badge:
      'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  stopped: {
    text: '已停止',
    badge: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
  starting: {
    text: '启动中',
    badge:
      'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  throttled: {
    text: 'CPU节流',
    badge:
      'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
}

const config = computed(() => statusConfig[props.status])
const badgeClasses = computed(() => config.value.badge)
const dotClass = computed(() => config.value.dot)
const statusText = computed(() => config.value.text)
</script>
