// Camada de persistência local.
// Enquanto o jogador não faz login, tudo vive aqui (localStorage).
// Quando o login existir, essas mesmas funções podem passar a sincronizar
// com o Supabase sem mudar quem as chama.

const CHARACTERS_KEY = 'rpg_characters';
const ACTIVE_CHARACTER_KEY = 'rpg_active_character_id';
const MAX_SLOTS = 3;

export function getCharacters() {
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCharacters(characters) {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
}

function generateId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createCharacter({ name, classId, baseStats }) {
  const characters = getCharacters();

  if (characters.length >= MAX_SLOTS) {
    throw new Error('Todos os slots de personagem estão ocupados.');
  }

  const newCharacter = {
    id: generateId(),
    name,
    classId,
    level: 1,
    xp: 0,
    stats: { ...baseStats },
    createdAt: new Date().toISOString(),
  };

  saveCharacters([...characters, newCharacter]);
  return newCharacter;
}

export function deleteCharacter(id) {
  const characters = getCharacters().filter((c) => c.id !== id);
  saveCharacters(characters);
  if (getActiveCharacterId() === id) {
    clearActiveCharacter();
  }
}

export function setActiveCharacter(id) {
  localStorage.setItem(ACTIVE_CHARACTER_KEY, id);
}

export function getActiveCharacterId() {
  return localStorage.getItem(ACTIVE_CHARACTER_KEY);
}

export function getActiveCharacter() {
  const id = getActiveCharacterId();
  if (!id) return null;
  return getCharacters().find((c) => c.id === id) || null;
}

export function clearActiveCharacter() {
  localStorage.removeItem(ACTIVE_CHARACTER_KEY);
}

export const MAX_CHARACTER_SLOTS = MAX_SLOTS;
