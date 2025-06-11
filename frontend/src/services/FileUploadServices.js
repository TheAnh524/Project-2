import http from '@/config/http'

export const uploadSingleFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await http.post('uploads/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response
}
