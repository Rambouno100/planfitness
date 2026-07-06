import { Navigate, Outlet } from 'react-router-dom'
import { useToken } from '../store/auth-store'

export default function ProtectedRoute() {
  const token = useToken()
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
