<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  item: MenuItem
  catId: string
  refresh: () => Promise<void>
}>()

const supabase = useSupabaseClient()
const newPrice = ref<number>(props.item.price || 0)
const isQuickPrice = ref<{ [key: string]: boolean }>({})
// isQuickPrice toggle function
const quickPriceToggle = (item: MenuItem) => {
  isQuickPrice.value[item.id] = !isQuickPrice.value[item.id]
}

const isLoading = ref(false)
const toast = useToast()
async function quickPriceUpdate(): Promise<void> {
  try {
    isLoading.value = true
    await supabase.from('menu_items')
      .update({ price: newPrice.value })
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
    quickPriceToggle(props.item)
  }
}
</script>

<template>
  <div
    v-if="item"
    class="flex flex-col justify-between gap-6"
  >
    <div
      class="flex items-center space-x-2"
    >
      <UIcon
        :name="$i18n.locale === 'fa' ? 'i-twemoji-flag-iran' : $i18n.locale === 'en' ? 'i-twemoji-flag-united-kingdom' : 'i-twemoji-flag-france'"
        class="items-center self-center"
      />
      <p class="text-pretty text-base font-medium text-highlighted">
        {{ item[`name_${$i18n.locale}`] }}
      </p>
    </div>
    <div
      v-if="item.options"
      class="flex flex-wrap items-center gap-2"
    >
      <UBadge
        v-for="extra, index in item.options"
        :key="index"
        color="neutral"
        variant="subtle"
        size="md"
        class="px-4 space-x-4"
      >
        <span class="">
          {{ extra[`name_${$i18n.locale}`] }}

        </span>
        <span
          v-if="extra.price > 0"
          class="font-medium"
        >
          {{ $i18n.locale === 'fa' ? `${persianNumber(extra.price)}+` : `+${extra.price}` }}
        </span>
      </UBadge>
    </div>
    <div
      v-if="item.badges"
      class="flex flex-wrap items-center gap-2"
    >
      <ul
        v-for="badge in item.badges"
        :key="badge.name_fa"
        class="flex space-x-2 list-disc list-inside items-center text-xs text-muted"
      >
        <li class="">
          {{ badge[`name_${$i18n.locale}`] }}
        </li>
      </ul>
    </div>
    <div class="flex items-center space-x-2">
      <UIcon
        name="i-hugeicons:dollar-circle"
        class="h-5 w-5"
      />
      <p class="text-base font-semibold">
        {{ item.price }} {{ $t('menu.hezar') }} {{ $t('menu.toman') }}
      </p>
      <UButton
        v-if="!isQuickPrice[item.id]"
        :label="$t('editor.quick_price')"
        size="xs"
        variant="subtle"
        color="info"
        icon="i-hugeicons:flash"
        class="cursor-pointer"
        @click="quickPriceToggle(item)"
      />
    </div>
    <!-- quick price update -->
    <div
      v-show="isQuickPrice[item.id]"
      class="grid grid-cols-3 gap-2"
    >
      <UInput
        v-model="newPrice"
        type="number"
        class=""
      />
      <UButton
        variant="subtle"
        color="success"
        :label="$t('editor.confirm')"
        icon="i-hugeicons:flash"
        block
        :loading="isLoading"
        :disabled="isLoading"
        @click="quickPriceUpdate"
      />
      <UButton
        variant="subtle"
        color="neutral"
        :label="$t('editor.cancel')"
        icon="i-hugeicons:multiplication-sign"
        block
        @click="quickPriceToggle(item)"
      />
    </div>
  </div>
</template>
