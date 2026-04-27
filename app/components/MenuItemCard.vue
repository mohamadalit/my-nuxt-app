<script setup lang="ts">
const { addItem } = useCart()
const props = defineProps <{
  item: MenuItem
}>()
const selectedOption = ref<string | undefined>(
  props.item.options && props.item.options.length ? props.item.options[0]?.name_fa : undefined,
)
const totalPrice = computed(() => {
  if (!props.item.options?.length) {
    return props.item.price
  }

  const selectedOptionData = props.item.options.find((option: Extras) => {
    return option.name_fa === selectedOption.value
  })

  return props.item.price + (selectedOptionData?.price || 0)
})
</script>

<template>
  <UPageCard
    :orientation="item.img ? 'horizontal' : 'vertical'"
    :title="item[`name_${$i18n.locale}`]"
    :description="item[`description_${$i18n.locale}`]"
    variant="subtle"
    :ui="{
      footer: 'flex flex-col w-full space-y-4',
      description: 'whitespace-pre-wrap',
    }"
  >
    <template #footer>
      <URadioGroup
        v-if="item.options && item.options.length"
        v-model="selectedOption"
        indicator="hidden"
        variant="table"
        orientation="vertical"
        :items="item.options"
        label-key="name_fa"
        value-key="name_fa"
        class="w-max"
        color="primary"
        size="sm"
        :ui="{
          wrapper: 'flex flex-row w-max justify-between space-x-6',
          container: '',
        }"
      >
        <template #description="{ item: test }">
          <p
            v-if="test.price > 0"
            dir="ltr"
          >
            +{{ test.price.toLocaleString($i18n.locale) }}
          </p>
        </template>
      </URadioGroup>
      <ul
        v-if="item.badges && item.badges.length"
        class="list-disc list-inside text-xs text-muted space-y-1"
      >
        <li
          v-for="badge in item.badges"
          :key="badge.name_en"
          class=""
        >
          {{ badge[`name_${$i18n.locale}`] }}
        </li>
      </ul>
      <div class="flex w-full items-center justify-between text-lg font-semibold">
        <div class="flex flex-row items-center gap-2 font-vazir">
          <p>{{ totalPrice.toLocaleString($i18n.locale) }}</p>
          <div class="flex flex-col items-center text-xs font-light leading-3">
            <p>{{ $t('menu.hezar') }}<br>{{ $t('menu.toman') }}</p>
          </div>
        </div>

        <UButton
          variant="outline"
          :label="item.available ? $t('add') : $t('menu.outofstock')"
          class="px-6 text-sm rtl:font-vazir rtl:font-bold"
          :disabled="!item.available"
          @click="addItem({ ...item, price: totalPrice })"
        />
      </div>
    </template>

    <!-- item image -->
    <img
      v-if="item.img"
      class="my-2 h-auto w-full max-w-2/3 mx-auto lg:max-w-full rounded-xl object-contain object-center drop-shadow-sm"
      :src="item.img"
      :alt="item[`name_${$i18n.locale}`]"
    >
  </UPageCard>
</template>
