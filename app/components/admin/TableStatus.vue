<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  item: MenuItem
  catId: string
  refresh: () => Promise<void>
}>()

const supabase = useSupabaseClient()
const inStock = ref<boolean>(props.item.available)
const isLoading = ref(false)
const toast = useToast()
async function toggleAvailable(): Promise<void> {
  try {
    isLoading.value = true
    await supabase.from('menu_items')
      .update({ available: inStock.value })
      .eq('id', props.item.id)
    toast.add({
      title: t('editor.update_success'),
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    await props.refresh()
  }
  catch (error: any) {
    toast.add({
      title: t('editor.update_error'),
      description: error.message || '',
      color: 'error',
      icon: 'i-hugeicons:alert-02',
    })
    console.error('Error updating price:', error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <USwitch
      v-model="inStock"
      :label="inStock ? $t('editor.in_stock') : $t('editor.out_of_stock')"
      :loading="isLoading"
      color="success"
      checked-icon="i-lucide:check"
      unchecked-icon="i-lucide:x"
      size="xl"
      :ui="{
        label: inStock ? 'text-success' : 'text-error',
        base: ['data-[state=unchecked]:bg-error'],
        icon: ['group-data-[state=unchecked]:text-error'],
      }"
      @change="toggleAvailable"
    />
    <USeparator />
    <UBadge
      v-if="item.price && item.name_en && item.name_fa && item.name_fr && item.img && item.description_en && item.description_fa && item.description_fr"
      color="success"
      variant="subtle"
      icon="i-twemoji-check-mark-button"
      size="md"
      :label="$t('editor.all_good')"
      class="w-max"
    />

    <div
      v-else
      class="flex flex-col space-y-2"
    >
      <div class="flex items-center space-x-2">
        <UIcon
          name="i-twemoji-camera"
          class="h-5 w-5 items-center self-center"
        />
        <p class="text-xs font-semibold">
          {{ $t('editor.missing_img') }}:
        </p>
        <UIcon
          v-if="!item.img"
          name="i-twemoji-cross-mark"
          class="h-3 w-3 items-center self-center"
        />
        <UIcon
          v-else
          name="i-twemoji-check-mark-button"
          class="h-3 w-3 items-center self-center"
        />
      </div>
      <USeparator />
      <div
        v-if="!item.description_en || !item.description_fa || !item.description_fr"
        class="flex items-center space-x-2"
      >
        <p class="text-xs font-semibold">
          {{ $t('editor.missing_desc') }}
        </p>
        :
        <UIcon
          v-if="!item.description_fa"
          name="i-twemoji-flag-iran"
          class="items-center self-center"
        />
        <UIcon
          v-if="!item.description_en"
          name="i-twemoji-flag-united-states"
          class="items-center self-center"
        />
        <UIcon
          v-if="!item.description_fr"
          name="i-twemoji-flag-france"
          class="items-center self-center"
        />
      </div>
    </div>
  </div>
</template>
