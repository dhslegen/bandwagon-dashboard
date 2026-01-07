// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // 允许单词组件名（pages 和 layouts 通常是单词名）
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', 'login', 'default', 'error'],
        },
      ],
      // Prettier 集成
      'prettier/prettier': 'warn',
      'vue/html-self-closing': 'off',
    },
  },
).append({
  plugins: {
    prettier: (await import('eslint-plugin-prettier')).default,
  },
})
