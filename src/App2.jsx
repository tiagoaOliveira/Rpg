import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Main from './pages/Main'
import './App.css'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Carregando...</div>
  }

  return user ? <Main /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}