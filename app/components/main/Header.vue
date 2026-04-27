<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const yPos = ref(0)
onMounted(async () => {
  window.addEventListener('scroll', () => {
    yPos.value = window.scrollY
  })
})
</script>

<template>
  <UHeader
    dir="ltr"
    :toggle="false"
    :ui="{ body: 'h-full' }"
  >
    <template #left>
      <MainLogo class="h-6 w-auto" />
    </template>
    <template #right>
      <UColorModeButton class=" lg:flex" />
      <LocaleSwitch class="hidden lg:flex" />
      <MobileNav />
    </template>
  </UHeader>
  <UButton
    icon="i-hugeicons:arrow-up-02"
    :class="[yPos > 200 ? 'bottom-36 right-7 opacity-100' : 'invisible bottom-20 right-7 opacity-0', 'fixed z-20 p-2 transition-all duration-300']"
    variant="solid"
    @click="scrollToTop"
  />
</template>
