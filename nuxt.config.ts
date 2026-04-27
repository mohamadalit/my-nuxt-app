import { i18nConfig } from './i18n/i18n.config'

export default defineNuxtConfig({

  modules: [
    // '@nuxt/ui', // موقتاً غیرفعال چون با Nuxt 3 مشکل داشت
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@hypernym/nuxt-anime',
    '@nuxt/eslint',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
    },
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || '',
    s3Api: process.env.S3_API || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
    supabaseKey: process.env.SUPABASE_KEY || '',
  },

  compatibilityDate: '2025-10-16',

  nitro: {
    preset: 'node-server',

    prerender: {
      routes: ['/'],
      ignore: [
        (path: string) => path.startsWith('/editor'),
        (path: string) => path.startsWith('/en/editor'),
        (path: string) => path.startsWith('/fr/editor'),
      ],
      crawlLinks: true,
    },

    storage: {
      r2: {
        driver: 's3',
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        endpoint: process.env.S3_API || '',
        bucket: 'public',
        region: 'auto',
      },
    },
  },

  anime: {
    composables: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  i18n: i18nConfig,

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/editor(/*)?'],
      saveRedirectToCookie: true,
    },
    cookiePrefix: 'sb',
    types: '#shared/types/database.types.ts',
  },
})
