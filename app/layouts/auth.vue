<script setup lang="ts">
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center">
    <MainLogo class="absolute top-8 left-8" />
    <UColorModeButton
      class="absolute top-8 right-8"
      variant="link"
      size="xl"
      color="neutral"
    />

    <UPageCard variant="subtle">
      <slot />
    </UPageCard>
    <div class="fixed inset-0 max-w-none -z-10 overflow-hidden">
      <img
        src="/bg1.svg"
        alt=""
        class="w-full h-full object-cover opacity-20"
      >
    </div>
  </div>
</template>
