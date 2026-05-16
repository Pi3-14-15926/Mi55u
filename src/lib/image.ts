export function convertToWebP(file: File, quality = 0.85): Promise<File> {
  if (!file.type.startsWith('image/')) return Promise.resolve(file)

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }

      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const name = file.name.replace(/\.[^.]+$/, '.webp')
          const webpFile = new File([blob], name, { type: 'image/webp' })
          resolve(webpFile)
        } else {
          resolve(file)
        }
      }, 'image/webp', quality)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}
