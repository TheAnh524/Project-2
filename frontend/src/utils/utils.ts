export async function urlToFileAuto(url: string): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()

  // Lấy tên file từ URL
  const filename = url.split('/')?.pop()?.split('?')[0]

  // Lấy mime type từ blob
  const mimeType = blob.type || 'application/octet-stream'

  return new File([blob], filename || 'default', { type: mimeType })
}

export const isSameFile = (f1: File | null, f2: File) => {
  if (!f1) return false
  return f1.name === f2.name && f1.size === f2.size && f1.type === f2.type
}
