import type { Tables } from './database.types'

export type CartItem = MenuItem & { qty: number }

export type Extras = {
  name_en: string
  name_fa: string
  name_fr: string
  price: number
}

export type ItemBadge = {
  name_en: string
  name_fa: string
  name_fr: string
}

export type MenuItem = Tables<'menu_items'> & {
  options: Extras[] | null
  badges: ItemBadge[] | null
}
