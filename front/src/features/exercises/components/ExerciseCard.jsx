import { useState } from 'react'

export function ExerciseCard({ exercise, onToggle, onEdit, onDelete }) {
  const [done, setDone] = useState(Array(exercise.sets).fill(false))
  const total = exercise.sets
  const completed = done.filter(Boolean).length
  const pct = total ? Math.round((completed / total) * 100) : 0

  const toggle = (i) => setDone(done.map((s, idx) => (idx === i ? !s : s)))

  return (
    <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col ${exercise.completed ? 'border-emerald-400' : 'border-slate-200'}`}>
      <div className="w-full h-28 bg-slate-100 flex items-center justify-center text-4xl">💪</div>
      <div className="p-4 space-y-3 flex-1">
        <div className="flex justify-between items-center gap-2">
          <p className="font-semibold text-sm text-slate-900 truncate">{exercise.name}</p>
          <span className="text-xs text-slate-400 shrink-0">{completed}/{total}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="font-medium text-emerald-600">{exercise.muscle_group}</span>
          <span>{exercise.reps} reps</span>
          <span>{exercise.weight} kg</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {done.map((s, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 flex justify-between items-center">
        <button onClick={() => onToggle(exercise)}
          className={`text-xs font-medium ${exercise.completed ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}>
          {exercise.completed ? 'Hecho ✓' : 'Marcar hecho'}
        </button>
        <div className="flex gap-4">
          <button onClick={() => onEdit(exercise)} className="text-xs font-medium text-slate-500 hover:text-emerald-600">Editar</button>
          <button onClick={() => onDelete(exercise.id)} className="text-xs font-medium text-slate-500 hover:text-red-500">Eliminar</button>
        </div>
      </div>
    </div>
  )
}
