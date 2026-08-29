import { getConfig } from '../data/gameConfig';

// Sem classe fixa: os status vêm só do nível (fórmula configurável em
// game_config.stat_formulas) + bônus de equipamento (ainda não implementado).
export function computeStatsForLevel(level) {
  const formulas = getConfig('stat_formulas') || {};
  return {
    hp: computeStat(formulas.hp, level),
    attack: computeStat(formulas.atk, level),
    defense: computeStat(formulas.def, level),
    speed: computeStat(formulas.spd, level),
    crit: computeStat(formulas.crit, level),
  };
}

function computeStat(formula, level) {
  if (!formula) return 0;

  if (formula.type === 'exponential') {
    return Math.round(formula.base * Math.pow(formula.growth, level - 1));
  }
  if (formula.type === 'linear') {
    return Math.round(formula.base + (level - 1) * formula.growthPerLevel);
  }
  // 'flat' — não escala com o nível.
  return formula.base ?? 0;
}