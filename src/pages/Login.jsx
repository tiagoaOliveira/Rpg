import { useState } from 'react'
import { KeyRound} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { signInWithGoogle, signInAsGuest } = useAuth()
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  async function handleLogin() {
    setErro(null)
    setCarregando(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setErro(err.message)
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Bem-vindo</h1>
        <p>Entre com sua conta Google para continuar.</p>

        <button className="google-button" onClick={handleLogin} disabled={carregando}>
          <KeyRound size={18} />
          {carregando ? 'Redirecionando...' : 'Entrar com Google'}
        </button>

        {erro && <p className="login-erro">{erro}</p>}

        {import.meta.env.DEV && (
          <button className="guest-button" onClick={signInAsGuest}>
            Entrar sem login (teste)
          </button>
        )}
      </div>
    </div>
  )
}