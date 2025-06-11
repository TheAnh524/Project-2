import http from '@/config/http'
import { Questions } from '@/types/lesson.type'

export interface FormUpdateLessonDto {
  title: string
  topic: string
  number: number
  videoUrl?: string
  questions?: Questions[]
}

export interface FormCreateVideoLessonDto {
  title: string
  topic: string
  videoUrl: string
}

export interface FormCreateQuizLessonDto {
  title: string
  topic: string
  questions: Questions[]
}

export const LessonKey = 'lessons'

export const getAllLessons = (topicId: string) => {
  return http.get(`topics/${topicId}/lessons`)
}

export const getLessonDetail = (lessonId: string) => {
  return http.get(`lessons/${lessonId}`)
}

export const createVideoLesson = (data: FormCreateVideoLessonDto) => {
  return http.post('lessons/video', data)
}

export const createQuizLesson = (data: FormCreateQuizLessonDto) => {
  return http.post('lessons/quiz', data)
}

export const updateLesson = (lessonId: string, data: FormUpdateLessonDto) => {
  return http.patch(`lessons/${lessonId}`, data)
}

export const deleteLesson = (lessonId: string) => {
  return http.delete(`lessons/${lessonId}`)
}
