export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Use the AI translate function
    const result = await aiTranslate(body)
    return result
  }
  catch (error) {
    console.error('Translation API error:', error)

    // Handle other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Translation failed',
    })
  }
})
