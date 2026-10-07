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