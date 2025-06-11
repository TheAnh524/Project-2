import { UserRoleEnum } from '@/enums/UserRoleEnum'
import { RoleGuard } from '@/providers/AuthProvider/AuthProvider'
import { Outlet } from 'react-router'

const TeacherProviderLayout = () => {
  return (
    <RoleGuard role={UserRoleEnum.Teacher}>
      <Outlet />
    </RoleGuard>
  )
}

export default TeacherProviderLayout
