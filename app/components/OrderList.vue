<script setup lang="ts">
const { countCartItems, countCartTotal, cart, increaseQty, decreaseQty, clearItem } = useCart()
const isOpen = ref(false)
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    side="right"
    :title="$t('order.list')"
  >
    <UChip
      v-if="countCartItems > 0"
      size="3xl"
      class="fixed bottom-50 right-7 "
    >
      <UButton
        icon="i-twemoji-spiral-notepad"
        variant="subtle"
        size="lg"
      />
    </UChip>
    <!-- body -->
    <template #body>
      <div class="flex-grow p-4">
        <!-- cart items -->
        <section class="">
          <ul
            role="list"
            class="-my-6 divide-y divide-gray-200"
          >
            <li
              v-for="item in cart"
              :key="item.id"
              class="flex divide-y py-6"
            >
              <div class="ml-4 flex flex-1 flex-col">
                <div class="flex flex-col space-y-2">
                  <div class="flex justify-between font-vazir text-sm font-medium ">
                    <h3>{{ item[`name_${$i18n.locale}`] }}</h3>
                    <div
                      class="flex space-x-1"
                      dir="ltr"
                    >
                      {{ item.price.toLocaleString($i18n.locale) }} T
                    </div>
                  </div>
                  <p class="mt-1 text-balance text-xs text-gray-500">
                    {{ item[`description_${$i18n.locale}`] }}
                  </p>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <div class="flex items-center gap-4">
                    <UIcon
                      name="i-hugeicons:plus-sign"
                      class="bg-primary-500 h-5 w-5"
                      @click="increaseQty(item)"
                    />
                    <p class="font-vazir font-bold text-gray-500">
                      {{ item.qty.toLocaleString($i18n.locale) }}
                    </p>
                    <UIcon
                      name="i-hugeicons:minus-sign"
                      class="bg-primary-500 h-5 w-5"
                      @click="decreaseQty(item)"
                    />
                  </div>

                  <div class="flex">
                    <UButton
                      icon="i-hugeicons:delete-02"
                      variant="ghost"
                      class="text-red-400"
                      @click="clearItem(item)"
                    />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-col space-y-2 font-vazir w-full">
        <div class="flex justify-between text-sm font-medium ">
          <p>{{ $t('order.subtotal') }}</p>
          <p>{{ Math.round(countCartTotal).toLocaleString($i18n.locale) }}</p>
        </div>
        <div class="flex justify-between text-xs font-medium ">
          <p>{{ $t('order.vat') }}</p>
          <p>{{ Math.round(countCartTotal * 0.09).toLocaleString($i18n.locale) }}</p>
        </div>
        <div class="flex justify-between border-t pt-2 text-base font-medium ">
          <p>{{ $t('order.total') }}</p>
          <div class="flex flex-row items-center gap-2 font-vazir">
            <p>
              {{
                Math.round(countCartTotal * 0.09 + countCartTotal).toLocaleString(
                  $i18n.locale,
                )
              }}
            </p>
            <div class="flex flex-col items-center text-xs font-semibold leading-3">
              <p>{{ $t('menu.hezar') }} {{ $t('menu.toman') }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
