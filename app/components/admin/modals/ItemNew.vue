<script setup lang="ts">
const props = defineProps<{
  cat: string
  refresh: () => Promise<void>
}>()

const supabase = useSupabaseClient()
const { t, locale } = useI18n()
const lang = ref(locale.value)
const isOpen = ref(false)
const loading = ref(false)

const newItem = refManualReset<TablesInsert<'menu_items'>>({
  category_id: null,
  name_en: '',
  name_fa: '',
  name_fr: '',
  price: 0,
  img: '',
  description_en: '',
  description_fa: '',
  description_fr: '',
  available: true,
  options: null,
  badges: null,
  order: 0,
})

const options = ref<Extras[]>([])
const badges = ref<ItemBadge[]>([])

const file = ref<File | null>(null)
const toast = useToast()

watch(() => props.cat, (newCat: string) => {
  newItem.value.category_id = newCat
}, { immediate: true })

async function translateItem() {
  loading.value = true
  try {
    const response = await $fetch<MenuItem>('/api/v1/translate', {
      method: 'POST',
      body: { ...newItem.value, options: options.value, badges: badges.value },
    })
    newItem.value = { ...newItem.value, ...response }
    options.value = response.options || []
    badges.value = response.badges || []
    toast.add({
      title: t('editor.translate_success'),
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
  }
  catch (error) {
    toast.add({
      title: t('editor.translate_error'),
      description: (error as Error).message,
      color: 'error',
      icon: 'i-hugeicons:alert-02',
    })
  }
  finally {
    loading.value = false
  }
}

async function submit() {
  loading.value = true
  try {
    if (file.value) {
      const imgUrl = await uploadFile(file.value)
      newItem.value.img = imgUrl
    }
    await supabase
      .from('menu_items')
      .insert([{
        ...newItem.value,
        options: options.value.length ? options.value : null,
        badges: badges.value.length ? badges.value : null,
      }])
    await props.refresh()
    // reset newItem to initial state
    newItem.reset()
    toast.add({
      title: t('editor.item_success'),
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    isOpen.value = false
  }
  catch (error) {
    toast.add({
      title: t('editor.item_error'),
      description: (error as Error).message,
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
  <UModal
    v-model:open="isOpen"
    :title="$t('editor.new_item')"
    fullscreen
    :ui="{ footer: 'max-w-xl w-full mx-auto grid grid-cols-2 gap-4' }"
  >
    <UButton
      variant="subtle"
      icon="i-hugeicons:plus-sign-square"
      :label="$t('editor.new_item')"
    />
    <template #body>
      <UPageCard
        variant="soft"
        class="max-w-xl mx-auto w-full"
      >
        <div class="px-4 py-6">
          <UForm
            :state="newItem"
            class="space-y-6"
          >
            <div class="flex justify-between w-full">
              <AdminFormLang v-model:lang="lang" />
              <UButton
                type="button"
                variant="subtle"
                :label="$t('editor.ai_translate')"
                color="neutral"
                leading-icon="i-hugeicons:chat-gpt"
                :loading="loading"
                :disabled="loading"
                @click="translateItem"
              />
            </div>
            <USeparator />
            <UFormField
              v-if="lang === 'fa'"
              :label="$t('editor.name_fa')"
              required
            >
              <UInput
                v-model="newItem.name_fa"
                dir="rtl"
              />
            </UFormField>
            <UFormField
              v-if="lang === 'en'"
              dir="ltr"
              :label="`Name in English | ${$t('editor.name_en')}`"
            >
              <UInput v-model="newItem.name_en" />
            </UFormField>
            <UFormField
              v-if="lang === 'fr'"
              dir="ltr"
              :label="`Name in French | ${$t('editor.name_fr')}`"
            >
              <UInput
                v-model="newItem.name_fr"
                class="w-full"
              />
            </UFormField>
            <USeparator />
            <UFormField
              :label="$t('editor.price_hezar')"
              :description="$t('editor.price_desc')"
              required
            >
              <UInput
                v-model="newItem.price"
                type="number"
              />
            </UFormField>
            <USeparator />
            <UFormField
              :label="$t('editor.image')"
              description=""
            >
              <UFileUpload
                v-model="file"
                accept="image/*"
                icon="i-lucide-image"
                label="Drop your image here"
                class="w-full min-h-48"
              />
            </UFormField>
            <USeparator />
            <UFormField
              v-if="lang === 'fa'"
              dir="rtl"
              :label="$t('editor.desc_fa')"
            >
              <UTextarea
                v-model="newItem.description_fa"
                autoresize
              />
            </UFormField>
            <UFormField
              v-if="lang === 'en'"
              dir="ltr"
              :label="`Description English | ${$t('editor.desc_en')}`"
            >
              <UTextarea
                v-model="newItem.description_en"
                autoresize
              />
            </UFormField>
            <UFormField
              v-if="lang === 'fr'"
              dir="ltr"
              :label="`Description French | ${$t('editor.desc_fr')}`"
            >
              <UTextarea
                v-model="newItem.description_fr"
                autoresize
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="options"
              :label="$t('editor.extras')"
            >
              <div
                v-if="options.length"
              >
                <div
                  v-for="(option, index) in options"
                  :key="index"
                  class="grid grid-cols-6 gap-x-2 mb-2 items-center"
                >
                  <UButton
                    icon="i-hugeicons:delete-02"
                    variant="link"
                    color="error"
                    class="col-span-1"
                    @click="options.splice(index, 1)"
                  />
                  <UInput
                    v-model="options[index]![`name_${lang}`]"
                    :placeholder="$t('editor.item_name')"
                    class="w-full col-span-3"
                    :dir="lang === 'fa' ? 'rtl' : 'ltr'"
                  />
                  <UInput
                    v-model="options[index]!.price"
                    type="number"
                    class="w-full col-span-2"
                    :label="$t('editor.price_hezar')"
                  />
                </div>
              </div>
              <UButton
                type="button"
                :label="`+ ${$t('editor.add_extra')}`"
                variant="link"
                color="primary"
                class="col-span-1 w-full"
                @click="options.push({ price: 0, name_en: '', name_fa: '', name_fr: '' })"
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="badges"
              :label="$t('editor.badges_title')"
              :description="$t('editor.badges_desc')"
            >
              <div
                v-if="badges.length"
                class="py-4"
              >
                <div
                  v-for="(badge, index) in badges"
                  :key="index"
                  class="grid grid-cols-6 gap-x-2 mb-2 items-center"
                >
                  <UButton
                    icon="i-hugeicons:delete-02"
                    variant="link"
                    color="error"
                    class="col-span-1"
                    @click="badges.splice(index, 1)"
                  />
                  <UInput
                    v-model="badges[index]![`name_${lang}`]"
                    :placeholder="$t('editor.item_name')"
                    class="w-full col-span-5"
                    :dir="lang === 'fa' ? 'rtl' : 'ltr'"
                  />
                </div>
              </div>
              <UButton
                type="button"
                :label="`+ ${$t('editor.add_extra')}`"
                variant="link"
                color="primary"
                class="col-span-1 w-full"
                @click="badges.push({ name_en: '', name_fa: '', name_fr: '' })"
              />
            </UFormField>
          </UForm>
        </div>
      </UPageCard>
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
        @click="submit"
      />
    </template>
  </UModal>
</template>
