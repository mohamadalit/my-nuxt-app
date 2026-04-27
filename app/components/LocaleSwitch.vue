<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const siteLocales = [
  { code: 'FA', name: 'Farsi', icon: 'i-twemoji-flag-iran', value: 'fa', label: 'فارسی' },
  { code: 'EN', name: 'English', icon: 'i-twemoji:flag-united-kingdom', value: 'en', label: 'English' },
  { code: 'FR', name: 'French', icon: 'i-twemoji-flag-france', value: 'fr', label: 'français' },
]

const selectedLocale = ref(siteLocales.find(item => item.value === locale.value))

async function changeLocale() {
  await navigateTo(switchLocalePath(selectedLocale.value!.value as typeof locale.value))
  window.location.reload() // temporary fix due to nuxt ui bug for navigationMenu and footerColumns not updating
}
</script>

<template>
  <div>
    <USelectMenu
      v-model="selectedLocale"
      :icon="selectedLocale?.icon"
      :items="siteLocales"
      :ui="{ content: 'w-max' }"
      :search-input="false"
      :content="{
        align: 'end',
        side: 'bottom',
      }"
      @change="changeLocale"
    >
      <template #leading="{ ui }">
        <UIcon
          name="i-hugeicons-language-square"
          :class="ui.leadingIcon()"
        />
      </template>
      <template #default="{ modelValue }">
        <UIcon
          v-if="modelValue"
          :name="modelValue.icon"
          class="size-5"
        />
        <UIcon
          v-else
          name="i-twemoji-globe-showing-americas"
          class="size-5"
        />
      </template>
    </USelectMenu>
  </div>
</template>
