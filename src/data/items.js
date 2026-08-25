// Definição dos itens existentes no jogo.
// category: 'material' | 'equipment' | 'recipe' — usado pras abas do inventário.
// slot: só existe em itens de equipamento, deve bater com um id em equipmentSlots.js.
export const ITEMS = {
  ferro: { id: 'ferro', name: 'Ferro', color: '#9b9b9b', category: 'material' },
  couro: { id: 'couro', name: 'Couro', color: '#8a5a34', category: 'material' },
  espada_ferro: {
    id: 'espada_ferro',
    name: 'Espada de Ferro',
    color: '#c9a227',
    category: 'equipment',
    slot: 'mainhand',
  },
  receita_espada_ferro: {
    id: 'receita_espada_ferro',
    name: 'Receita Misteriosa',
    color: '#7a5ac9',
    category: 'recipe',
    isRecipe: true,
    recipeId: 'espada_ferro',
  },
};

export function getItemById(id) {
  return ITEMS[id];
}