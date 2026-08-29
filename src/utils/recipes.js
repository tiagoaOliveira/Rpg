import { supabase } from '../lib/supabaseClient';

export async function getLearnedRecipes(characterId) {
  const { data, error } = await supabase
    .from('character_recipes')
    .select('recipe_id')
    .eq('character_id', characterId);
  if (error) throw error;
  return data.map((row) => row.recipe_id);
}

export async function learnRecipe(characterId, recipeId) {
  const { error } = await supabase
    .from('character_recipes')
    .upsert({ character_id: characterId, recipe_id: recipeId }, { onConflict: 'character_id,recipe_id' });
  if (error) throw error;
  return getLearnedRecipes(characterId);
}

export async function hasLearnedRecipe(characterId, recipeId) {
  const learned = await getLearnedRecipes(characterId);
  return learned.includes(recipeId);
}