// Zonas de farm. A zona 1-10 é livre; as demais exigem conta (login),
// isso evita lotar o localStorage de jogadores anônimos.
export const FARM_ZONES = [
  {
    id: 'planicie',
    name: 'Planície Inicial',
    levelRange: '1-10',
    xpPerHour: 120,
    requiresAccount: false,
    drops: [
      { itemId: 'ferro', name: 'Ferro', rate: '55%' },
      { itemId: 'couro', name: 'Couro', rate: '40%' },
      { itemId: 'receita_espada_ferro', name: 'Receita Misteriosa', rate: '5%' },
    ],
  },
  {
    id: 'floresta',
    name: 'Floresta Densa',
    levelRange: '11-20',
    xpPerHour: 240,
    requiresAccount: true,
    drops: [
      { itemId: 'ferro', name: 'Ferro', rate: '55%' },
      { itemId: 'couro', name: 'Couro', rate: '50%' },
    ],
  },
  {
    id: 'colinas',
    name: 'Colinas Rochosas',
    levelRange: '21-30',
    xpPerHour: 420,
    requiresAccount: true,
    drops: [
      { itemId: 'ferro', name: 'Ferro', rate: '70%' },
      { itemId: 'couro', name: 'Couro', rate: '30%' },
    ],
  },
  {
    id: 'terras-sombrias',
    name: 'Terras Sombrias',
    levelRange: '31-40',
    xpPerHour: 680,
    requiresAccount: true,
    drops: [
      { itemId: 'ferro', name: 'Ferro', rate: '45%' },
      { itemId: 'couro', name: 'Couro', rate: '60%' },
    ],
  },
];