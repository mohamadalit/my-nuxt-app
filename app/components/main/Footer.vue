<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <UFooter
    dir="ltr"
    :ui="{ top: 'border-b border-(--ui-border)' }"
    class="bg-default"
  >
    <template #left>
      <p class="text-sm text-(--ui-text-muted)">
        © {{ currentYear }} Latelier De GZ - All rights reserved.
      </p>
    </template>
    <template #right>
      <UButton
        to="https://www.instagram.com/latelier.de.gz"
        target="_blank"
        icon="i-hugeicons:instagram"
        aria-label="Instagram"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
