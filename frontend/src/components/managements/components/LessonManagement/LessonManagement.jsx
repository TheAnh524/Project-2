import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import queryClient from '@/config/reactQuery'
import {
  deleteLesson,
  getAllLessons,
  LessonKey,
} from '@/services/LessonServices'
import { useLayoutEffect, useState } from 'react'
import { Lesson } from '@/types/lesson.type'
import { getAllTopics, TopicKey } from '@/services/TopicServices'
import { Topic } from '@/types/topic.type'
import { LessonType } from '@/enums/LessonTypeEnum'

const LessonManagement = () => {
  const [open, setOpen] = useState(false)
  const [topicId, setTopicId] = useState<string>('')

  const naviage = useNavigate()
  const handleNavigate = (url: string) => {
    naviage(url)
  }

  const { data: topicListRes } = useQuery({
    queryKey: [TopicKey],
    queryFn: getAllTopics,
  })

  const topicList: Topic[] = topicListRes?.data || []

  const { data: lessonListRes } = useQuery({
    queryKey: [LessonKey, 'from', topicId],
    queryFn: async () => {
      if (topicId) {
        return await getAllLessons(topicId ?? '')
      }
      return {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }
    },
  })

  const lessonList: Lesson[] = lessonListRes?.data ?? []

  useLayoutEffect(() => {
    const topicIdLs = localStorage.getItem('topicId')
    if (topicIdLs) {
      setTopicId(topicIdLs)
    }
  }, [])

  const handleSelectTopic = (topicId: string) => {
    setTopicId(topicId)
    localStorage.setItem('topicId', topicId)
  }

  const handleDeteLesson = async (lessonId: string) => {
    try {
      const res = await deleteLesson(lessonId)
      if (res.status !== 200) {
        toast.error('Lỗi khi xóa bài học')
        return
      }

      queryClient.refetchQueries({
        queryKey: [LessonKey, 'from', topicId],
      })

      toast.success('Xóa bài học thành công')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="flex gap-24">
        <h2 className="text-2xl font-bold mb-5">Quản lý bài học</h2>
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[400px] justify-between"
              >
                {topicId
                  ? topicList.find((topic) => topic._id === topicId)?.name
                  : 'Chọn chủ đề...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>Không có chủ đề phù hợp.</CommandEmpty>
                  <CommandGroup>
                    {topicList.map((topic) => (
                      <CommandItem
                        key={topic._id}
                        value={topic._id}
                        onSelect={(topicId) => {
                          handleSelectTopic(topicId)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            topicId === topic._id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {topic.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {topicId && (
        <>
          <Button
            className="mb-5 cursor-pointer"
            variant="outline"
            onClick={() => handleNavigate('/management/lessons/create')}
          >
            Thêm bài học
          </Button>

          <Table className="border border-gray-300 rounded-md">
            <TableCaption>Danh sách các bài học</TableCaption>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[100px]">Bài số</TableHead>
                <TableHead>Loại bài</TableHead>
                <TableHead>Tên bài học</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonList.map((lesson) => (
                <TableRow key={lesson._id} className="border-b border-gray-200">
                  <TableCell>{lesson.number}</TableCell>
                  <TableCell>
                    {lesson.type === LessonType.QuizExercise
                      ? 'Kiểm tra'
                      : 'Video'}
                  </TableCell>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell className="flex justify-end gap-10">
                    <Button
                      className="cursor-pointer"
                      variant={'outline'}
                      onClick={() =>
                        handleNavigate(`/management/lessons/${lesson._id}`)
                      }
                    >
                      Sửa
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          variant={'destructive'}
                        >
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn xóa ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể khôi phục, hãy chắc chắn
                            rằng bạn muốn xóa trước khi ấn nút tiếp tục
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Hủy
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => {
                              handleDeteLesson(lesson._id)
                            }}
                          >
                            Tiếp tục
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}

export default LessonManagement
