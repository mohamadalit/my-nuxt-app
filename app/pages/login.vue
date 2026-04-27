<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const { t } = useI18n()
definePageMeta({
  layout: 'auth',
})

const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()
const supabase = useSupabaseClient()
const localePath = useLocalePath()
const loading = ref(false)

const fields = ref([
  // {
  //   name: 'email',
  //   type: 'text' as const,
  //   label: t('login_field_email_label'),
  //   placeholder: t('login_field_email_placeholder'),
  //   required: true,
  // },
  {
    name: 'password',
    label: t('password'),
    type: 'password' as const,
    placeholder: t('password'),
    required: true,

  },
])

const schema = z.object({
  password: z.string({ error: t('editor.required') }).min(1, { error: t('editor.required') }),
})

type Schema = z.output<typeof schema>

const errMsg = ref<string | undefined>(undefined)
const confirmMsg = ref<string | undefined>(undefined)

// auth based on email and password
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'info@latelierdegz.com',
      password: payload.data.password,
    })
    if (error) throw error
    if (data?.user?.confirmed_at) {
      navigateTo(localePath('/confirm'))
    }
    else {
      confirmMsg.value = 'Please Confirm Your Email Before Logging In.'
    }
  }
  catch (error: any) {
    errMsg.value = error.error_description || error.message || 'An unexpected error occurred.'
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  if (user.value) {
    // Get redirect path, and clear it from the cookie
    const path = redirectInfo.pluck()
    // Redirect to the saved path, or fallback to the app
    navigateTo(path || localePath('/editor'))
  }
})
</script>

<template>
  <UPage>
    <UAuthForm
      ref="auth"
      :fields="fields"
      icon="i-hugeicons:circle-lock-02"
      :title="$t('welcome')"
      :schema="schema"
      :submit="{
        label: $t('login'),
        color: 'primary',
        variant: 'subtle',
        loading: loading,
      }"
      class="min-w-xs"
      @submit="onSubmit"
    >
      <template #footer>
        <UAlert
          v-if="errMsg"
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="subtle"
          :title="errMsg"
        />
        <UAlert
          v-if="confirmMsg"
          variant="soft"
          color="success"
          icon="i-heroicons-shield-check-solid"
          :title="confirmMsg"
          class="mt-4"
        />
      </template>
    </UAuthForm>
  </UPage>
</template>
