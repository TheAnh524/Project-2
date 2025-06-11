import { User } from './core.type'

export interface Comment {
  _id: string
  lesson: string
  user: User
  content: string
  createdAt: string
  updatedAt: string
}
