// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    '@nuxt/eslint',
  ],

  // Color Mode 配置
  colorMode: {
    classSuffix: '', // 配合 TailwindCSS 的 darkMode: 'class'
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // 运行时配置
  runtimeConfig: {
    // 服务器端私有配置（通过环境变量设置）
    bwg: {
      veid: process.env.NUXT_BWG_VEID || '',
      apiKey: process.env.NUXT_BWG_API_KEY || '',
    },
    auth: {
      username: process.env.NUXT_AUTH_USERNAME || 'admin',
      password: process.env.NUXT_AUTH_PASSWORD || '',
    },
    // Session 密钥（自动生成或通过环境变量设置）
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || '',
      // Session Cookie 配置（修复 Safari 兼容性）
      cookie: {
        sameSite: 'lax', // Safari 兼容的 SameSite 策略
        secure: process.env.NODE_ENV === 'production', // 只在生产环境使用 Secure
      },
    },
    // 公开配置（可以暴露给客户端）
    public: {
      appName: '搬瓦工 VPS 看板',
      refreshInterval: 10000, // 10秒自动刷新
    },
  },

  // 路由规则和安全头
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
    },
  },

  // Nitro 配置
  nitro: {
    compressPublicAssets: true,
  },
})
