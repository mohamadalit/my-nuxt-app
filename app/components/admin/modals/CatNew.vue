<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const props = defineProps <{
  refresh: () => Promise<void>
}>()

const supabase = useSupabaseClient()
const { t, locale } = useI18n()
const lang = ref(locale.value)
const isOpen = ref(false)

const { data: icons } = await supabase.from('icons').select()
const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true })
const schema = z.object({
  id: z.string(),
  name_fa: z.string().min(1, t('editor.required')),
  name_en: z.string(),
  name_fr: z.string(),
  icon: z.string().min(1, t('editor.required')),
})

type Schema = z.output<typeof schema>

const formRef = useTemplateRef('formRef')
const loading = ref(false)
const state = ref<Tables<'categories'>>({
  id: '',
  icon: '',
  name_en: '',
  name_fa: '',
  name_fr: '',
  order: count ? count + 1 : 0,
})

const toast = useToast()

async function translateItem() {
  loading.value = true
  try {
    const response = await $fetch<Tables<'categories'>>('/api/v1/translate', {
      method: 'POST',
      body: state.value,
    })
    state.value = { ...state.value, ...response }
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

async function addCat(event: FormSubmitEvent<Schema>) {
  if (!event) return
  loading.value = true
  try {
    if (!state.value.name_en) {
      await translateItem()
    }
    state.value.id = slugify(state.value.name_en)

    const { error } = await supabase
      .from('categories')
      .insert(state.value)

    if (error) throw error
    state.value = {
      id: '',
      icon: '',
      name_en: '',
      name_fa: '',
      name_fr: '',
      order: count ? count + 1 : 0,
    }
    await props.refresh()
    toast.add({
      title: t('editor.item_success'),
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    isOpen.value = false
  }
  catch (error: any) {
    toast.add({
      title: t('editor.item_error'),
      description: error.message || '',
      color: 'error',
      icon: 'i-hugeicons:alert-02',
    })
    console.error('Error adding category:', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('editor.newcat')"
  >
    <UButton
      :label="$t('editor.new_cat')"
      icon="i-hugeicons:plus-sign-square"
      variant="subtle"
      color="primary"
      block
    />
    <template #body>
      <UForm
        ref="formRef"
        :state="state"
        :schema="schema"
        class="space-y-4"
        @submit="addCat"
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
        <UFormField
          v-if="lang === 'fa'"
          :label="$t('editor.name_fa')"
          name="name_fa"
          required
        >
          <UInput
            v-model="state.name_fa"
            dir="rtl"
            class="font-vazir"
          />
        </UFormField>
        <UFormField
          v-if="lang === 'en'"
          dir="ltr"
          :label="`Name in English | ${$t('editor.name_en')}`"
          name="name_en"
        >
          <UInput v-model="state.name_en" />
        </UFormField>
        <UFormField
          v-if="lang === 'fr'"
          dir="ltr"
          :label="`Name in French | ${$t('editor.name_fr')}`"
          name="name_fr"
        >
          <UInput v-model="state.name_fr" />
        </UFormField>
        <UFormField
          :label="$t('editor.icon')"
          name="icon"
          required
          :ui="{ wrapper: '' }"
        >
          <UInput
            v-model="state.icon"
            type="hidden"
          />
          <div class="flex justify-between items-center space-x-4">
            <img
              :src="state.icon ? state.icon : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
              alt=""
              class="my-6 h-12 w-12 dark:invert"
            >
            <div class="grid max-h-36 grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto">
              <UPageCard
                v-for="icon in icons"
                :key="icon.path"
                class="relative flex justify-center cursor-pointer"
                :class="icon.path === state.icon ? 'border border-primary': ''"
                @click="state.icon = icon.path"
              >
                <img
                  :src="icon.path"
                  alt=""
                  class="h-12 w-12 dark:invert"
                >
              </UPageCard>
            </div>
          </div>
        </UFormField>
      </UForm>
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
        :label="$t('editor.newcat')"
        color="success"
        variant="subtle"
        block
        :loading="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
