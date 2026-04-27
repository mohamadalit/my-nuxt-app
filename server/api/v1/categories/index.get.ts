import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const { data: categories } = await supabase.from('categories').select().order('order', { ascending: true })
  return categories
})
