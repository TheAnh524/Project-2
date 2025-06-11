export interface Questions {
  question: string
  options: Record<string, string>
  correctAnswer: string
}

export interface Lesson {
  _id: string
  title: string
  number: number
  type: string
  topic: string
  createdAt: string
  updatedAt: string
  videoUrl?: string
  questions?: Questions[]
}
