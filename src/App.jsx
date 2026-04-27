import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import Post from './pages/Post'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import ResetPassword from './pages/ResetPassword'

function ProtectedRoute({ children }) {
  const { user, loading } = useApp()
  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/post" element={<ProtectedRoute><Post /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
