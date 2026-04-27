<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

// const colorMode = useColorMode()

// const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : '#5c287c'))

const route = useRoute()
const { t, locale, localeCodes } = useI18n()
const head = useLocaleHead()
const title = computed(() => t((route.meta.title as string) ?? 'seo_title'))
const description = computed(() => t((route.meta.description as string) ?? 'seo_description'))
const lang = computed(() => locale.value === 'fa' ? 'fa-IR' : locale.value)
const dir = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr')
// console.log('Current locale:', locale.value)
// console.log('Dir: ', dir.value)
const rootClass = computed(() => (locale.value === 'fa' ? 'smooth-scroll font-vazir' : 'smooth-scroll font-sans'))

useHead(() => ({
  htmlAttrs: {
    lang,
    dir,
    class: rootClass,
  },
  link: [
    ...(head.value.link || []),
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#bf1c2f' },
    { rel: 'manifest', href: '/site.webmanifest', crossorigin: 'use-credentials' },
  ],
  meta: [...(head.value.meta || []),
    { name: 'apple-mobile-web-app-title', content: 'Latelier De GZ' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'msapplication-TileColor', content: '#bf1c2f' },
    { name: 'theme-color', content: '#bf1c2f' },
  ],
}))

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogType: 'website',
  ogImage: 'https://latelierdegz.com/og.png',
  ogLocale: () => locale.value,
  ogLocaleAlternate: () => localeCodes.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
})
</script>

<template>
  <UApp
    :locale="locale === 'fa' ? locales.fa_ir : locales[locale]"
  >
    <NuxtLoadingIndicator color="#8441b6" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
