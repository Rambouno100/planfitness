import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getExercises,
  getProgress,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../services/exercises-service'

const EMPTY = { name: '', muscle_group: '', sets: '', reps: '', weight: '', day: '', completed: false }

export function useExercises() {
  const qc = useQueryClient()
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)

  const { data: exercises = [] } = useQuery({ queryKey: ['exercises'], queryFn: getExercises })
  const { data: progress = null } = useQuery({ queryKey: ['progress'], queryFn: getProgress })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['exercises'] })
    qc.invalidateQueries({ queryKey: ['progress'] })
  }

  const createMut = useMutation({ mutationFn: createExercise, onSuccess: invalidate })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateExercise(id, data),
    onSuccess: invalidate,
  })
  const deleteMut = useMutation({ mutationFn: deleteExercise, onSuccess: invalidate })

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function save(e) {
    e.preventDefault()
    if (!form.name || !form.muscle_group || !form.sets || !form.reps || !form.weight || !form.day) return
    const data = {
      name: form.name,
      muscle_group: form.muscle_group,
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: Number(form.weight),
      day: form.day,
      completed: form.completed,
    }
    if (editId) await updateMut.mutateAsync({ id: editId, data })
    else await createMut.mutateAsync(data)
    setForm(EMPTY)
    setEditId(null)
  }

  function edit(exercise) {
    setEditId(exercise.id)
    setForm({
      name: exercise.name,
      muscle_group: exercise.muscle_group,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      day: exercise.day,
      completed: exercise.completed,
    })
  }

  function toggleDone(exercise) {
    updateMut.mutate({
      id: exercise.id,
      data: {
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        day: exercise.day,
        completed: !exercise.completed,
      },
    })
  }

  function remove(id) {
    deleteMut.mutate(id)
  }

  function cancel() {
    setForm(EMPTY)
    setEditId(null)
  }

  return { exercises, progress, form, editId, handleForm, save, edit, toggleDone, remove, cancel }
}
