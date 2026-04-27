import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const { data: hours } = await supabase.from('hours').select().order('id', { ascending: true })
  // console.log('Fetched hours:', hours)
  return hours
})
