import { useState, useEffect } from 'react'
import {
  getExercises,
  getProgress,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../services/exercises-service'

const EMPTY = { name: '', muscle_group: '', sets: '', reps: '', weight: '', day: '', completed: false }

export function useExercises() {
  const [exercises, setExercises] = useState([])
  const [progress, setProgress] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)

  async function load() {
    setExercises(await getExercises())
    setProgress(await getProgress())
  }

  useEffect(() => {
    load()
  }, [])

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
    if (editId) await updateExercise(editId, data)
    else await createExercise(data)
    setForm(EMPTY)
    setEditId(null)
    await load()
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

  async function toggleDone(exercise) {
    await updateExercise(exercise.id, {
      name: exercise.name,
      muscle_group: exercise.muscle_group,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      day: exercise.day,
      completed: !exercise.completed,
    })
    await load()
  }

  async function remove(id) {
    await deleteExercise(id)
    await load()
  }

  function cancel() {
    setForm(EMPTY)
    setEditId(null)
  }

  return { exercises, progress, form, editId, handleForm, save, edit, toggleDone, remove, cancel }
}
