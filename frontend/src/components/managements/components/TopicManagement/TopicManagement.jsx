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

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import queryClient from '@/config/reactQuery'
import { deleteTopic, getAllTopics, TopicKey } from '@/services/TopicServices'
import { Topic } from '@/types/topic.type'

const TopicManagement = () => {
  const naviage = useNavigate()
  const handleNavigate = (url: string) => {
    naviage(url)
  }

  const { data: listTopicsRes } = useQuery({
    queryKey: [TopicKey],
    queryFn: getAllTopics,
  })

  const listTopics: Topic[] = listTopicsRes?.data || []

  const handleDeteTopic = async (topicId: string) => {
    try {
      const res = await deleteTopic(topicId)
      if (res.status !== 200) {
        toast.error('Lỗi khi xóa chủ đề')
        return
      }

      queryClient.refetchQueries({
        queryKey: [TopicKey],
      })

      toast.success('Xóa chủ đề thành công')
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpenLessons = (topicId: string) => {
    localStorage.setItem('topicId', topicId)
    naviage(`/management/lessons`)
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-5">Quản lý chủ đề</h2>

      <Button
        className="mb-5 cursor-pointer"
        variant="outline"
        onClick={() => handleNavigate('/management/topics/create')}
      >
        Thêm chủ đề
      </Button>

      <Table className="border border-gray-300 rounded-md">
        <TableCaption>Danh sách các chủ đề</TableCaption>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Ảnh đại diện</TableHead>
            <TableHead>Tên chủ đề</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listTopics.map((topic) => (
            <TableRow key={topic._id} className="border-b border-gray-200">
              <TableCell>{topic._id}</TableCell>
              <TableCell>
                <img className="w-10 h-10" src={topic.image} alt={topic.name} />
              </TableCell>
              <TableCell className="font-medium">{topic.name}</TableCell>
              <TableCell className="flex justify-end gap-10">
                <Button
                  className="cursor-pointer"
                  variant={'outline'}
                  onClick={() => handleOpenLessons(topic._id)}
                >
                  Bài học
                </Button>
                <Button
                  className="cursor-pointer"
                  variant={'outline'}
                  onClick={() =>
                    handleNavigate(`/management/topics/${topic._id}`)
                  }
                >
                  Sửa
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="cursor-pointer" variant={'destructive'}>
                      Xóa
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn có chắc chắn muốn xóa ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể khôi phục, hãy chắc chắn rằng
                        bạn muốn xóa trước khi ấn nút tiếp tục
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={() => {
                          handleDeteTopic(topic._id)
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
  )
}

export default TopicManagement
