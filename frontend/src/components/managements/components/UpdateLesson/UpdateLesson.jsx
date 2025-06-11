import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { uploadSingleFile } from '@/services/FileUploadServices'
import { useEffect, useState } from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import FileUpload from '@/shared/components/FileUpload'
import { LessonType } from '@/enums/LessonTypeEnum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  FormUpdateLessonDto,
  getLessonDetail,
  LessonKey,
  updateLesson,
} from '@/services/LessonServices'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Lesson } from '@/types/lesson.type'
import { isSameFile, urlToFileAuto } from '@/utils/utils'

const lessonTypeValues = Object.values(LessonType) as [string, ...string[]]

const QuestionSchema = z.object({
  question: z
    .string()
    .min(1, { message: 'Nội dung câu hỏi không được để trống.' }),
  options: z
    .record(z.string(), z.string())
    .refine((val) => Object.keys(val).length > 0, {
      message: 'Phải có ít nhất 1 đáp án.',
    }),
  correctAnswer: z.string().min(1, { message: 'Cần chọn đáp án đúng.' }),
})

const UpdateTopicSchema = z
  .object({
    title: z.string().min(1, { message: 'Tên bài giản không được để trống.' }),
    type: z.enum(lessonTypeValues, {
      required_error: 'Vui lòng chọn loại bài học.',
    }),
    number: z.number({
      message: 'Số thứ tự không được để trống.',
    }),
    video: z
      .instanceof(File, { message: 'Vui lòng chọn video hợp lệ.' })
      .optional(),
    questions: z.array(QuestionSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'videolecture') {
        return !!data.video
      }
      if (data.type === 'quizexercise') {
        return Array.isArray(data.questions) && data.questions.length > 0
      }
      return true
    },
    {
      message: 'Phải cung cấp video hoặc câu hỏi phù hợp với loại bài học.',
      path: ['type'],
    }
  )

const UpdateLesson = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [originalVideoFile, setOriginalVideoFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof UpdateTopicSchema>>({
    resolver: zodResolver(UpdateTopicSchema),
    defaultValues: {
      title: '',
      number: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const { lessonId } = useParams()
  const navigate = useNavigate()

  const { data: lessonRes } = useQuery({
    queryKey: [LessonKey, 'detail', lessonId],
    queryFn: () => getLessonDetail(lessonId ?? ''),
  })

  const lesson: Lesson = lessonRes?.data

  useEffect(() => {
    if (lesson) {
      form.setValue('title', lesson.title)
      form.setValue('type', lesson.type)
      form.setValue('number', lesson.number)
      if (lesson.type === LessonType.VideoLecture) {
        urlToFileAuto(lesson.videoUrl!).then((file) => {
          form.setValue('video', file)
          setOriginalVideoFile(file)
        })
      }
      form.setValue('questions', lesson.questions || [])
    }
  }, [lesson])

  const onSubmit = async (data: z.infer<typeof UpdateTopicSchema>) => {
    setIsLoading(true)

    try {
      let videoUrl = lesson.videoUrl
      if (lesson.type === LessonType.VideoLecture) {
        const videoChanged = !isSameFile(originalVideoFile, data.video!)
        if (videoChanged) {
          const videoRes = await uploadSingleFile(data.video!)
          if (videoRes.status !== 200) {
            toast.error('Tải video lên thất bại. Vui lòng thử lại sau.')
            return
          }
          videoUrl = videoRes.data.url
        }
      }

      const updateLessonData: FormUpdateLessonDto = {
        title: data.title,
        videoUrl: videoUrl,
        questions: data.questions,
        topic: lesson.topic,
        number: data.number,
      }

      const UpdateTopicRes = await updateLesson(lesson._id, updateLessonData)
      if (UpdateTopicRes.status === 200) {
        toast.success('Cập nhật bài học thành công.')
        navigate(-1)
        return
      }

      toast.error('Cập nhật bài học thất bại. Vui lòng thử lại sau.')
    } catch (error) {
      toast.error('Cập nhật bài học thất bại. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center flex-col">
      <h2 className="text-3xl font-bold mb-5">Cập nhật bài học mới</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-xl"
        >
          {/* Tên bài giản */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bài học</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Nhập môn ngành" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự bài học</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.currentTarget.value)}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại bài học</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại bài học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={LessonType.QuizExercise}>
                      Bài tập trắc nghiệm
                    </SelectItem>
                    <SelectItem value={LessonType.VideoLecture}>
                      Bài giảng video
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('type') === LessonType.VideoLecture && (
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video bài giản</FormLabel>
                  <FormControl>
                    <FileUpload
                      onChange={field.onChange}
                      value={field.value}
                      type="video/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('type') === LessonType.QuizExercise && (
            <div className="space-y-4">
              <Label className="text-base">Danh sách câu hỏi</Label>

              {fields.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-md space-y-4">
                  {/* Nội dung câu hỏi */}
                  <FormField
                    control={form.control}
                    name={`questions.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Câu hỏi {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập nội dung câu hỏi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Đáp án (dạng object key-value) */}
                  <FormField
                    control={form.control}
                    name={`questions.${index}.options`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đáp án</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {Object.entries(field.value || {}).map(
                              ([key, val]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    value={val}
                                    onChange={(e) => {
                                      const updated = {
                                        ...field.value,
                                        [key]: e.target.value,
                                      }
                                      field.onChange(updated)
                                    }}
                                    placeholder={`Đáp án ${key.toUpperCase()}`}
                                  />
                                  {+key ===
                                    Object.keys(field.value || {}).length && (
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="destructive"
                                      onClick={() => {
                                        const updated = { ...field.value }
                                        delete updated[key]
                                        field.onChange(updated)
                                      }}
                                    >
                                      X
                                    </Button>
                                  )}
                                </div>
                              )
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const nextKey =
                                  Object.keys(field.value || {}).length + 1
                                field.onChange({
                                  ...field.value,
                                  [nextKey.toString()]: '',
                                })
                              }}
                            >
                              + Thêm đáp án
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Đáp án đúng */}
                  <FormField
                    control={form.control}
                    name={`questions.${index}.correctAnswer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đáp án đúng</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn đáp án đúng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(
                              form.watch(`questions.${index}.options`) || {}
                            ).map(([key, val]) => (
                              <SelectItem key={key} value={key}>
                                {val || `Đáp án ${key}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Xoá câu hỏi
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() =>
                  append({
                    question: '',
                    options: {},
                    correctAnswer: '',
                  })
                }
              >
                + Thêm câu hỏi
              </Button>
            </div>
          )}

          {/* Nút submit */}
          <Button disabled={isLoading} className="cursor-pointer" type="submit">
            {isLoading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              'Cập nhật bài học'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateLesson
