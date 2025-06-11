import { cn } from '@/lib/utils'
import { Link, Outlet } from 'react-router'

const ManagementLayout = () => {
  return (
    <div>
      <aside className="w-64 h-screen border-r shadow-sm fixed top-0 left-0 p-4">
        <div className="text-2xl font-bold mb-6">🌟 Quản lý khóa học</div>
        <nav className="flex flex-col gap-2">
          <Link
            to={'/management/topics'}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md hover:underline transition'
            )}
          >
            <span className="text-lg">Quản lý chủ đề</span>
          </Link>
          <Link
            to={'/management/lessons'}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md hover:underline transition'
            )}
          >
            <span className="text-lg">Quản lý bài học</span>
          </Link>
          <Link
            to={'management/students'}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md hover:underline transition'
            )}
          >
            <span className="text-lg">Quản lý học sinh</span>
          </Link>
          <Link
            to={'/management/statistics'}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md hover:underline transition'
            )}
          >
            <span className="text-lg">Thống kê</span>
          </Link>
          <Link
            to={'/'}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md hover:underline transition'
            )}
          >
            <span className="text-lg">Quay về trang chủ</span>
          </Link>
        </nav>
      </aside>
      <div className="ml-64 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default ManagementLayout
