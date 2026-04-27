import OpenAI from 'openai'
import { z } from 'zod'

export async function aiTranslate(body: MenuItem | Tables<'categories'> | Tables<'hours'>[]): Promise<MenuItem | Tables<'categories'> | Tables<'hours'>[]> {
  const { openaiApiKey } = useRuntimeConfig()
  const gpt = new OpenAI({
    apiKey: openaiApiKey,
    baseURL: 'https://api.openai.com/v1',
  })

  // Determine the type of input
  const bodyType = (() => {
    if ('icon' in body && !('description_fa' in body)) {
      return 'category'
    }
    else if ('description_fa' in body) {
      return 'menu_item'
    }
    else if ('period_fa' in body[0] && 'time_fa' in body[0]) {
      return 'hours'
    }
    return 'unknown'
  }) ()

  const prompt = `You are a professional translator for a restaurant menu system. Your task is to translate across Persian (fa), English (en), and French (fr).

Context: This is "Latelier de GZ", a Persian cafe/pastry/restaurant. You will receive 3 types of inputs from the user, instructions are commented next to each type:

1. category: "{
    icon: string; // return as is
    id: string; // return as is
    name_fa: string; // always use as source for translating to other languages
    name_en: string; // if empty, translate from Persian. If fa is updated but en is not, translate from updated fa
    name_fr: string; // if empty, translate from Persian. If fa is updated but fr is not, translate from updated fa
    order: number; // return as is
}"
2. menu item: "{
    available: boolean; // return as is
    category_id: string | null; // return as is
    description_fa: string; // optional field - if empty, return as is. If provided, use as source for translating to description_en and description_fr
    description_en: string; // if empty, translate from Persian description_fa. If description_fa is empty, return empty. If description_fa is updated but description_en is not, translate from updated description_fa
    description_fr: string; // if empty, translate from Persian description_fa. If description_fa is empty, return empty. If description_fa is updated but description_fr is not, translate from updated description_fa
    id: number; // return as is
    img: string; // return as is
    name_fa: string; // always use as source for translating to other languages
    name_en: string; // if empty, translate from Persian. If fa is updated but en is not, translate from updated fa
    name_fr: string; // if empty, translate from Persian. If fa is updated but fr is not, translate from updated fa
    price: number; // return as is
    options: {
      name_fa: string; // always use as source for translating to other languages
      name_en: string; // if empty, translate from Persian. If fa is updated but en is not, translate from updated fa
      name_fr: string; // if empty, translate from Persian. If fa is updated but fr is not, translate from updated fa
      price: number; // return as is
    }[] | null; // if null, return null
    badges: {
      name_fa: string; // always use as source for translating to other languages
      name_en: string; // if empty, translate from Persian. If fa is updated but en is not, translate from updated fa
      name_fr: string; // if empty, translate from Persian. If fa is updated but fr is not, translate from updated fa
    }[] | null; // if null, return null
}"
3. opening hours: "{
    id: number; // return as is
    period_fa: string; // always use as source for translating to other languages
    period_en: string; // if empty, translate from Persian. If fa is updated but en is not, translate from updated fa
    period_fr: string; // if empty, translate from Persian. If fa is updated but fr is not, translate from updated fa
    time_fa: string; // always use as source for translating to other languages
    time_en: string; // if empty, translate from Persian. If fa is updated but en is not, translate from updated fa
    time_fr: string; // if empty, translate from Persian. If fa is updated but fr is not, translate from updated fa
}[]"

Other Instructions:
- Maintain culinary accuracy and appeal in translations
- Preserve prices
- Sometimes user provides names or descriptions that are actually in English or French but written in Farsi letters to sound fancy - preserve those in "fa" and translate to English and French e.g. name_fa: "اگ" → name_en: "egg"

Examples:
Categories:
- "نوشیدنی" → "Beverages" → "Boissons"
- "غذاهای اصلی" → "Main Dishes" → "Plats Principaux"
- "دسر" → "Desserts" → "Desserts"

Menu Items:
- "هات چاکلت" → "Hot Chocolate" → "Chocolat Chaud"
- "سالاد میکس بریز" → "Mixed Berry Salad" → "Salade aux Baies Mixtes"
- "چای سیاه با هل" → "Black Tea with Cardamom" → "Thé Noir à la Cardamome"

opening hours:
- "شنبه تا چهارشنبه" → "Saturday to Wednesday" → "Samedi à Mercredi"
- "پنجشنبه و جمعه" → "Thursday and Friday" → "Jeudi et Vendredi"
`

  let schema: z.ZodSchema
  let schemaName: string

  if (bodyType === 'category') {
    schema = z.object({
      name_en: z.string(),
      name_fa: z.string(),
      name_fr: z.string(),
    })
    schemaName = 'category_schema'
  }
  else if (bodyType === 'menu_item') {
    schema = z.object({
      name_en: z.string(),
      name_fa: z.string(),
      name_fr: z.string(),
      description_en: z.string(),
      description_fa: z.string(),
      description_fr: z.string(),
      options: z.nullable(z.array(
        z.object({
          name_en: z.string(),
          name_fa: z.string(),
          name_fr: z.string(),
          price: z.number(),
        }),
      )),
      badges: z.nullable(z.array(
        z.object({
          name_en: z.string(),
          name_fa: z.string(),
          name_fr: z.string(),
        }),
      )),
    })
    schemaName = 'menu_item_schema'
  }
  else if (bodyType === 'hours') {
    schema = z.object({
      hours: z.array(
        z.object({
          id: z.number(),
          period_en: z.string(),
          period_fa: z.string(),
          period_fr: z.string(),
          time_en: z.string(),
          time_fa: z.string(),
          time_fr: z.string(),
        }),
      ),
    })
    schemaName = 'hours_schema'
  }
  else {
    console.error('AI translation failed: Unknown body type')
    return body
  }

  // Convert Zod schema to JSON Schema using Zod 4's built-in method
  const jsonSchema = z.toJSONSchema(schema, {
    target: 'draft-2020-12', // OpenAI requires Draft 2020-12
    unrepresentable: 'throw', // Throw errors for unrepresentable types
    cycles: 'ref', // Handle cycles with $ref (if any)
    reused: 'inline', // Inline reused schemas for simplicity
  })

  const response = await gpt.responses.parse({
    model: 'gpt-4o-mini',
    input: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: JSON.stringify(body),
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: schemaName, // Required by OpenAI
        schema: jsonSchema, // Pass the JSON Schema
        strict: true, // Enforce strict schema compliance
      },
    },
  })

  if (bodyType === 'hours') {
    const output = response.output_parsed as { hours: Tables<'hours'>[] } | null
    if (!output) {
      console.error('AI translation failed: No output parsed for hours')
      return body
    }
    return output.hours
  }
  else if (bodyType === 'menu_item') {
    const output = response.output_parsed as MenuItem | null
    if (!output) {
      console.error('AI translation failed: No output parsed for menu item')
      return body
    }
    return {
      ...body,
      ...output,
    }
  }
  else if (bodyType === 'category') {
    const output = response.output_parsed as Tables<'categories'> | null
    if (!output) {
      console.error('AI translation failed: No output parsed for category')
      return body
    }
    return {
      ...body,
      ...output,
    }
  }
  else {
    return body
  }
}
