<script setup lang="ts">
const props = defineProps<{
  catId: string
  item: MenuItem
  refresh: () => Promise<void>
}>()
const isOpen = ref(false)
const loading = ref(false)
const supabase = useSupabaseClient()

async function submit() {
  try {
    loading.value = true
    await supabase.from('menu_items')
      .delete()
      .eq('id', props.item.id)
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
  >
    <UButton
      :label="$t('editor.item_delete')"
      color="error"
      variant="outline"
      size="sm"
      block
      icon="i-hugeicons:delete-02"
      class="w-max cursor-pointer"
    />
    <template #body>
      <UPageCard
        variant="ghost"
        :title="$t('editor.item_delete_confirm')"
        :description="$t('editor.item_delete_desc')"
      >
        <UPageCard
          :orientation="item.img ? 'horizontal' : 'vertical'"
          variant="subtle"
          :ui="{
            header: 'flex flex-col w-full space-y-4',
          }"
        >
          <template #header>
            <div class="flex flex-col w-full justify-start">
              <h3
                class="font-vazir font-bold"
                dir="rtl"
              >
                {{ item.name_fa }}
              </h3>
              <h3
                class="font-sans text-sm font-bold"
                dir="ltr"
              >
                {{ $i18n.locale === 'fa' ? item.name_en : item[`name_${$i18n.locale}`] }}
              </h3>
            </div>
            <div
              v-if="item.description_fa"
              class="flex h-full max-h-44 w-full flex-col content-around justify-between gap-3 overflow-hidden rounded-b-xl p-2 "
            >
              <div class=" text-xs text-muted leading-5 ">
                <p
                  class="font-vazir"
                  dir="rtl"
                >
                  {{ item.description_fa }}
                </p>
                <p
                  class="font-sans"
                  dir="ltr"
                >
                  {{
                    $i18n.locale === 'fa' ? item.description_en : item[`description_${$i18n.locale}`]
                  }}
                </p>
              </div>
            </div>
            <div class="">
              <div class="flex w-full items-center justify-between text-lg font-semibold">
                <div class="flex flex-row items-center gap-2 font-vazir">
                  <p>{{ item.price.toLocaleString($i18n.locale) }}</p>
                  <div class="flex flex-col items-center text-xs font-light leading-3">
                    <p>{{ $t('menu.hezar') }}<br>{{ $t('menu.toman') }}</p>
                  </div>
                </div>

                <UButton
                  variant="outline"
                  :label="item.available ? $t('add') : $t('menu.outofstock')"
                  class="px-6 text-xs rtl:font-vazir rtl:font-bold"
                  :disabled="!item.available"
                />
              </div>
            </div>
          </template>
          <!-- item image -->
          <img
            v-if="item.img"
            class="my-2 h-auto w-full max-w-2/3 mx-auto lg:max-w-full rounded-xl object-contain object-center drop-shadow-sm"
            :src="item.img"
            :alt="item[`name_${$i18n.locale}`]"
          >
        </UPageCard>
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
        color="error"
        :loading="loading"
        :disabled="loading"
        @click="submit()"
      />
    </template>
  </UModal>
</template>
