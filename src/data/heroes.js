const HEROES_LIST = [
  { id: 'hero-1', name: 'Herói 1', level: 12, miningPower: 34 },
  { id: 'hero-2', name: 'Herói 2', level: 8, miningPower: 21 },
  { id: 'hero-3', name: 'Herói 3', level: 5, miningPower: 15 },
]

export const HEROES = Object.freeze(HEROES_LIST)

export const HEROES_BY_ID = Object.freeze(
  Object.fromEntries(HEROES_LIST.map((hero) => [hero.id, hero]))
)