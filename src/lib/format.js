// 4561 -> "4,5k" | 1250000 -> "1,2M" (trunca, não arredonda)
export function formatCompact(value) {
  const units = [
    { limit: 1e9, suffix: 'B' },
    { limit: 1e6, suffix: 'M' },
    { limit: 1e3, suffix: 'k' },
  ]
  for (const { limit, suffix } of units) {
    if (value >= limit) {
      const truncated = Math.floor((value / limit) * 10) / 10
      return `${String(truncated).replace('.', ',')}${suffix}`
    }
  }
  return String(Math.floor(value))
}

// taxa por hora com até 1 casa decimal: 9.8 -> "9,8" | 75 -> "75"
export function formatRate(value) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}