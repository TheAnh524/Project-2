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
import { useState } from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { createTopic, FormTopicDto } from '@/services/TopicServices'
import FileUpload from '@/shared/components/FileUpload'
import { useNavigate } from 'react-router'

const CreateTopicSchema = z.object({
  name: z.string().min(1, { message: 'Tên chủ đề không được để trống.' }),
  image: z.instanceof(File, { message: 'Vui lòng chọn 1 ảnh đại diện.' }),
})

const CreateTopic = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof CreateTopicSchema>>({
    resolver: zodResolver(CreateTopicSchema),
    defaultValues: {
      name: '',
    },
  })

  const navigate = useNavigate()

  const onSubmit = async (data: z.infer<typeof CreateTopicSchema>) => {
    setIsLoading(true)

    try {
      const avatarRes = await uploadSingleFile(data.image)
      if (avatarRes.status !== 200) {
        toast.error('Tải ảnh lên thất bại. Vui lòng thử lại sau.')
        return
      }

      const createTopicData: FormTopicDto = {
        name: data.name,
        image: avatarRes.data.url,
      }

      const createTopicRes = await createTopic(createTopicData)
      if (createTopicRes.status === 201) {
        toast.success('Tạo chủ đề thành công.')
        navigate(-1)
        return
      }
      toast.error('Tạo chủ đề thất bại. Vui lòng thử lại sau.')
    } catch (error) {
      toast.error('Tạo chủ đề thất bại. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center flex-col">
      <h2 className="text-3xl font-bold mb-5">Tạo chủ đề mới</h2>
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
                  <Input placeholder="Ví dụ: Toán lớp 5" {...field} />
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
              'Tạo chủ đề'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateTopic
