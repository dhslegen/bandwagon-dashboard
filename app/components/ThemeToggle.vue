<template>
  <ClientOnly>
    <button
      class="flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      :title="nextModeTitle"
      @click="toggleMode"
    >
      <Icon v-if="colorMode.preference === 'system'" name="heroicons:computer-desktop-20-solid" class="w-5 h-5" />
      <Icon v-else-if="colorMode.preference === 'dark'" name="heroicons:moon-20-solid" class="w-5 h-5" />
      <Icon v-else name="heroicons:sun-20-solid" class="w-5 h-5" />
    </button>
    <template #fallback>
      <div class="w-9 h-9" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const modes = ['system', 'light', 'dark'] as const
type Mode = (typeof modes)[number]

const nextModeTitle = computed(() => {
  const current = colorMode.preference
  if (current === 'system') return '切换到浅色模式'
  if (current === 'light') return '切换到深色模式'
  return '切换到跟随系统'
})

const toggleMode = () => {
  const currentIndex = modes.indexOf(colorMode.preference as Mode)
  const nextIndex = (currentIndex + 1) % modes.length
  colorMode.preference = modes[nextIndex]!
}
</script>
