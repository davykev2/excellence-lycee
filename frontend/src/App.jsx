import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useAppSettingsStore } from './store/useAppSettingsStore'
import { usePresenceStore } from './store/usePresenceStore'

import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import AdminLayout from './components/layout/AdminLayout'
import AudioFeedbackProvider from './components/gamification/AudioFeedbackProvider'
import NativeAppBridge from './components/native/NativeAppBridge'

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AndroidDashboard from './pages/AndroidDashboard'
import Matiere from './pages/Matiere'
import Chapitre from './pages/Chapitre'
import Entrainement from './pages/Entrainement'
import Quiz from './pages/Quiz'
import Resultat from './pages/Resultat'
import QuizRapide from './pages/QuizRapide'
import Defis from './pages/Defis'
import Resumes from './pages/Resumes'
import ResumeMatiere from './pages/ResumeMatiere'
import ResumeLecon from './pages/ResumeLecon'
import Exercices from './pages/Exercices'
import Devoirs from './pages/Devoirs'
import Competitions from './pages/Competitions'
import Classement from './pages/Classement'
import Badges from './pages/Badges'
import Profil from './pages/Profil'
import Communaute from './pages/Communaute'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

import AdminHome from './pages/admin/Home'
import Couverture from './pages/admin/Couverture'
import ChapitreEdit from './pages/admin/ChapitreEdit'
import QuizEdit from './pages/admin/QuizEdit'
import Users from './pages/admin/Users'
import Signalements from './pages/admin/Signalements'
import Settings from './pages/admin/Settings'
import ExercicesGuides from './pages/admin/ExercicesGuides'
import AtelierEditorial from './pages/admin/AtelierEditorial'
import ResumesAdmin from './pages/admin/ResumesAdmin'
import DevoirsAdmin from './pages/admin/DevoirsAdmin'
import { isAndroidHomeExperience } from './lib/nativeApp'

function DashboardEntry() {
  return isAndroidHomeExperience() ? <AndroidDashboard /> : <Dashboard />
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  const loadSettings = useAppSettingsStore((s) => s.load)
  const userId = useAuthStore((s) => s.session?.user?.id)
  const joinPresence = usePresenceStore((s) => s.join)
  const leavePresence = usePresenceStore((s) => s.leave)

  useEffect(() => {
    init()
    loadSettings()
  }, [init, loadSettings])

  // Présence temps réel : on rejoint le canal quand connecté, on le quitte sinon
  useEffect(() => {
    if (userId) joinPresence(userId)
    else leavePresence()
  }, [userId, joinPresence, leavePresence])

  return (
    <BrowserRouter>
      <AudioFeedbackProvider />
      <NativeAppBridge />
      <Navbar />
      <main className={userId ? 'app-content-with-dock' : ''}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardEntry />} />
          <Route path="/matiere/:slug" element={<Matiere />} />
          <Route path="/chapitre/:id" element={<Chapitre />} />
          <Route path="/entrainement/:chapitreId/:palier" element={<Entrainement />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/resultat/:id" element={<Resultat />} />
          <Route path="/quiz-rapide" element={<QuizRapide />} />
          <Route path="/defis" element={<Defis />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/resumes/:slug" element={<ResumeMatiere />} />
          <Route path="/resumes/:slug/:chapitreId" element={<ResumeLecon />} />
          <Route path="/exercices" element={<Exercices />} />
          <Route path="/devoirs" element={<Devoirs />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/classement" element={<Classement />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/badges/:userId" element={<Badges />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/profil/:userId" element={<Profil />} />
          <Route path="/communaute" element={<Communaute />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="couverture" element={<Couverture />} />
            <Route path="contenus" element={<AtelierEditorial />} />
            <Route path="catalogue" element={<ChapitreEdit />} />
            <Route path="resumes" element={<ResumesAdmin />} />
            <Route path="resumes/:chapitreId" element={<ResumesAdmin />} />
            <Route path="exercices-guides" element={<ExercicesGuides />} />
            <Route path="exercices-guides/:chapitreId" element={<ExercicesGuides />} />
            <Route path="devoirs" element={<DevoirsAdmin />} />
            <Route path="devoirs/:devoirId" element={<DevoirsAdmin />} />
            <Route path="quiz/:quizId" element={<QuizEdit />} />
            <Route path="users" element={<Users />} />
            <Route path="signalements" element={<Signalements />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Landing />} />
      </Routes>
      </main>
    </BrowserRouter>
  )
}
