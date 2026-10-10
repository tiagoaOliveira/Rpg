// ---------------------------------------------------------------
// LEGADO: dados de teste usados pelo Character (slots do card).
// Será substituído quando equipar passar a usar o inventário.
// ---------------------------------------------------------------
const EQUIPMENT_LIST = [
  { id: 'eq-1', name: 'Espada Inicial', slot: 'topLeft' },
  { id: 'eq-2', name: 'Espada Afiada', slot: 'topLeft' },
  { id: 'eq-3', name: 'Espada Lendária', slot: 'topLeft' },
  { id: 'eq-4', name: 'Machado de Guerra', slot: 'topLeft' },
  { id: 'eq-5', name: 'Machado Rúnico', slot: 'topLeft' },
]

export const EQUIPMENT = Object.freeze(EQUIPMENT_LIST)

export const EQUIPMENT_BY_ID = Object.freeze(
  Object.fromEntries(EQUIPMENT_LIST.map((item) => [item.id, item]))
)

// ---------------------------------------------------------------
// FORJA / FUSÃO
// Aqui fica só a DEFINIÇÃO do equipamento. O nível pertence a cada
// unidade que o jogador possui (guardada no inventário), não à definição.
// ---------------------------------------------------------------
export const EQUIPMENT_TYPES = Object.freeze([
  { id: 'weapon', name: 'Arma' },
  { id: 'armor', name: 'Armadura' },
  { id: 'helmet', name: 'Elmo' },
  { id: 'gloves', name: 'Luva' },
  { id: 'pants', name: 'Calça' },
  { id: 'ring', name: 'Anel' },
])

// cost = o que a forja consome pra criar uma unidade nível 1
const EQUIPMENT_BASES_LIST = [
  {
    id: 'iron_sword',
    name: 'Espada de Ferro',
    type: 'weapon',
    cost: [
      { resourceId: 'iron_ore', amount: 5 },
      { resourceId: 'gold', amount: 50 },
    ],
  },
  {
    id: 'iron_axe',
    name: 'Machado de Ferro',
    type: 'weapon',
    cost: [
      { resourceId: 'iron_ore', amount: 6 },
      { resourceId: 'gold', amount: 60 },
    ],
  },
  {
    id: 'iron_armor',
    name: 'Armadura de Ferro',
    type: 'armor',
    cost: [
      { resourceId: 'iron_ore', amount: 10 },
      { resourceId: 'gold', amount: 100 },
    ],
  },
  {
    id: 'iron_helmet',
    name: 'Elmo de Ferro',
    type: 'helmet',
    cost: [
      { resourceId: 'iron_ore', amount: 6 },
      { resourceId: 'gold', amount: 60 },
    ],
  },
  {
    id: 'iron_gloves',
    name: 'Luvas de Ferro',
    type: 'gloves',
    cost: [
      { resourceId: 'iron_ore', amount: 4 },
      { resourceId: 'gold', amount: 40 },
    ],
  },
  {
    id: 'iron_pants',
    name: 'Calça de Ferro',
    type: 'pants',
    cost: [
      { resourceId: 'iron_ore', amount: 8 },
      { resourceId: 'gold', amount: 80 },
    ],
  },
  {
    id: 'gold_ring',
    name: 'Anel de Ouro',
    type: 'ring',
    cost: [
      { resourceId: 'iron_ore', amount: 2 },
      { resourceId: 'gold', amount: 150 },
    ],
  },
]

export const EQUIPMENT_BASES = Object.freeze(EQUIPMENT_BASES_LIST)

export const EQUIPMENT_BASES_BY_ID = Object.freeze(
  Object.fromEntries(EQUIPMENT_BASES_LIST.map((base) => [base.id, base]))
)

// índice por categoria, calculado uma vez (a Forja lê direto, sem filtrar a cada render)
export const EQUIPMENT_BASES_BY_TYPE = Object.freeze(
  Object.fromEntries(
    EQUIPMENT_TYPES.map((type) => [
      type.id,
      Object.freeze(EQUIPMENT_BASES_LIST.filter((base) => base.type === type.id)),
    ])
  )
)