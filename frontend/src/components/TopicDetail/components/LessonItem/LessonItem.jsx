import { LessonType } from '@/enums/LessonTypeEnum'
import { cn } from '@/lib/utils'
import { Lesson } from '@/types/lesson.type'
import { FileText, TvMinimalPlay } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router'

interface LessonItemProp {
  lesson: Lesson
  active?: boolean
}

const LessonItem: FC<LessonItemProp> = ({ lesson, active = false }) => {
  return (
    <Link to={`/topics/${lesson.topic}/learning/${lesson._id}`}>
      <div
        className={cn(
          'flex w-full px-6 py-4 gap-8 items-center border rounded-lg mt-4',
          active && 'text-blue-700'
        )}
      >
        <div>
          <div>{lesson.type === LessonType.QuizExercise && <FileText />}</div>
          <div>
            {lesson.type === LessonType.VideoLecture && <TvMinimalPlay />}
          </div>
        </div>

        <div>{lesson.title}</div>
      </div>
    </Link>
  )
}

export default LessonItem
