<script setup lang="ts">
const { availableLocales } = useI18n()
const sortedLocales = [
  'fa',
  ...availableLocales.filter(locale => locale !== 'fa'),
]
const lang = defineModel<'en' | 'fa' | 'fr'>('lang', { required: true })
</script>

<template>
  <URadioGroup
    v-model="lang"
    :items="sortedLocales"
    indicator="hidden"
    orientation="horizontal"
    variant="card"
    size="xs"
    :ui="{ container: 'items-center', legend: 'mb-0', label: 'flex items-center' }"
  >
    <template #label="{ item }: any">
      <UIcon
        class="size-5"
        :name="item.value === 'en' ? 'i-twemoji:flag-united-kingdom' : item.value === 'fr' ? 'i-twemoji:flag-france' : 'i-twemoji:flag-iran'"
      />
    </template>
  </URadioGroup>
</template>
