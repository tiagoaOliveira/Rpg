// ganho acumulado: taxa/h × nº de heróis × segundos decorridos / 3600
export function calcGain(amountPerHour, heroCount, startedAt, now) {
  const elapsedSeconds = Math.max(0, (now - startedAt) / 1000)
  return (amountPerHour * heroCount * elapsedSeconds) / 3600
}

// nível do meio: [1, 5, 3] -> ordena [1, 3, 5] -> 3
export function medianLevel(levels) {
  const sorted = [...levels].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}