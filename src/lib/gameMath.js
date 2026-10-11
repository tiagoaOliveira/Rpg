import { HEROES_BY_ID } from '../data/heroes'

// 0..1: poder dos heróis relativo ao poder necessário para o máximo do mapa
export function calcEfficiency(power, powerCap) {
  if (powerCap <= 0) return 1
  return Math.min(1, power / powerCap)
}

// poder somado dos heróis da run (combate ou mineração, conforme o mapa) e a eficiência resultante.
// O poder é lido no momento do cálculo; quando o poder dos heróis puder mudar durante a run,
// vale guardar esse valor no início dela.
export function getRunEfficiency(map, heroIds) {
  const stat = map.powerType === 'mining' ? 'miningPower' : 'combatPower'
  const power = heroIds.reduce((sum, id) => sum + (HEROES_BY_ID[id]?.[stat] ?? 0), 0)
  return { power, efficiency: calcEfficiency(power, map.powerCap) }
}

// ganho acumulado: máx/h × eficiência × segundos decorridos / 3600
export function calcGain(maxPerHour, efficiency, startedAt, now) {
  const elapsedSeconds = Math.max(0, (now - startedAt) / 1000)
  return (maxPerHour * efficiency * elapsedSeconds) / 3600
}

// nível do meio: [1, 5, 3] -> ordena [1, 3, 5] -> 3
export function medianLevel(levels) {
  const sorted = [...levels].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}