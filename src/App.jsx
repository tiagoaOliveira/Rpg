import { AuthProvider, useAuth } from './context/AuthContext'
import { InventoryProvider } from './context/InventoryContext'
import Login from './pages/Login'
import Main from './pages/Main'
import './App.css'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Carregando...</div>
  }

  if (!user) return <Login />

  // key: se trocar de usuário, o inventário é remontado com o save do novo usuário
  return (
    <InventoryProvider key={user.id} userId={user.id}>
      <Main />
    </InventoryProvider>
  )
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