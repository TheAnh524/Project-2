import { useParams } from 'react-router'
import LessonInfo from './components/LessonInfo'
import { useQuery } from '@tanstack/react-query'
import { getLessonDetail, LessonKey } from '@/services/LessonServices'
import { Lesson } from '@/types/lesson.type'
import LessonList from '../TopicDetail/components/LessonList'
import { ScrollArea } from '../ui/scroll-area'

const LessonDetail = () => {
  const { lessonId } = useParams()
  const { data: lessonDetailRes } = useQuery({
    queryKey: [LessonKey, 'detail', lessonId],
    queryFn: () => getLessonDetail(lessonId ?? ''),
  })

  const lessonDetail: Lesson = lessonDetailRes?.data
  return (
    <div>
      {lessonDetail && <title>{lessonDetail.title}</title>}
      <div className="h-[calc(100vh-4rem)] flex">
        <ScrollArea className="h-full flex-1 rounded-md border p-3">
          {lessonDetail && <LessonInfo lesson={lessonDetail} />}
        </ScrollArea>
        <div className="h-full w-[350px] rounded-md border p-3">
          <h2 className="font-bold pl-1">Nội dung khóa học</h2>
          <ScrollArea className="h-11/12 w-full">
            <LessonList currentLesson={lessonId} />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default LessonDetail
