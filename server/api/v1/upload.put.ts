export default eventHandler(async (event) => {
  try {
    const storage = useStorage('r2')
    const form = await readFormData(event)
    const file = form.get('file') as File

    if (!file || !file.size) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    const key = `gz/${crypto.randomUUID()}-${file.name}`
    const buffer = await file.arrayBuffer()

    // Use unstorage with proper options for binary files
    await storage.setItemRaw(key, new Uint8Array(buffer), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const url = `https://r2.latelierdegz.com/${key}`
    return { url }
  }
  catch (error) {
    console.error('Upload error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    throw createError({ statusCode: 500, message: 'File upload failed' })
  }
})
