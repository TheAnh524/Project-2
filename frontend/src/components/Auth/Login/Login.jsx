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

import { useState } from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { FormLoginDto, login } from '@/services/AuthServices'
import { Card } from '@/components/ui/card'
import { Auth } from '@/types/core.type'
import { useAppDispatch } from '@/store/hooks'
import { updateAuth } from '@/store/auth/auth.slice'
import { setAuthLS } from '@/utils/authLS'

const LoginSchema = z.object({
  email: z.string().min(1, { message: 'Email không được để trống.' }),
  password: z.string().min(6, { message: 'Mật khẩu phải đủ 6 ký tự.' }),
})

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsLoading(true)

    try {
      const loginData: FormLoginDto = {
        email: data.email,
        password: data.password,
      }

      const loginRes = await login(loginData)
      if (loginRes.status !== 200) {
        toast.error('Đăng nhập thất bại.')
        return
      }
      const auth: Auth = loginRes.data

      dispatch(
        updateAuth({
          isAuthenticated: true,
          user: auth.user,
        })
      )

      setAuthLS(auth)

      toast.success('Đăng nhập thành công.')
      navigate('/')
    } catch (error) {
      toast.error('Đăng nhập thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <title>Đăng nhập</title>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="rounded-2xl w-full max-w-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-4"
            >
              <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  disabled={isLoading}
                  className="cursor-pointer"
                  type="submit"
                >
                  {isLoading ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Chưa có tài khoản?
                <Link
                  to={'/register'}
                  className="text-blue-500 hover:underline"
                >
                  Đăng ký
                </Link>
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default Login
