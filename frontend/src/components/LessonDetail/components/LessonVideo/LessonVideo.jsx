import { Button } from '@/components/ui/button'
import { Lesson } from '@/types/lesson.type'
import { dateFormatted } from '@/utils/formatDate'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { FC, useState } from 'react'
import TextEditor from '@/shared/components/TextEditor'
import {
  CommentKey,
  createComment,
  deleteComment,
  getAllComments,
} from '@/services/CommentServices'
import { useQuery } from '@tanstack/react-query'
import { Comment } from '@/types/comment.type'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'react-toastify'
import queryClient from '@/config/reactQuery'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppSelector } from '@/store/hooks'
import { selectAuth } from '@/store/auth/auth.slice'
import { Trash2 } from 'lucide-react'

interface LessonVideoProp {
  lesson: Lesson
}

const LessonVideo: FC<LessonVideoProp> = ({ lesson }) => {
  const [comment, setComment] = useState('')
  const { data: listcommentsRes } = useQuery({
    queryKey: [CommentKey, lesson],
    queryFn: () => getAllComments(lesson._id),
  })

  const auth = useAppSelector(selectAuth)

  const listcomments: Comment[] = listcommentsRes?.data || []

  const handleSubmitComment = async () => {
    try {
      if (!comment) {
        toast.error('Vui lòng nhập bình luận')
        return
      }

      const res = await createComment({
        content: comment,
        lesson: lesson._id,
      })

      if (res.status === 201) {
        setComment('')
        toast.success('Thêm bình luận thành công')
        // refetch comments
        queryClient.refetchQueries({
          queryKey: [CommentKey, lesson],
        })
        return
      }

      toast.error('Thêm bình luận thất bại')
    } catch (error) {
      toast.error('Thêm bình luận thất bại')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await deleteComment(commentId)

      if (res.status === 200) {
        toast.success('Xóa bình luận thành công')
        // refetch comments
        queryClient.refetchQueries({
          queryKey: [CommentKey, lesson],
        })
        return
      }

      toast.error('Xóa bình luận thất bại')
    } catch (error) {
      toast.error('Xóa bình luận thất bại')
    }
  }

  return (
    <div className="w-full relative">
      <div className="w-full h-[580px]">
        <video controls className="w-full h-full">
          <source src={lesson.videoUrl} />
        </video>
      </div>
      <div className="flex w-full  px-4 mt-4">
        <div className="w-11/12">
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <span className="text-muted-foreground">
            Cập nhật {dateFormatted(lesson.updatedAt)}
          </span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" variant="outline">
              Bình luận
            </Button>
          </DialogTrigger>
          <DialogContent className="w-4xl max-w-full sm:max-w-full h-[600px] max-h-full flex flex-col">
            <DialogTitle className="text-xl font-bold">
              Danh sách bình luận
            </DialogTitle>
            <div className="flex-1">
              <ScrollArea className="h-[450px] w-full rounded-md border p-4">
                {listcomments.map((comment) => (
                  <div className="w-11/12" key={comment._id}>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-semibold text-[#0093fc]">
                        {comment.user.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dateFormatted(comment.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center mt-1">
                      <Card className="p-2">
                        <CardContent className=" gap-4 p-0">
                          <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html: comment.content,
                            }}
                          ></div>
                        </CardContent>
                      </Card>
                      {auth.user._id === comment.user._id && (
                        <>
                          <Button
                            size={'icon'}
                            variant={'outline'}
                            className="cursor-pointer"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2 className="text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mb-4"></div>
              </ScrollArea>
            </div>
            <div className="flex items-center justify-between w-full px-4 py-2 border-t border-slate-200 dark:border-slate-700 gap-4">
              <TextEditor
                className="flex-1 outline-none"
                onChange={setComment}
                value={comment}
                placeholder="Nhập bình luận của bạn..."
                onkeydown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault()
                    handleSubmitComment()
                  }
                }}
              />
              <Button variant="outline" onClick={handleSubmitComment}>
                Gửi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default LessonVideo
