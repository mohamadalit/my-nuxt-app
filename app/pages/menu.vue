<script setup lang="ts">
const { data: categories } = await useFetch<Tables<'categories'>[]>('/api/v1/categories', {
  key: 'db-categories',
  default: () => ([]),
  deep: true,
  server: false,
},
)

const { data: menuItems } = await useFetch<MenuItem[]>('/api/v1/menu', {
  key: 'db-menu',
  default: () => ([]),
  deep: true,
  server: false,
})
</script>

<template>
  <UPage>
    <UPageSection
      v-for="category in categories"
      :id="category.id"
      :key="category.id"
    >
      <template #header>
        <UPageCard
          variant="subtle"
        >
          <div class="flex w-full flex-col items-center justify-center gap-2">
            <img
              :src="category.icon"
              alt=""
              class="h-12 w-12 dark:invert"
            >
            <h2 class="font-vazir text-lg font-medium">
              {{ category[`name_${$i18n.locale}`] }}
            </h2>
          </div>
        </UPageCard>
      </template>
      <template #body>
        <UPageGrid class="lg:grid-cols-2">
          <MenuItemCard
            v-for="item in menuItems.filter(item => item.category_id === category.id)"
            :key="item.id"
            :item="item"
          />
        </UPageGrid>
      </template>
    </UPageSection>
    <OrderList />
  </UPage>
</template>
