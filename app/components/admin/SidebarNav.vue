<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const localePath = useLocalePath()
const { t, locale } = useI18n()
const open = ref(false)
const collapsed = ref(false)
const supabase = useSupabaseClient()

const { data: categories } = await useFetch<Tables<'categories'>[]>('/api/v1/categories', {
  key: 'db-categories',
  default: () => ([]),
  deep: true,
  server: false,
},
)

const links = computed(() => {
  return [
    [
      {
        label: t('editor.hours'),
        icon: 'i-hugeicons-clock-01',
        to: localePath('/editor'),
        exact: true,
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: t('editor.cat_settings'),
        icon: 'i-hugeicons:settings-04',
        to: localePath('/editor/categories'),
        exact: true,
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: t('editor.cat'),
        icon: 'i-hugeicons-folder-02',
        children: categories.value?.map(cat => ({
          label: cat[`name_${locale.value}`],
          to: localePath(`/editor/${cat.id}`),
          exact: true,
          onSelect: () => {
            open.value = false
          },
        })),
        defaultOpen: true,
      },
    ],
    [
      {
        label: t('editor.logout'),
        icon: 'i-hugeicons:square-lock-01',
        exact: true,
        onSelect: async () => {
          open.value = false
          await supabase.auth.signOut()
          await navigateTo(localePath('/login'))
        },
      },
    ],
  ] as NavigationMenuItem[][]
})
</script>

<template>
  <UDashboardSidebar
    v-model:open="open"
    v-model:collapsed="collapsed"
    collapsible
    toggle-side="right"
    class="bg-(--ui-bg-elevated)/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #header>
      <MainLogo :collapsed="collapsed" />
    </template>

    <template #default>
      <UNavigationMenu
        :collapsed="collapsed"
        :items="links[0]"
        orientation="vertical"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="links[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UColorModeButton />
        <LocaleSwitch v-show="!collapsed" />
      </div>
    </template>
  </UDashboardSidebar>
</template>
