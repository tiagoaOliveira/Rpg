import { supabase } from '../lib/supabaseClient';

export async function getEquipped(characterId) {
  const { data, error } = await supabase
    .from('character_equipment')
    .select('slot_id, item_id')
    .eq('character_id', characterId);
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.slot_id, row.item_id]));
}

export async function equip(characterId, slot, itemId) {
  const { error } = await supabase.rpc('equip_item', {
    p_character_id: characterId,
    p_slot: slot,
    p_item_id: itemId,
  });
  if (error) throw error;
}

export async function unequip(characterId, slot) {
  const { error } = await supabase.rpc('unequip_item', {
    p_character_id: characterId,
    p_slot: slot,
  });
  if (error) throw error;
}