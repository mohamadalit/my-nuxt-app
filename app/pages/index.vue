<script setup lang="ts">
const { data: hours, pending } = await useFetch<Tables<'hours'>[]>('/api/v1/hours', {
  key: 'hours',
  default: () => ([]),
  deep: true,
  server: false,
})
onMounted(() => {
  useAnime({
    targets: '.logo-anime',
    opacity: [0, 1],
    easing: 'easeInOutQuad',
    duration: 1500,
  })
})
</script>

<template>
  <UPage>
    <UPageHero
      orientation="vertical"
      :ui="{
        container: 'min-h-[calc(100vh-64px-var(--ui-header-height))] h-full sm:gap-y-8',
        body: 'lg:py-0 lg:gap-y-6',
        wrapper: 'space-y-6',
      }"
      class="lg:py-0 lg:space-y-6"
    >
      <UColorModeImage
        alt="logo"
        class="logo-anime mx-auto"
        light="/logo-full-brand-light.svg"
        dark="/logo-full-brand-dark.svg"
        :width="180"
      />
      <!-- Hero -->
      <div class=" flex flex-col items-center justify-center space-y-4 max-w-xs mx-auto w-full">
        <UButton
          to="/menu"
          block
          variant="outline"
          color="primary"
          icon="i-twemoji-flag-iran"
          label="مشاهده منو"
          class="font-vazir"
          size="xl"
          dir="rtl"
        />
        <UButton
          to="/en/menu"
          block
          variant="outline"
          color="primary"
          icon="i-twemoji-flag-united-kingdom"
          label="See our menu"
          class="font-sans"
          size="xl"
          dir="ltr"
        />
        <UButton
          to="/fr/menu"
          block
          variant="outline"
          color="primary"
          icon="i-twemoji-flag-france"
          label="Voir le menu"
          class="font-sans"
          size="xl"
          dir="ltr"
        />
      </div>

      <UPageCard
        variant="subtle"
        class="max-w-2xl mx-auto w-full"
      >
        <UPageGrid class="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center justify-center">
          <div class="flex flex-col space-y-4 justify-center items-center">
            <UButton
              variant="link"
              color="neutral"
              icon="i-hugeicons:call"
              to="tel:+989121934393"
              target="_blank"
              class="text-highlighted font-sans"
              block
              :ui="{ leadingIcon: 'rtl:rotate-270' }"
            >
              <div class="flex items-center space-x-2 justify-center">
                <span class="">{{ $t('reserve') }}</span>
                <span
                  dir="ltr"
                  class=""
                >{{ $i18n.locale === 'fa' ? persianNumber('+98 912 193 43 93') : '+98 912 193 43 93' }}</span>
              </div>
            </UButton>
            <UButton
              variant="link"
              color="neutral"
              icon="i-hugeicons:pin-location-01"
              :label="$t('address')"
              to="https://maps.app.goo.gl/NW4ZtnwUuVbjDjAf9"
              target="_blank"
              class="text-highlighted"
              block
            />
          </div>
          <div
            v-if="pending"
            class="flex flex-col justify-center items-center"
          >
            <UBadge
              variant="soft"
              color="neutral"
              icon="i-hugeicons:clock-01"
              :label="$t('hours')"
              class="text-highlighted justify-center sm:justify-start"
              block
            />
            <div
              v-for="item, index in [1, 2, 3, 4, 5, 6, 7]"
              :key="index"
              class="flex justify-between text-muted w-52"
            >
              <USkeleton class="h-4 w-[250px]" />
              <USkeleton class="h-4 w-[100px]" />
            </div>
          </div>
          <div
            v-else
            class="flex flex-col justify-center items-center"
          >
            <UBadge
              variant="soft"
              color="neutral"
              icon="i-hugeicons:clock-01"
              :label="$t('hours')"
              class="text-highlighted justify-center sm:justify-start"
              block
            />
            <div
              v-for="item, index in hours"
              :key="index"
              class="flex justify-between text-muted w-52"
            >
              <span class="text-sm">{{ item[`period_${$i18n.locale}`] }}</span>
              <span class="text-sm">{{ item[`time_${$i18n.locale}`] }}</span>
            </div>
          </div>
        </UPageGrid>
      </UPageCard>
    </UPageHero>
  </UPage>
</template>
