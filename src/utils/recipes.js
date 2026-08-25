// Receitas aprendidas por personagem (localStorage por enquanto).
const LEARNED_KEY_PREFIX = 'rpg_learned_recipes_';

function keyFor(characterId) {
  return `${LEARNED_KEY_PREFIX}${characterId}`;
}

export function getLearnedRecipes(characterId) {
  try {
    const raw = localStorage.getItem(keyFor(characterId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function learnRecipe(characterId, recipeId) {
  const learned = getLearnedRecipes(characterId);
  if (!learned.includes(recipeId)) {
    learned.push(recipeId);
    localStorage.setItem(keyFor(characterId), JSON.stringify(learned));
  }
  return learned;
}

export function hasLearnedRecipe(characterId, recipeId) {
  return getLearnedRecipes(characterId).includes(recipeId);
}