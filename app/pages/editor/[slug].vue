<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'

const supabase = useSupabaseClient()
const { locale } = useI18n()
const route = useRoute()
const catId = computed(() => route.params.slug as string)

const { data: categories, refresh: refreshCategories, pending: categoriesPending } = await useFetch<Tables<'categories'>[]>('/api/v1/categories', {
  key: 'db-categories',
  default: () => ([]),
  deep: true,
  server: false,
},
)

const { data: _allItems, refresh: refreshAllItems, pending: allItemsPending } = await useFetch<MenuItem[]>('/api/v1/menu', {
  key: 'db-menu',
  default: () => ([]),
  deep: true,
  server: false,
})

const { data: items, refresh: refreshItems, pending: itemsPending } = await useFetch<MenuItem[]>('/api/v1/menu', {
  key: () => `db-menu-${catId.value}`,
  default: () => ([]),
  transform: data => data.filter(item => item.category_id === catId.value),
  deep: true,
  server: false,
  watch: [catId],
})

const selectedCategory = computed<Tables<'categories'> | null>(() => {
  return categories.value.find(cat => cat.id === catId.value) || null
})

const isPending = computed(() => {
  if (categoriesPending.value && allItemsPending.value && itemsPending.value) {
    return true
  }
  return false
})

const isOrdering = ref(false)

const el = useTemplateRef<HTMLElement>('el')

const { start, stop } = useSortable(el, items)
onMounted(() => {
  if (!isOrdering.value) {
    stop()
  }
})
watch(isOrdering, (newVal) => {
  if (newVal === true) {
    start()
  }
  else {
    stop()
  }
})

async function refresh() {
  await refreshCategories()
  await refreshAllItems()
  await refreshItems()
}

async function saveOrder() {
  try {
    if (!catId.value || !items.value) return
    items.value.forEach((item, index) => {
      item.order = index + 1
    })
    await supabase.from('menu_items').upsert(items.value)
    await refresh()
    isOrdering.value = false
  }
  catch (error) {
    console.error('Error saving category order:', error)
  }
}
</script>

<template>
  <UDashboardPanel
    id="editor-slug"
  >
    <template #header>
      <UDashboardNavbar :title="selectedCategory?.[`name_${locale}`] || 'Unknown Category'">
        <template #leading>
          <UDashboardSidebarCollapse
            class="rtl:rotate-180"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <div class="flex gap-4">
            <AdminModalsItemNew
              :cat="catId!"
              :refresh="refresh"
            />
          </div>
        </template>
        <template #right>
          <UButton
            v-if="isOrdering"
            :label="$t('editor.cancel')"
            :icon="'i-hugeicons:multiplication-sign'"
            variant="outline"
            color="neutral"
            @click=" refresh(); isOrdering = false"
          />
          <UButton
            :label="isOrdering ? $t('editor.confirm') : $t('editor.reorder')"
            :icon="isOrdering ? 'i-hugeicons:checkmark-square-02' : 'i-hugeicons:sort-by-down-01'"
            variant="subtle"
            :color="isOrdering ? 'success' : 'primary'"
            @click="isOrdering ? saveOrder() : isOrdering = true"
          />
        </template>
      </UDashboardToolbar>
    </template>
    <template #body>
      <UProgress
        v-if="isPending"
        orientation="vertical"
        class="h-48 mx-auto"
      />
      <UEmpty
        v-if="!items.length && !isPending"
        icon="i-lucide-file"
        :title="$t('editor.empty_title')"
        :description="$t('editor.empty_desc')"
        :actions="[
          {
            icon: 'i-lucide-refresh-cw',
            label: $t('editor.refresh'),
            color: 'neutral',
            variant: 'subtle',
          },
        ]"
      />
      <UPageList
        v-if="!isPending && selectedCategory"
        ref="el"
        class="space-y-4"
      >
        <UPageCard
          v-for="item, index in items"
          :key="item.id"
          variant="subtle"
          :class="isOrdering ? 'cursor-grab max-w-sm mx-auto w-full' : ''"
        >
          <UPageFeature
            v-if="isOrdering"
            :title="item[`name_${locale}`]"
            :description="(index + 1).toLocaleString(locale)"
            icon="i-hugeicons:arrow-up-down"
            class="animate-wiggle"
            :ui="{ description: 'absolute inset-y-0 left-4' }"
          />
          <UPageGrid v-else>
            <AdminTableInfo
              :item="item"
              :cat-id="catId"
              :refresh="refresh"
            />
            <AdminTableStatus
              :item="item"
              :cat-id="catId"
              :refresh="refresh"
            />
            <div
              class="grid grid-cols-2 items-center justify-center gap-4"
            >
              <AdminModalsItemEdit
                v-model:item="items[index]!"
                :cat-id="catId"
                :refresh="refresh"
              />
              <AdminModalsItemView
                :item="item"
              />
              <AdminModalsItemMove
                :item="item"
                :cat-id="catId"
                :categories="categories"
                :refresh="refresh"
              />
              <AdminModalsItemDelete
                :item="item"
                :cat-id="catId"
                :refresh="refresh"
              />
            </div>
          </UPageGrid>
        </UPageCard>
      </UPageList>
    </template>
  </UDashboardPanel>
</template>
