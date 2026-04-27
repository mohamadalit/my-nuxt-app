// slugify a text
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w-]+/g, '') // remove all non-word chars
    .replace(/--+/g, '-') // replace multiple - with single -
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '') // trim - from end of text
}

// convert number to persian number
export function persianNumber(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, digit => persianDigits[+digit] || digit)
}

// upload file to server
export async function uploadFile(file: File): Promise<string> {
  const newFile = await webpConvert({ image: file, quality: 80 })
  const formData = new FormData()
  formData.append('file', newFile)

  try {
    const result = await $fetch<{ url: string }>('/api/v1/upload', {
      method: 'PUT',
      body: formData,
    })
    return result.url
  }
  catch (error) {
    console.error(error)
    return ''
  }
}

// convert to webp
export async function webpConvert({
  image,
  quality = 80,
}: {
  image: File
  quality?: number
}): Promise<File> {
  // Helper to clamp quality
  const q = Math.max(0, Math.min(100, Number(quality || 80)))

  // Build filename
  const fileName
    = image instanceof File
      ? image.name.replace(/\.[^/.]+$/, '') + '.webp'
      : 'webpfy.webp'

  try {
    // Create elements
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Failed to get canvas 2D context.')
      return image
    }

    // Create and use an object URL
    const objectUrl = URL.createObjectURL(image)
    img.src = objectUrl

    // Load with proper error handling and revoke the object URL afterwards
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        resolve()
      }
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Failed to load image.'))
      }
    })

    // Set canvas size with resize logic (max width 1536px)
    let { width, height } = img

    // Resize logic similar to sharp's fit: 'outside'
    if (width > 1536) {
      const ratio = 1536 / width
      width = 1536
      height = Math.round(height * ratio)
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    // Optional: detect WebP support for this canvas
    let webpSupported = true
    try {
      // toDataURL may be expensive but is a reliable feature check
      webpSupported
        = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
    catch {
      webpSupported = false
    }
    if (!webpSupported) {
      return image
    }

    // Convert to WebP using toBlob and properly reject if blob is null
    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to convert to WebP format.'))
        },
        'image/webp',
        q / 100,
      )
    })

    return new File([webpBlob], fileName)
  }
  catch {
    return image
  }
}
