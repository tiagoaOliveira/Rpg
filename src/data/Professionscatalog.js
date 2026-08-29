import { supabase } from '../lib/supabaseClient';

let cache = null;
let listCache = [];

export async function loadProfessionsCatalog() {
  if (cache) return cache;

  const { data, error } = await supabase.from('professions').select('*');
  if (error) throw error;

  listCache = data;
  cache = Object.fromEntries(data.map((row) => [row.id, row]));
  return cache;
}

export function getProfessionById(id) {
  return cache?.[id];
}

export function getProfessionsList() {
  return listCache;
}