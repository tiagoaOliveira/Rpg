import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { loadItemsCatalog } from '../data/items';
import { loadProfessionsCatalog } from '../data/professionsCatalog';
import { loadRecipesCatalog } from '../data/recipesCatalog';
import { loadGameConfig } from '../data/gameConfig';
import { migrateLocalDataIfNeeded } from '../utils/migration';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function init() {
      await Promise.all([
        loadItemsCatalog(),
        loadProfessionsCatalog(),
        loadRecipesCatalog(),
        loadGameConfig(),
      ]).catch((err) => console.error('Erro ao carregar catálogos do jogo:', err));

      const { data } = await supabase.auth.getSession();
      let currentSession = data.session;

      // Sem sessão nenhuma (primeira visita): cria uma sessão anônima.
      // Isso permite jogar sem tela de login, mas já salvando tudo no Supabase.
      if (!currentSession) {
        const { data: anonData, error } = await supabase.auth.signInAnonymously();
        if (error) console.error('Erro ao criar sessão anônima:', error);
        currentSession = anonData?.session ?? null;
      }

      if (!active) return;
      setSession(currentSession);
      setLoading(false);

      if (currentSession?.user) {
        migrateLocalDataIfNeeded(currentSession.user.id).catch((err) =>
          console.error('Erro ao migrar dados locais:', err),
        );
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        migrateLocalDataIfNeeded(newSession.user.id).catch((err) =>
          console.error('Erro ao migrar dados locais:', err),
        );
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const { data } = await supabase.auth.getSession();
    const isCurrentlyAnonymous = data.session?.user?.is_anonymous;

    if (isCurrentlyAnonymous) {
      // Vincula a conta Google à sessão anônima atual, preservando os personagens.
      const { error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/game` },
      });
      if (error) console.error('Erro ao vincular conta Google:', error);
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/game` },
      });
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    // Continua jogável sem conta: abre uma nova sessão anônima.
    const { data } = await supabase.auth.signInAnonymously();
    setSession(data.session);
  }

  const value = {
    session,
    user: session?.user ?? null,
    isAnonymous: Boolean(session?.user?.is_anonymous),
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
}