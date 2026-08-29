import { supabase } from '../lib/supabaseClient';
import { getConfig } from '../data/gameConfig';

export function getMaxProfessions() {
  return getConfig('max_professions') ?? 2;
}

export async function getCharacterProfessions(characterId) {
  const { data, error } = await supabase
    .from('character_professions')
    .select('profession_id, level, xp')
    .eq('character_id', characterId);
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.profession_id, { level: row.level, xp: row.xp }]));
}

export async function learnProfession(characterId, professionId) {
  const current = await getCharacterProfessions(characterId);
  const max = getMaxProfessions();
  if (Object.keys(current).length >= max) {
    throw new Error(`Você só pode aprender ${max} profissões.`);
  }

  const { error } = await supabase
    .from('character_professions')
    .insert({ character_id: characterId, profession_id: professionId });
  if (error) throw error;

  return getCharacterProfessions(characterId);
}

// Retorna { level, xp } atualizados após ganhar XP (já resolve level-up no banco).
export async function addProfessionXp(characterId, professionId, xp) {
  const { data, error } = await supabase.rpc('add_profession_xp', {
    p_character_id: characterId,
    p_profession_id: professionId,
    p_xp: xp,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}