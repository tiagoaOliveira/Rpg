import { supabase } from '../lib/supabaseClient';

let cache = null;
let listCache = [];

export async function loadRecipesCatalog() {
  if (cache) return cache;

  const { data, error } = await supabase.from('recipes').select('*, recipe_materials(item_id, quantity)');
  if (error) throw error;

  const mapped = data.map((row) => ({
    id: row.id,
    resultItemId: row.result_item_id,
    professionId: row.profession_id,
    unlockLevel: row.unlock_level,
    xpReward: row.xp_reward,
    xpCapLevel: row.xp_cap_level,
    materials: row.recipe_materials.map((m) => ({ itemId: m.item_id, quantity: m.quantity })),
  }));

  listCache = mapped;
  cache = Object.fromEntries(mapped.map((r) => [r.id, r]));
  return cache;
}

export function getRecipeById(id) {
  return cache?.[id];
}

export function getRecipesByProfession(professionId) {
  return listCache.filter((r) => r.professionId === professionId);
}