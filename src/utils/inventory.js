// Inventário por personagem.
// Mesmo padrão do storage.js: hoje é localStorage, amanhã troca para Supabase
// sem mudar quem chama essas funções.

const INVENTORY_KEY_PREFIX = 'rpg_inventory_';

function keyFor(characterId) {
  return `${INVENTORY_KEY_PREFIX}${characterId}`;
}

export function getInventory(characterId) {
  try {
    const raw = localStorage.getItem(keyFor(characterId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function addItem(characterId, itemId, quantity = 1) {
  const inventory = getInventory(characterId);
  inventory[itemId] = (inventory[itemId] || 0) + quantity;
  localStorage.setItem(keyFor(characterId), JSON.stringify(inventory));
  return inventory;
}

export function removeItem(characterId, itemId, quantity = 1) {
  const inventory = getInventory(characterId);
  const newQty = (inventory[itemId] || 0) - quantity;
  if (newQty > 0) {
    inventory[itemId] = newQty;
  } else {
    delete inventory[itemId];
  }
  localStorage.setItem(keyFor(characterId), JSON.stringify(inventory));
  return inventory;
}