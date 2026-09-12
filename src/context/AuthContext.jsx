import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

// Garante que exista uma linha correspondente na tabela "usuarios"
// sempre que alguém faz login. Serve apenas para testar a integração.
async function garantirUsuarioNaTabela(user) {
  if (!user) return

  const { error } = await supabase.from('usuarios').upsert(
    {
      id: user.id,
      email: user.email,
      nome: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      ultimo_login: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error('Erro ao gravar usuário na tabela "usuarios":', error.message)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sessão atual ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuta mudanças de login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        if (session?.user) {
          garantirUsuarioNaTabela(session.user)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  function signInAsGuest() {
    if (!import.meta.env.DEV) return
    setUser({
      id: 'guest-teste',
      email: 'convidado@teste.local',
      user_metadata: {
        full_name: 'Convidado (teste)',
        avatar_url: null,
      },
    })
    setLoading(false)
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = { user, loading, signInWithGoogle, signOut, signInAsGuest  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook de conveniência para consumir o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>')
  }
  return context
}
