<script setup lang="ts">
const props = defineProps<{
  item: MenuItem
  catId: string
  categories: Tables<'categories'>[]
  refresh: () => Promise<void>
}>()

const { t } = useI18n()
const supabase = useSupabaseClient()

const isOpen = ref(false)

const newCat = ref<string>(props.catId || '')

const loading = ref(false)
const toast = useToast()

async function submit() {
  if (loading.value) return
  loading.value = true
  try {
    await supabase.from('menu_items')
      .update({ category_id: newCat.value })
      .eq('id', props.item.id)

    toast.add({
      title: t('editor.update_success'),
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    await props.refresh()
    isOpen.value = false
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('editor.move_item_cat')"
  >
    <UButton
      :label="$t('editor.cat_switch')"
      color="neutral"
      variant="subtle"
      size="sm"
      block
      icon="i-hugeicons:folder-move-to"
    />
    <template #body>
      <UFormField
        name="newCat"
        :label="$t('editor.move_to')"
        required
      >
        <USelect
          v-model="newCat"
          :items="categories.map(cat => ({ label: cat[`name_${$i18n.locale}`], value: cat.id }))"
          class="w-full"
        />
      </UFormField>
    </template>
    <template #footer>
      <UButton
        variant="subtle"
        :label="$t('editor.cancel')"
        block
        color="neutral"
        @click="refresh(); isOpen = false"
      />
      <UButton
        :label="$t('editor.save')"
        block
        variant="subtle"
        color="success"
        :loading="loading"
        :disabled="loading"
        @click="submit()"
      />
    </template>
  </UModal>
</template>
