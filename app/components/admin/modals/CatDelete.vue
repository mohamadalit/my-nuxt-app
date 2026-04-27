<script setup lang="ts">
const props = defineProps<{
  cat: Tables<'categories'>
  refresh: () => Promise<void>
}>()
const supabase = useSupabaseClient()
const { t, locale } = useI18n()
const isOpen = ref(false)
const loading = ref(false)

const toast = useToast()
async function submitDeleteItem() {
  try {
    loading.value = true
    await supabase.from('categories').delete().eq('id', props.cat.id)
    props.refresh()
    toast.add({
      title: 'Category deleted successfully',
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    isOpen.value = false
  }
  catch (error: any) {
    console.error(error)
    toast.add({
      title: t('editor.update_error'),
      description: error.message || '',
      color: 'error',
      icon: 'i-hugeicons:alert-02',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <UButton
      :label="$t('editor.remove')"
      color="error"
      variant="subtle"
      size="sm"
      block
      icon="i-hugeicons:delete-02"
    />
    <template #body>
      <UPageCard
        variant="ghost"
        :title="$t('editor.delete_cat_confirm')"
        :description="$t('editor.delete_cat_desc')"
      >
        <UUser
          :name="cat[`name_${locale}`]"
          :avatar="{
            src: cat.icon,
            alt: cat.name_en,
          }"
          size="xl"
          :ui="{ avatar: 'dark:invert bg-transparent' }"
        />
      </UPageCard>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        :label="$t('editor.cancel')"
        color="neutral"
        block
        @click="isOpen = false"
      />
      <UButton
        :label="$t('editor.remove')"
        variant="subtle"
        block
        :loading="loading"
        @click="submitDeleteItem"
      />
    </template>
  </UModal>
</template>
