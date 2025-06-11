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
import { FormRegisterDto, register } from '@/services/AuthServices'
import { Card } from '@/components/ui/card'
import { Auth } from '@/types/core.type'
import { useAppDispatch } from '@/store/hooks'
import { updateAuth } from '@/store/auth/auth.slice'
import { setAuthLS } from '@/utils/authLS'
import axios, { AxiosError } from 'axios'

const RegisterSchema = z
  .object({
    email: z.string().min(1, { message: 'Email không được để trống.' }),
    password: z.string().min(6, { message: 'Mật khẩu phải đủ 6 ký tự.' }),
    rePassword: z
      .string()
      .min(6, { message: 'Xác nhận mật khẩu phải đủ 6 ký tự.' }),
    name: z.string().min(1, { message: 'Tên không được để trống.' }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['rePassword'],
  })

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true)

    try {
      const registerData: FormRegisterDto = {
        email: data.email,
        password: data.password,
        name: data.name,
      }

      const loginRes = await register(registerData)
      if (loginRes.status !== 200) {
        toast.error('Tạo tài khoản thất bại.')
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

      toast.success('Tạo tài khoản thành công.')
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError

        if (axiosError.status === 409) {
          toast.error('Email đã tồn tại.')
          return
        }
      }
      toast.error('Tạo tài khoản thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <title>Đăng ký tài khoản</title>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="rounded-2xl w-full max-w-sm">
          <Form {...form}>
            <form
              className="p-6 space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <h2 className="text-2xl font-bold text-center">
                Đăng ký tài khoản
              </h2>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition duration-200"
              >
                {isLoading ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  'Tạo tài khoản'
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-green-500 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default Register
