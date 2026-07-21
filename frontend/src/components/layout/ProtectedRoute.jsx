import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Loader from '../ui/Loader'
import { isAndroidBadgePreview, isAndroidDuelPreview, isAndroidHomePreview } from '../../lib/nativeApp'

export default function ProtectedRoute() {
  const { session, loading } = useAuthStore()
  const location = useLocation()

  if (location.pathname === '/dashboard' && isAndroidHomePreview()) return <Outlet />
  if (location.pathname === '/defis' && isAndroidDuelPreview()) return <Outlet />
  if (location.pathname === '/badges' && isAndroidBadgePreview()) return <Outlet />

  if (loading) return <Loader label="Vérification de la session…" />
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
