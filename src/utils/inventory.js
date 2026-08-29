import { supabase } from '../lib/supabaseClient';

export async function getInventory(characterId) {
  const { data, error } = await supabase
    .from('character_inventory')
    .select('item_id, quantity')
    .eq('character_id', characterId);
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.item_id, row.quantity]));
}

export async function addItem(characterId, itemId, quantity = 1) {
  const { error } = await supabase.rpc('increment_inventory', {
    p_character_id: characterId,
    p_item_id: itemId,
    p_delta: quantity,
  });
  if (error) throw error;
}

export async function removeItem(characterId, itemId, quantity = 1) {
  const { error } = await supabase.rpc('increment_inventory', {
    p_character_id: characterId,
    p_item_id: itemId,
    p_delta: -quantity,
  });
  if (error) throw error;
}

// Aplica vários drops de uma vez (ex: os 5 itens de um clique em "Farmar")
// numa única requisição, em vez de uma por item.
export async function addManyItems(characterId, itemIds) {
  const { error } = await supabase.rpc('apply_farm_drops', {
    p_character_id: characterId,
    p_item_ids: itemIds,
  });
  if (error) throw error;
}