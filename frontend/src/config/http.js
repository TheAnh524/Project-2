import axios from 'axios'
import { getTokenLS } from '../utils/authLS'

const BASE_URL = `${import.meta.env.VITE_API_URL}`

const http = axios.create({
  baseURL: BASE_URL,
})

http.interceptors.request.use((request) => {
  const accessToken = getTokenLS()

  if (!request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json'
  }

  request.headers.Authorization = 'Bearer ' + accessToken
  return request
})

export default http
