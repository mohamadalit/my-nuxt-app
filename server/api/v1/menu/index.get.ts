import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const { data: menu } = await supabase.from('menu_items').select().order('order', { ascending: true })
  return menu
})
