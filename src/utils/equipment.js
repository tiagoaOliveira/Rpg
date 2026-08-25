import { addItem, removeItem, getInventory } from './inventory';

// Itens equipados por personagem: { [slotId]: itemId }
const EQUIPPED_KEY_PREFIX = 'rpg_equipped_';

function keyFor(characterId) {
  return `${EQUIPPED_KEY_PREFIX}${characterId}`;
}

export function getEquipped(characterId) {
  try {
    const raw = localStorage.getItem(keyFor(characterId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEquipped(characterId, equipped) {
  localStorage.setItem(keyFor(characterId), JSON.stringify(equipped));
}

// Equipa um item num slot. Se já houver algo equipado ali, volta pro inventário.
// Retorna { equipped, inventory } com o estado atualizado dos dois.
export function equip(characterId, slot, itemId) {
  const equipped = getEquipped(characterId);
  const previousItemId = equipped[slot];

  let inventory = removeItem(characterId, itemId, 1);
  if (previousItemId) {
    inventory = addItem(characterId, previousItemId, 1);
  }

  equipped[slot] = itemId;
  saveEquipped(characterId, equipped);
  return { equipped, inventory };
}

export function unequip(characterId, slot) {
  const equipped = getEquipped(characterId);
  const itemId = equipped[slot];
  let inventory = getInventory(characterId);

  if (itemId) {
    inventory = addItem(characterId, itemId, 1);
    delete equipped[slot];
    saveEquipped(characterId, equipped);
  }

  return { equipped, inventory };
}

// Evita import circular desnecessário só pra ler o inventário sem alterar.
function getInventoryUnchanged(characterId) {
  try {
    const raw = localStorage.getItem(`rpg_inventory_${characterId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}