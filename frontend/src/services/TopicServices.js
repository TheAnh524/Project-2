import http from '@/config/http'

export interface FormTopicDto {
  name: string
  image: string
}

export const TopicKey = 'topics'

export const getAllTopics = () => {
  return http.get('topics')
}

export const getTopicDetail = (topicId: string) => {
  return http.get(`topics/${topicId}`)
}

export const createTopic = (data: FormTopicDto) => {
  return http.post('topics', data)
}

export const updateTopic = (topicId: string, data: FormTopicDto) => {
  return http.patch(`topics/${topicId}`, data)
}

export const deleteTopic = (topicId: string) => {
  return http.delete(`topics/${topicId}`)
}
