import { i18nConfig } from './i18n/i18n.config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@hypernym/nuxt-anime',
    '@nuxt/eslint',
    // 'nitro-cloudflare-dev',
    '@vueuse/nuxt',
    // '@nuxthub/core',
  ],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'brand',
        'info',
        'success',
        'warning',
        'error',
      ],
    },
  },

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
    prerender: {
      routes: [
        '/',
      ],
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
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'latelierdegz',
        main: './.output/server/index.mjs',
        // "compatibility_flags": ["nodejs_compat"],
        compatibility_date: '2025-09-28',
        assets: {
          binding: 'ASSETS',
          directory: './.output/public/',
        },
        r2_buckets: [{
          binding: 'R2_BUCKET',
          bucket_name: 'public',
        }],
        workers_dev: false, // set to false when using custom domain
        observability: {
          enabled: true,
        },
        vars: {
          NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL,
          NUXT_PUBLIC_API_URL: process.env.NUXT_PUBLIC_API_URL,
          S3_API: process.env.S3_API,
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
          SUPABASE_KEY: process.env.SUPABASE_KEY,
          R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
          R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
          OPENAI_API_KEY: process.env.NUXT_OPENAI_API_KEY,
        },
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
