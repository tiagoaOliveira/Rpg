import { createClient } from '@supabase/supabase-js'

// Essas variáveis vêm do arquivo .env (veja .env.example)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados. Verifique seu arquivo .env'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
