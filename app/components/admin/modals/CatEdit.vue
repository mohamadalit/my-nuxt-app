<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const supabase = useSupabaseClient()
const { t, locale } = useI18n()
const lang = ref(locale.value)
const isOpen = ref(false)
const state = defineModel<Tables<'categories'>>('cat', { required: true })

const props = defineProps<{
  catId: string
  refresh: () => Promise<void>
}>()

const { data: icons } = await supabase.from('icons').select()

const schema = z.object({
  id: z.string().min(1),
  name_fa: z.string().min(1, t('editor.required')),
  name_en: z.string(),
  name_fr: z.string(),
  icon: z.string().min(1, t('editor.required')),
  order: z.number(),
})

type Schema = z.output<typeof schema>

const formRef = useTemplateRef('editCatForm')
const loading = ref(false)
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

async function editCat(event: FormSubmitEvent<Schema>) {
  if (!event.data) return
  try {
    loading.value = true
    state.value.id = slugify(state.value.name_en)

    await supabase.from('categories').update(state.value).eq('id', props.catId)
    await props.refresh()
    toast.add({
      title: t('editor.update_success'),
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    isOpen.value = false
  }
  catch (error) {
    console.error('Error editing category:', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('editor.edit_cat')"
  >
    <UButton
      :label="$t('editor.edit')"
      color="neutral"
      variant="subtle"
      size="sm"
      block
      icon="i-hugeicons:pencil-edit-02"
    />
    <template #body>
      <UForm
        ref="editCatForm"
        :state="state"
        :schema="schema"
        class="space-y-4"
        @submit="editCat"
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
          required
        >
          <UInput v-model="state.name_en" />
        </UFormField>
        <UFormField
          v-if="lang === 'fr'"
          dir="ltr"
          :label="`Name in French | ${$t('editor.name_fr')}`"
          name="name_fr"
          required
        >
          <UInput v-model="state.name_fr" />
        </UFormField>
        <UFormField
          :label="$t('editor.icon')"
          name="icon"
          required
          :ui="{ wrapper: '' }"
        >
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
                @click="state.icon = icon.path"
              >
                <img
                  :src="icon.path"
                  alt=""
                  class="h-12 w-12 dark:invert"
                >
                <div
                  v-if="icon.path === state.icon"
                  class="absolute inset-0 rounded-xl bg-green-500/50"
                />
              </UPageCard>
            </div>
          </div>
          <UInput
            v-model="state.icon"
            class="hidden"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        :label="$t('editor.cancel')"
        color="neutral"
        block
        @click="refresh(); isOpen = false"
      />
      <UButton
        :label="$t('editor.save')"
        color="success"
        variant="subtle"
        block
        :loading="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
