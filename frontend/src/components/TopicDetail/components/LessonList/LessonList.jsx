import { useQuery } from '@tanstack/react-query'
import LessonItem from '../LessonItem'
import { getAllLessons, LessonKey } from '@/services/LessonServices'
import { useParams } from 'react-router'
import { Lesson } from '@/types/lesson.type'
import { FC } from 'react'

interface LessonListProp {
  currentLesson?: string
}

const LessonList: FC<LessonListProp> = ({ currentLesson }) => {
  const { topicId } = useParams()

  const { data: lessonListRes } = useQuery({
    queryKey: [LessonKey, 'from', topicId],
    queryFn: () => getAllLessons(topicId ?? ''),
  })

  const lessonList: Lesson[] = lessonListRes?.data ?? []
  return (
    <div className="mt-4 w-full">
      {lessonList.map((lesson) => (
        <LessonItem
          key={lesson._id}
          lesson={lesson}
          active={currentLesson === lesson._id}
        />
      ))}
    </div>
  )
}

export default LessonList
