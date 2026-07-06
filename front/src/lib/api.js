import axios from 'axios'
import { authStore } from '../store/auth-store'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/v1',
})

api.interceptors.request.use((config) => {
  const token = authStore.state.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
