import map1 from '/assets/maps/map1.jpg'
import map2 from '/assets/maps/cavern.jpg'
import map3 from '/assets/maps/map3.jpg'

// Dados de teste. Depois podem ser substituídos pelos dados reais do jogo.
const MAPS_LIST = [
  {
    id: 'map-1',
    name: 'Mapa 1',
    image: map1,
    rewards: [
      { resourceId: 'gold', amountPerHour: 120 },
      { resourceId: 'xp', amountPerHour: 45 },
    ],
  },
  {
    id: 'map-2',
    name: 'Mapa 2',
    image: map2,
    rewards: [
      { resourceId: 'iron_ore', amountPerHour: 14 },
      { resourceId: 'mining_xp', amountPerHour: 30 },
    ],
  },
  {
    id: 'map-3',
    name: 'Mapa 3',
    image: map3,
    rewards: [
      { resourceId: 'gold', amountPerHour: 200 },
      { resourceId: 'xp', amountPerHour: 80 },
    ],
  },
]

export const MAPS = Object.freeze(MAPS_LIST)

export const MAPS_BY_ID = Object.freeze(
  Object.fromEntries(MAPS_LIST.map((map) => [map.id, map]))
)