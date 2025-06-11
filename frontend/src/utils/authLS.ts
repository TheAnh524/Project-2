import { Auth, User } from '../types/core.type'

const AUTH_LS_KEY = {
  accessToken: 'at',
  user: 'u',
}

export const getTokenLS = () => {
  return localStorage.getItem(AUTH_LS_KEY.accessToken) ?? ''
}

export const setTokenLS = (accessToken: string) => {
  localStorage.setItem(AUTH_LS_KEY.accessToken, accessToken)
}

export const getUserLS = (): User | null => {
  const user = localStorage.getItem(AUTH_LS_KEY.user)
  return user ? JSON.parse(user) : null
}

export const setAuthLS = (authResponse: Auth) => {
  const { access_token, user } = authResponse
  localStorage.setItem(AUTH_LS_KEY.accessToken, access_token)
  localStorage.setItem(AUTH_LS_KEY.user, JSON.stringify(user))
}

export const resetAuthLS = () => {
  localStorage.removeItem(AUTH_LS_KEY.accessToken)
  localStorage.removeItem(AUTH_LS_KEY.user)
}
