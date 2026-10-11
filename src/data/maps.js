import map1 from '/assets/maps/map1.jpg'
import map2 from '/assets/maps/cavern.jpg'
import map3 from '/assets/maps/map3.jpg'

// maxPerHour: ganho por hora ao atingir o powerCap
// powerType: qual poder conta nesse mapa ('combat' ou 'mining')
// powerCap: poder somado necessário para o ganho máximo
const MAPS_LIST = [
  {
    id: 'map-1',
    name: 'Mapa 1',
    image: map1,
    powerType: 'combat',
    powerCap: 200,
    rewards: [
      { resourceId: 'gold', maxPerHour: 120 },
      { resourceId: 'xp', maxPerHour: 45 },
    ],
  },
  {
    id: 'map-2',
    name: 'Mapa 2',
    image: map2,
    powerType: 'combat',
    powerCap: 400,
    rewards: [
      { resourceId: 'gold', maxPerHour: 200 },
      { resourceId: 'xp', maxPerHour: 80 },
    ],
  },
  {
    id: 'map-3',
    name: 'Mapa 3',
    image: map3,
    powerType: 'mining',
    powerCap: 100,
    rewards: [
      { resourceId: 'iron_ore', maxPerHour: 14 },
      { resourceId: 'mining_xp', maxPerHour: 30 },
    ],
  },
]

export const MAPS = Object.freeze(MAPS_LIST)

export const MAPS_BY_ID = Object.freeze(
  Object.fromEntries(MAPS_LIST.map((map) => [map.id, map]))
)