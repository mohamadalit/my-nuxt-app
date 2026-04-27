<script setup lang="ts">
defineProps<{
  collapsed?: boolean
  to?: string
}>()
</script>

<template>
  <NuxtLinkLocale
    :to="to ?? `/`"
    :class="[
      collapsed
        ? ''
        : '',
      'flex items-center',
    ]"
  >
    <UColorModeImage
      alt="logo"
      class="h-12 w-auto p-2"
      :light="$i18n.locale === 'fa' && !collapsed ? '/logo-fa-brand.svg' : '/logo-icon-alt-brand.svg'"
      :dark="$i18n.locale === 'fa' && !collapsed ? '/logo-fa-brand.svg' : '/logo-icon-alt-brand.svg'"
      :width="114.06"
      :height="40"
    />
  </NuxtLinkLocale>
</template>
