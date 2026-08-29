import { supabase } from '../lib/supabaseClient';
import { computeStatsForLevel } from './stats';

export const MAX_CHARACTER_SLOTS = 3;

// Cache em memória: um personagem só é buscado de novo se chamarmos
// invalidateCharacterCache (ex: depois de subir de nível — ainda não existe
// nenhuma ação no jogo que faça isso, mas a infraestrutura já fica pronta).
const characterCache = new Map();

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    xp: row.xp,
    stats: computeStatsForLevel(row.level),
    createdAt: row.created_at,
  };
}

export async function getCharacters(userId) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const characters = data.map(mapRow);
  characters.forEach((c) => characterCache.set(c.id, c));
  return characters;
}

export async function getCharacterById(id, { force = false } = {}) {
  if (!force && characterCache.has(id)) return characterCache.get(id);

  const { data, error } = await supabase.from('characters').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;

  const character = mapRow(data);
  characterCache.set(id, character);
  return character;
}

// Chame depois de qualquer ação que mude o nível do personagem.
export function invalidateCharacterCache(id) {
  characterCache.delete(id);
}

export async function createCharacter({ userId, name }) {
  const { count } = await supabase
    .from('characters')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((count ?? 0) >= MAX_CHARACTER_SLOTS) {
    throw new Error('Todos os slots de personagem estão ocupados.');
  }

  const { data, error } = await supabase
    .from('characters')
    .insert({ user_id: userId, name, level: 1, xp: 0 })
    .select()
    .single();
  if (error) throw error;

  const character = mapRow(data);
  characterCache.set(character.id, character);
  return character;
}

export async function deleteCharacter(id) {
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) throw error;
  characterCache.delete(id);
}

// Ponteiro local: qual personagem está selecionado neste dispositivo.
// Não é progresso do jogador (isso já está no banco), só uma preferência
// de navegação — por isso continua no localStorage.
const ACTIVE_CHARACTER_KEY = 'rpg_active_character_id';

export function setActiveCharacter(id) {
  localStorage.setItem(ACTIVE_CHARACTER_KEY, id);
}

export function getActiveCharacterId() {
  return localStorage.getItem(ACTIVE_CHARACTER_KEY);
}

export function clearActiveCharacter() {
  localStorage.removeItem(ACTIVE_CHARACTER_KEY);
}