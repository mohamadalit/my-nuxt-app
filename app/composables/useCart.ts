export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => [])

  onMounted(() => {
    const storedCart = sessionStorage.getItem('cart')
    cart.value = storedCart ? JSON.parse(storedCart) : []
  })

  watch(
    cart,
    (newCart) => {
      sessionStorage.setItem('cart', JSON.stringify(newCart))
    },
    { deep: true },
  )

  const countCartItems = computed(() => {
    return cart.value.reduce((total, item) => total + item.qty, 0)
  })

  const countCartTotal = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.price * item.qty, 0)
  })

  function addItem(item: MenuItem) {
    const existingItem = cart.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.qty++
    }
    else {
      cart.value.push({ ...item, qty: 1 })
    }
  }

  // Remove a specific item from cart completely
  function clearItem(item: CartItem) {
    cart.value = cart.value.filter(x => x.id !== item.id)
  }

  // Increase quantity of an item
  function increaseQty(item: CartItem) {
    const existingItem = cart.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.qty++
    }
  }

  // Decrease quantity of an item (remove if qty reaches 1)
  function decreaseQty(item: CartItem) {
    const existingItem = cart.value.find(i => i.id === item.id)
    if (existingItem && existingItem.qty > 1) {
      existingItem.qty--
    }
  }

  return {
    cart,
    countCartItems,
    countCartTotal,
    addItem,
    clearItem,
    increaseQty,
    decreaseQty,
  }
}
