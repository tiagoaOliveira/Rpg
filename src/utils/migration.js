import { supabase } from '../lib/supabaseClient';

const LEGACY_CHARACTERS_KEY = 'rpg_characters';

function migratedFlagKey(userId) {
  return `rpg_migrated_${userId}`;
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Roda uma vez por usuário: se houver personagens antigos no localStorage
// (de antes do login existir), sobe tudo pro Supabase e marca como migrado.
export async function migrateLocalDataIfNeeded(userId) {
  if (localStorage.getItem(migratedFlagKey(userId))) return;

  const legacyCharacters = readJSON(LEGACY_CHARACTERS_KEY) || [];

  if (legacyCharacters.length === 0) {
    localStorage.setItem(migratedFlagKey(userId), 'true');
    return;
  }

  for (const legacy of legacyCharacters) {
    const { error: charError } = await supabase.from('characters').insert({
      id: legacy.id,
      user_id: userId,
      name: legacy.name,
      level: legacy.level,
      xp: legacy.xp,
    });

    // Se já existe (ex.: migração parcial anterior) ou deu erro, pula pro próximo.
    if (charError) continue;

    const legacyInventory = readJSON(`rpg_inventory_${legacy.id}`) || {};
    const inventoryRows = Object.entries(legacyInventory)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => ({ character_id: legacy.id, item_id: itemId, quantity: qty }));
    if (inventoryRows.length > 0) {
      await supabase.from('character_inventory').insert(inventoryRows);
    }

    const legacyEquipped = readJSON(`rpg_equipped_${legacy.id}`) || {};
    const equipmentRows = Object.entries(legacyEquipped).map(([slotId, itemId]) => ({
      character_id: legacy.id,
      slot_id: slotId,
      item_id: itemId,
    }));
    if (equipmentRows.length > 0) {
      await supabase.from('character_equipment').insert(equipmentRows);
    }

    const legacyRecipes = readJSON(`rpg_learned_recipes_${legacy.id}`) || [];
    const recipeRows = legacyRecipes.map((recipeId) => ({ character_id: legacy.id, recipe_id: recipeId }));
    if (recipeRows.length > 0) {
      await supabase.from('character_recipes').insert(recipeRows);
    }
  }

  localStorage.setItem(migratedFlagKey(userId), 'true');
}