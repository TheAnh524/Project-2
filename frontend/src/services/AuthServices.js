import http from '@/config/http'

export interface FormLoginDto {
  email: string
  password: string
}

export interface FormRegisterDto {
  name: string
  email: string
  password: string
}
export const login = (data: FormLoginDto) => {
  return http.post(`auth/login`, data)
}

export const register = (data: FormRegisterDto) => {
  return http.post(`auth/register`, data)
}
