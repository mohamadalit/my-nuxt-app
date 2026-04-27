<script setup lang="ts">
defineProps<{
  item: MenuItem
}>()
const isOpen = ref(false)
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('editor.preview_item')"
    :ui="{
      content: 'max-w-2xl',
    }"
  >
    <UButton
      :label="$t('editor.preview_item')"
      color="neutral"
      variant="subtle"
      size="sm"
      block
      icon="i-hugeicons:property-view"
    />
    <template #body>
      <MenuItemCard :item="item" />
    </template>
    <template #footer>
      <UButton
        variant="subtle"
        :label="$t('editor.close')"
        color="neutral"
        @click="isOpen = false"
      />
    </template>
  </UModal>
</template>
