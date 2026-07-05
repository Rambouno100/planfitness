import { api } from '../../../lib/api'

export const getExercises = () => api.get('/exercises').then((r) => r.data)
export const getProgress = () => api.get('/exercises/progress').then((r) => r.data)
export const createExercise = (data) => api.post('/exercises', data).then((r) => r.data)
export const updateExercise = (id, data) => api.put(`/exercises/${id}`, data).then((r) => r.data)
export const deleteExercise = (id) => api.delete(`/exercises/${id}`).then((r) => r.data)
