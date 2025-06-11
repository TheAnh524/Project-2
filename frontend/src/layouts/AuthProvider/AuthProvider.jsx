import { AuthGuard } from '@/providers/AuthProvider'
import { Outlet } from 'react-router'

const AuthProviderLayout = () => {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  )
}

export default AuthProviderLayout
