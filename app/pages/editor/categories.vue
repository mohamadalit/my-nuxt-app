<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'

const supabase = useSupabaseClient()
const { data: categories, refresh } = await useFetch<Tables<'categories'>[]>('/api/v1/categories', {
  key: 'db-categories',
  default: () => ([]),
  deep: true,
  server: false,
},
)
const isOrdering = ref(false)

const el = useTemplateRef<HTMLElement>('el')

const { start, stop } = useSortable(el, categories)

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

async function saveOrder() {
  try {
    categories.value.forEach((cat, index) => {
      cat.order = index + 1
    })
    await supabase.from('categories').upsert(categories.value)
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
    id="editor-categories"
  >
    <template #header>
      <UDashboardNavbar :title="$t('editor.cat_settings')">
        <template #leading>
          <UDashboardSidebarCollapse
            class="rtl:rotate-180"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <div class="flex gap-4">
            <AdminModalsCatNew
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
            @click="refresh(); isOrdering = false"
          />
          <UButton
            :label="isOrdering ? $t('editor.confirm') : $t('editor.reorder')"
            :icon="isOrdering ? 'i-hugeicons:checkmark-square-02' : 'i-hugeicons:sort-by-down-01'"
            variant="outline"
            :color="isOrdering ? 'success' : 'primary'"
            @click="isOrdering ? saveOrder() : isOrdering = true"
          />
        </template>
      </UDashboardToolbar>
    </template>
    <template #body>
      <UPageGrid
        ref="el"
        as="ul"
        :class="isOrdering ? 'sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 w-full max-w-sm mx-auto' : 'sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'"
      >
        <UPageCard
          v-for="cat, index in categories"
          :key="cat.id"
          as="li"
          variant="subtle"
          class="text-center justify-center items-center w-full"
          :class="isOrdering ? ' cursor-grab' : ''"
        >
          <UPageFeature
            v-if="isOrdering"
            :title="cat[`name_${$i18n.locale}`]"
            :description="(index + 1).toLocaleString($i18n.locale)"
            icon="i-hugeicons:arrow-up-down"
            class="animate-wiggle"
            :ui="{ description: 'absolute inset-y-0 left-4' }"
          />
          <img
            v-if="!isOrdering"
            :src="cat.icon"
            alt=""
            class="mb-4 h-10 w-10 mx-auto dark:invert"
          >
          <span
            v-if="!isOrdering"
            class="text-highlighted font-semibold"
          >{{ cat[`name_${$i18n.locale}`] }}</span>
          <div
            v-if="!isOrdering"
            class="flex justify-center items-center space-x-2"
          >
            <AdminModalsCatDelete
              :cat="cat"
              :refresh="refresh"
            />
            <AdminModalsCatEdit
              v-model:cat="categories[index]!"
              :cat-id="cat.id"
              :refresh="refresh"
            />
          </div>
        </UPageCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>
