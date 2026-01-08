<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <!-- 范围选择按钮 -->
      <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 self-start sm:self-auto">
        <button
          v-for="range in ranges"
          :key="range.value"
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
          :class="[
            selectedRange === range.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="selectedRange = range.value"
        >
          {{ range.label }}
        </button>
      </div>

      <div class="flex flex-col items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white text-center">网络 I/O (已传输字节)</h2>
        <div class="flex justify-center items-center gap-4 mt-2 text-xs">
          <div class="flex items-center gap-1.5">
            <div class="w-8 h-3 bg-[#4caf50] rounded-sm"></div>
            <span class="text-gray-500 dark:text-gray-400">入网流量</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-8 h-3 bg-[#0d6efd] rounded-sm"></div>
            <span class="text-gray-500 dark:text-gray-400">出网流量</span>
          </div>
        </div>
      </div>

      <!-- 占位，保持标题居中 -->
      <div class="hidden sm:block w-[140px]"></div>
    </div>

    <div class="relative h-[300px] w-full">
      <Bar v-if="chartData.labels.length > 0" :options="chartOptions" :data="chartData" />
      <div v-else class="flex items-center justify-center h-full text-gray-400">暂无数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js'
import dayjs from 'dayjs'
import type { UsageDataPoint } from '~/types/bwg'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: UsageDataPoint[]
}>()

// 范围定义
const ranges = [
  { label: '最近一天', value: 'day' },
  { label: '最近一周', value: 'week' },
  { label: '最近一月', value: 'month' },
] as const

type RangeType = (typeof ranges)[number]['value']
const selectedRange = ref<RangeType>('day')

// 格式化字节
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0.00'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const filteredData = computed(() => {
  const now = dayjs()
  let startTime = now

  switch (selectedRange.value) {
    case 'day':
      startTime = now.subtract(24, 'hour')
      break
    case 'week':
      startTime = now.subtract(7, 'day')
      break
    case 'month':
      startTime = now.subtract(30, 'day')
      break
  }

  const startTimestamp = startTime.unix()
  const relevantData = props.data.filter((d) => d.timestamp >= startTimestamp).sort((a, b) => a.timestamp - b.timestamp)

  // 按小时聚合
  const hourlyData = new Map<number, UsageDataPoint>()

  relevantData.forEach((point) => {
    // 将时间戳向下取整到整小时
    const hourTimestamp = Math.floor(point.timestamp / 3600) * 3600

    if (!hourlyData.has(hourTimestamp)) {
      hourlyData.set(hourTimestamp, {
        ...point,
        timestamp: hourTimestamp,
        network_in_bytes: 0,
        network_out_bytes: 0,
      })
    }

    const aggregated = hourlyData.get(hourTimestamp)!
    aggregated.network_in_bytes += point.network_in_bytes
    aggregated.network_out_bytes += point.network_out_bytes
  })

  return Array.from(hourlyData.values()).sort((a, b) => a.timestamp - b.timestamp)
})

const chartData = computed(() => {
  return {
    labels: filteredData.value.map((d) => dayjs.unix(d.timestamp).format('MMM DD, h A')),
    datasets: [
      {
        label: '入网流量',
        backgroundColor: '#4caf50',
        data: filteredData.value.map((d) => d.network_in_bytes),
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: '出网流量',
        backgroundColor: '#0d6efd',
        data: filteredData.value.map((d) => d.network_out_bytes),
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 10,
      callbacks: {
        title: (tooltipItems: TooltipItem<'bar'>[]) => {
          const tooltipItem = tooltipItems[0]
          if (!tooltipItem) return ''
          const index = tooltipItem.dataIndex
          const item = filteredData.value[index]
          if (!item) return ''
          return dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
        },
        label: (context: TooltipItem<'bar'>) => {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += formatBytes(context.parsed.y)
          }
          return label
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: '#e5e7eb',
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 20,
        font: {
          size: 10,
        },
      },
      stacked: true,
    },
    y: {
      grid: {
        color: '#e5e7eb',
      },
      border: {
        display: false,
      },
      ticks: {
        callback: function (value: string | number) {
          return formatBytes(Number(value))
        },
        font: {
          size: 10,
        },
      },
      stacked: true,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
}
</script>
