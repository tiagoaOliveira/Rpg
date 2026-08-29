import { supabase } from '../lib/supabaseClient';

let cache = null;

export async function loadGameConfig() {
  if (cache) return cache;

  const { data, error } = await supabase.from('game_config').select('*');
  if (error) throw error;

  cache = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return cache;
}

export function getConfig(key) {
  return cache?.[key];
}