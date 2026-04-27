<script setup lang="ts">
const { data: categories } = await useFetch<Tables<'categories'>[]>('/api/v1/categories', {
  key: 'db-categories',
  default: () => ([]),
  deep: true,
  server: false,
},
)
const isOpen = ref(false)
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    :title="$t('menulist')"
    aria-describedby="menu"
  >
    <UButton
      icon="i-hugeicons:menu-01"
      :label="$t('menulist')"
    />
    <template #body>
      <UPageGrid
        as="nav"
        class="grid w-full grid-cols-3 gap-2"
      >
        <UPageCard
          v-for="item in categories"
          :key="item.id"
          :to="$localePath(`/menu#${item.id}`)"
          class=""
          :ui="{
            header: 'w-full flex flex-col items-center justify-center space-y-4',
          }"
          @click="isOpen = false"
        >
          <template #header>
            <img
              :src="item.icon || '/img/Mocktail.svg'"
              class="h-12 w-12 dark:invert"
              alt=""
            >
            <span class="text-center text-highlighted font-semibold">{{ item[`name_${$i18n.locale}`] }}</span>
          </template>
        </UPageCard>
      </UPageGrid>
    </template>
    <template #footer>
      <LocaleSwitch />
      <UColorModeButton />
    </template>
  </USlideover>
</template>
