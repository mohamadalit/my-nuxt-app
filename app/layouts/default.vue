<script setup lang="ts"></script>

<template>
  <div>
    <MainHeader />
    <UMain>
      <slot />
    </UMain>
    <div class="fixed inset-0 max-w-none -z-10 overflow-hidden">
      <img
        src="/bg1.svg"
        alt=""
        class="w-full h-full object-cover opacity-20"
      >
    </div>
    <MainFooter />
  </div>
</template>
