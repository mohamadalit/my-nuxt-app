<script setup lang="ts">
const { data: hours, refresh, pending } = await useFetch<Tables<'hours'>[]>('/api/v1/hours', {
  key: 'hours',
  default: () => ([]),
  deep: true,
  server: false,
})

const { t, locale } = useI18n()
const lang = ref(locale.value)
const toast = useToast()
const supabase = useSupabaseClient()
const loading = ref(false)

// Track original data for comparison
const originalHours = ref<Tables<'hours'>[]>([])

// Initialize original data snapshot
watchEffect(() => {
  if (!pending.value && hours.value?.length && !originalHours.value.length) {
    originalHours.value = JSON.parse(JSON.stringify(hours.value))
  }
})

// Computed property to check if there are unsaved changes
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(hours.value) !== JSON.stringify(originalHours.value)
})

async function translateItem() {
  loading.value = true
  try {
    const response = await $fetch<Tables<'hours'>[]>('/api/v1/translate', {
      method: 'POST',
      body: hours.value,
    })
    hours.value = response
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

async function updateHours() {
  if (!hasUnsavedChanges.value) {
    toast.add({
      title: 'No changes to save',
      color: 'info',
      icon: 'i-hugeicons:information-circle',
    })
    return
  }
  loading.value = true

  try {
    // Find items to remove (existed in original but not in current)
    const toRemove = originalHours.value.filter(
      original => !hours.value.some(current => current.id === original.id),
    )

    // Delete removed items
    if (toRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from('hours')
        .delete()
        .in('id', toRemove.map(item => item.id))

      if (deleteError) throw deleteError
    }

    // Upsert current items
    if (hours.value.length > 0) {
      const { error: upsertError } = await supabase
        .from('hours')
        .upsert(hours.value)

      if (upsertError) throw upsertError
    }

    await refresh()

    // Update the snapshot after successful save
    originalHours.value = JSON.parse(JSON.stringify(hours.value))

    toast.add({
      title: 'Hours updated successfully',
      color: 'success',
      icon: 'i-hugeicons:checkmark-circle-02',
    })
    loading.value = false
  }
  catch (error: any) {
    console.error('Error updating hours:', error)
    toast.add({
      title: 'Failed to update hours',
      description: error.message || 'An unexpected error occurred',
      color: 'error',
      icon: 'i-hugeicons:alert-02',
    })
    loading.value = false
  }
}
</script>

<template>
  <UDashboardPanel
    id="editor-index"
  >
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse
            class="rtl:rotate-180"
          />
          <span class="text-highlighted">{{ $t('editor.hours') }}</span>
        </template>
        <template #right>
          <UButton
            v-if="hasUnsavedChanges"
            :label="$t('editor.save')"
            variant="subtle"
            color="success"
            :loading="loading"
            block
            @click="updateHours"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UPageCard
        v-if="!pending"
        variant="subtle"
        class="max-w-xl"
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
        <UForm
          :state="hours"
          class="grid grid-cols-2 gap-2"
          @submit="updateHours"
        >
          <UFormField
            name="period"
            :label="$t('editor.period')"
            :ui="{ label: 'ms-12' }"
            class=""
          >
            <div class="flex flex-col space-y-2">
              <div
                v-for="item, index in hours"
                :key="index"
                class="flex flex-row items-center space-x-2 w-full"
              >
                <UButton
                  icon="i-hugeicons:delete-02"
                  variant="link"
                  color="error"
                  @click="hours.splice(index, 1)"
                />
                <UInput
                  v-model="item[`period_${lang}`]"
                  class="w-full"
                />
              </div>
            </div>
          </UFormField>
          <UFormField
            name="time"
            :label="$t('editor.time')"
            class=""
          >
            <div class="flex flex-col space-y-2">
              <div
                v-for="item, index in hours"
                :key="index"
                class=""
              >
                <UInput
                  v-model="item[`time_${lang}`]"
                  class="w-full"
                />
              </div>
            </div>
          </UFormField>
          <UButton
            type="button"
            :label="`+ ${$t('editor.new_item')}`"
            variant="link"
            color="primary"
            class="col-span-1 w-full"
            @click="hours.push({ id: hours.length + 1, period_en: '', period_fa: '', period_fr: '', time_en: '', time_fa: '', time_fr: '' })"
          />
          <UButton
            v-if="hasUnsavedChanges"
            :label="$t('editor.save')"
            variant="subtle"
            color="success"
            :loading="loading"
            block
            @click="updateHours"
          />
        </UForm>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
