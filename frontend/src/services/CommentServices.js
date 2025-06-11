import http from '@/config/http'

export interface FormCommentDto {
  lesson: string
  content: string
}

export const CommentKey = 'comments'

export const getAllComments = (lessonId: string) => {
  return http.get(`lessons/${lessonId}/comments`)
}

export const getCommentDetail = (commentId: string) => {
  return http.get(`comments/${commentId}`)
}

export const createComment = (data: FormCommentDto) => {
  return http.post('comments', data)
}

export const updateComment = (commentId: string, data: FormCommentDto) => {
  return http.patch(`comments/${commentId}`, data)
}

export const deleteComment = (commentId: string) => {
  return http.delete(`comments/${commentId}`)
}
