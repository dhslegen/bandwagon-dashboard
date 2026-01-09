<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// 设置全局页面元信息
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - 搬瓦工 VPS 看板` : '搬瓦工 VPS 看板'
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: '现代化的搬瓦工 VPS 管理看板' },
  ],
  htmlAttrs: {
    lang: 'zh-CN',
  },
})
</script>
