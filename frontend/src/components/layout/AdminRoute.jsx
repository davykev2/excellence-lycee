import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Loader from '../ui/Loader'

export default function AdminRoute() {
  const { session, profile, loading } = useAuthStore()

  if (loading) return <Loader label="Vérification des droits…" />
  if (!session) return <Navigate to="/login" replace />
  if (!profile?.is_admin) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
