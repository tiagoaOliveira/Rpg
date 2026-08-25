// Classes jogáveis e seus status base.
// Esses valores servem de ponto de partida pro personagem no nível 1.
export const CLASSES = [
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    tagline: 'Força bruta na linha de frente',
    color: '#8b1e3f',
    baseStats: { hp: 120, attack: 18, defense: 14, crit: 5, speed: 8 },
  },
  {
    id: 'mago',
    name: 'Mago',
    tagline: 'Poder arcano, corpo frágil',
    color: '#3a5ba0',
    baseStats: { hp: 80, attack: 24, defense: 6, crit: 10, speed: 10 },
  },
  {
    id: 'arqueiro',
    name: 'Arqueiro',
    tagline: 'Velocidade e precisão letal',
    color: '#2e8b57',
    baseStats: { hp: 95, attack: 16, defense: 9, crit: 16, speed: 16 },
  },
];

export function getClassById(id) {
  return CLASSES.find((c) => c.id === id);
}
