import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExercises } from '../hooks/use-exercises'
import { ExerciseCard } from '../components/ExerciseCard'
import { logout } from '../../../store/auth-store'

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

export function ExercisesPage() {
  const { exercises, progress, form, editId, handleForm, save, edit, toggleDone, remove, cancel } = useExercises()
  const [day, setDay] = useState(DAYS[(new Date().getDay() + 6) % 7])
  const navigate = useNavigate()

  const salir = () => {
    logout()
    navigate('/login')
  }

  const list = exercises.filter((e) => e.day === day)
  const dayProgress = progress?.days?.[day]

  const inputs = [
    { name: 'name', placeholder: 'Ejercicio', className: 'sm:flex-1 sm:min-w-40' },
    { name: 'muscle_group', placeholder: 'Músculo', className: 'sm:w-32' },
    { name: 'sets', placeholder: 'Series', className: 'sm:w-24', type: 'number' },
    { name: 'reps', placeholder: 'Reps', className: 'sm:w-24', type: 'number' },
    { name: 'weight', placeholder: 'Peso', className: 'sm:w-24', type: 'number' },
  ]
  const inputCls = 'h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Plan<span className="text-emerald-600">Fitness</span>
        </h1>
        <button onClick={salir} className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Cerrar sesión
        </button>
      </header>

      <form onSubmit={save} className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-8 sm:items-center">
        {inputs.map(({ name, placeholder, className, type = 'text' }) => (
          <input key={name} name={name} type={type} value={form[name]} onChange={handleForm}
            placeholder={placeholder} className={`${inputCls} ${className}`} />
        ))}
        <select name="day" value={form.day} onChange={handleForm} className={`${inputCls} sm:w-32 ${form.day ? '' : 'text-slate-400'}`}>
          <option value="">Día</option>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button className="h-9 px-5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
          {editId ? 'Guardar' : 'Agregar'}
        </button>
        {editId && (
          <button type="button" onClick={cancel} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Cancelar
          </button>
        )}
      </form>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {DAYS.map((d) => (
          <button key={d} onClick={() => setDay(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${d === day ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            {d}
          </button>
        ))}
      </div>

      {dayProgress?.total > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{dayProgress.completed}/{dayProgress.total} completados</span>
            <span>{dayProgress.percent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${dayProgress.percent}%` }} />
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-12">No hay ejercicios para {day}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((e) => (
            <ExerciseCard key={e.id} exercise={e} onToggle={toggleDone} onEdit={edit} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
