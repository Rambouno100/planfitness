import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginService, registerService } from '../services/auth-service'
import { setToken } from '../store/auth-store'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) await registerService(form)
      const token = await loginService({ email: form.email, password: form.password })
      setToken(token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error?.toString() || 'Error al autenticar')
    }
  }

  const inputCls = 'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-slate-200 bg-white shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Plan<span className="text-emerald-600">Fitness</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</p>
        </div>
        {isRegister && (
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleForm} className={inputCls} />
        )}
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleForm} className={inputCls} />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleForm} className={inputCls} />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button className="h-10 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
          {isRegister ? 'Registrarme' : 'Entrar'}
        </button>
        <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-xs font-medium text-slate-400 hover:text-slate-900">
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </form>
    </div>
  )
}
