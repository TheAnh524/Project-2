import { LessonType } from '@/enums/LessonTypeEnum'
import { Lesson } from '@/types/lesson.type'
import { FC } from 'react'
import LessonVideo from '../LessonVideo'
import LessonQuizz from '../LessonQuizz'

interface LessonInfoProp {
  lesson: Lesson
}

const LessonInfo: FC<LessonInfoProp> = ({ lesson }) => {
  return (
    <>
      {lesson.type === LessonType.VideoLecture && (
        <LessonVideo lesson={lesson} />
      )}
      {lesson.type === LessonType.QuizExercise && (
        <LessonQuizz lesson={lesson} />
      )}
    </>
  )
}

export default LessonInfo
