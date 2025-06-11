//import ModeToggle from '@/components/ModeToogle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserRoleEnum } from '@/enums/UserRoleEnum'
import { resetAuth, selectAuth } from '@/store/auth/auth.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetAuthLS } from '@/utils/authLS'
import { FC } from 'react'
import { Link } from 'react-router'

interface HeaderProp {
  title?: string
}

const Header: FC<HeaderProp> = ({ title = '' }) => {
  const auth = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(resetAuth())
    resetAuthLS()
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 gap-2 flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
            >
              Trang chủ
            </Link>
            <span>{title}</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            {/* Auth Buttons */}
            {auth.isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger className="border outline-none rounded-md px-4 py-2 cursor-pointer">
                  {auth.user.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {auth.user.role === UserRoleEnum.Teacher && (
                    <DropdownMenuItem>
                      <Link to={'/management/topics'}>Đến trang quản lý</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
