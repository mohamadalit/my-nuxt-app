import type { NuxtI18nOptions, Strategies } from '@nuxtjs/i18n'

export const i18nConfig: Partial<NuxtI18nOptions> = {
  langDir: 'locales',
  baseUrl: 'https://latelierdegz.com/',
  locales: [
    {
      code: 'fa',
      name: 'پارسی',
      language: 'fa-IR',
      file: 'fa.json',
      dir: 'rtl',
    },
    {
      code: 'en',
      name: 'English',
      language: 'en-US',
      file: 'en.json',
      dir: 'ltr',
    },
    {
      code: 'fr',
      name: 'Français',
      language: 'fr-FR',
      file: 'fr.json',
      dir: 'ltr',
    },
  ],
  trailingSlash: false,
  debug: false,
  defaultLocale: 'fa',
  strategy: 'prefix_except_default' as Strategies, // Cast strategy to Strategies
  detectBrowserLanguage: false,
}
