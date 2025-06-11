import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import {
  FormTopicDto,
  getTopicDetail,
  TopicKey,
  updateTopic,
} from '@/services/TopicServices'
import FileUpload from '@/shared/components/FileUpload'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Topic } from '@/types/topic.type'
import { isSameFile, urlToFileAuto } from '@/utils/utils'

const UpdateTopicSchema = z.object({
  name: z.string().min(1, { message: 'Tên chủ đề không được để trống.' }),
  image: z.instanceof(File, { message: 'Vui lòng chọn 1 ảnh đại diện.' }),
})

const UpdateTopic = () => {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [originalAvatarFile, setOriginalAvatarFile] = useState<File | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof UpdateTopicSchema>>({
    resolver: zodResolver(UpdateTopicSchema),
    defaultValues: {
      name: '',
    },
  })

  const { data: topicRes } = useQuery({
    queryKey: [TopicKey, 'detail', topicId],
    queryFn: () => getTopicDetail(topicId ?? ''),
  })

  const topic: Topic = topicRes?.data

  useEffect(() => {
    if (topic) {
      form.setValue('name', topic.name)
      urlToFileAuto(topic.image).then((file) => {
        form.setValue('image', file)
        setOriginalAvatarFile(file)
      })
    }
  }, [topic])

  const onSubmit = async (data: z.infer<typeof UpdateTopicSchema>) => {
    setIsLoading(true)

    try {
      let avatarUrl = topic.image || ''
      const avatarChanged = !isSameFile(originalAvatarFile, data.image)
      if (avatarChanged) {
        const avatarRes = await uploadSingleFile(data.image)

        if (avatarRes.status !== 200) {
          toast.error('Tải ảnh lên thất bại. Vui lòng thử lại sau.')
          return
        }

        avatarUrl = avatarRes.data.url
      }

      const UpdateTopicData: FormTopicDto = {
        name: data.name,
        image: avatarUrl,
      }

      const UpdateTopicRes = await updateTopic(topic._id, UpdateTopicData)
      if (UpdateTopicRes.status === 200) {
        toast.success('Cập nhật chủ đề thành công.')
        navigate(-1)
        return
      }
      toast.error('Cập nhật chủ đề thất bại. Vui lòng thử lại sau.')
    } catch (error) {
      toast.error('Cập nhật chủ đề thất bại. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center flex-col">
      <h2 className="text-3xl font-bold mb-5">Cập nhật chủ đề mới</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-xl"
        >
          {/* Tên chủ đề */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên chủ đề</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Học lập trình java" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload avatar */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh đại diện</FormLabel>
                <FormControl>
                  <FileUpload onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nút submit */}
          <Button disabled={isLoading} className="cursor-pointer" type="submit">
            {isLoading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              'Cập nhật chủ đề'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateTopic
