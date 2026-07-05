import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import { ExercisesPage } from '../features/exercises/pages/ExercisesPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <ExercisesPage /> }],
  },
])
