import { api } from '../lib/api'

export const registerService = (data) =>
  api.post('/auth/register', data).then((r) => r.data)

export const loginService = (data) =>
  api.post('/auth/login', data).then((r) => r.data.access)
