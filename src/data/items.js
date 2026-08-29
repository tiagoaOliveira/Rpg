// Catálogo de itens. Antes era estático, agora vem da tabela public.items
// no Supabase (conteúdo do jogo, mas centralizado no banco).
// loadItemsCatalog() é chamado uma vez no início do app (AuthContext);
// getItemById() depois disso é síncrono, lendo do cache em memória.
import { supabase } from '../lib/supabaseClient';

let cache = null;
let loadingPromise = null;

export async function loadItemsCatalog() {
  if (cache) return cache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = supabase
    .from('items')
    .select('*')
    .then(({ data, error }) => {
      if (error) throw error;
      cache = Object.fromEntries(
        data.map((row) => [
          row.id,
          {
            id: row.id,
            name: row.name,
            color: row.color,
            category: row.category,
            slot: row.slot,
            isRecipe: row.category === 'recipe',
            recipeId: row.recipe_id,
          },
        ]),
      );
      return cache;
    });

  return loadingPromise;
}

export function getItemById(id) {
  return cache?.[id];
}