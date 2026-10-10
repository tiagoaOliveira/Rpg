import { createContext, useContext, useEffect, useState } from 'react'
import { MAPS_BY_ID } from '../data/maps'
import { EQUIPMENT_BASES_BY_ID } from '../data/equipment'
import { calcGain, medianLevel } from '../lib/gameMath'

const InventoryContext = createContext(undefined)

// Se mudar o formato do que é salvo, aumente a versão: saves antigos são descartados.
const STORAGE_VERSION = 1
const storageKey = (userId) => `farm:save:${userId}`

// TEMPORÁRIO (teste): estado inicial quando não há nada salvo ainda.
// Remover quando o backend entrar.
const TEST_STARTING_STATE = {
  version: STORAGE_VERSION,
  resources: { gold: 500, iron_ore: 20 },
  equipment: [
    { uid: 'seed-1', baseId: 'iron_sword', level: 1 },
    { uid: 'seed-2', baseId: 'iron_sword', level: 5 },
    { uid: 'seed-3', baseId: 'iron_sword', level: 3 },
    { uid: 'seed-4', baseId: 'iron_helmet', level: 2 },
  ],
  runs: {}, // { [mapId]: { heroIds, startedAt } }
}

function loadState(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (
        parsed?.version === STORAGE_VERSION &&
        parsed.resources &&
        Array.isArray(parsed.equipment) &&
        parsed.runs
      ) {
        return parsed
      }
    }
  } catch {
    // JSON inválido ou localStorage indisponível: cai no estado inicial
  }
  return structuredClone(TEST_STARTING_STATE)
}

function createItem(baseId, level) {
  // sem crypto.randomUUID: ele só existe em contexto seguro (https/localhost),
  // e falha ao testar no celular pelo IP da rede
  const uid = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  return { uid, baseId, level }
}

export function InventoryProvider({ userId, children }) {
  const key = storageKey(userId)
  const [state, setState] = useState(() => loadState(key))

  // grava só quando o estado muda (o contador de 1s do Map não passa por aqui)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (err) {
      console.warn('Não foi possível salvar no localStorage:', err.message)
    }
  }, [key, state])

  // quantidade inteira exibível (o valor guardado pode ter fração)
  function getAmount(resourceId) {
    return Math.floor(state.resources[resourceId] ?? 0)
  }

  function canAfford(cost) {
    return cost.every(({ resourceId, amount }) => getAmount(resourceId) >= amount)
  }

  function startRun(mapId, heroIds) {
    const startedAt = Date.now()
    setState((current) => ({
      ...current,
      runs: { ...current.runs, [mapId]: { heroIds, startedAt } },
    }))
  }

  // encerra a run e credita o que foi acumulado
  function stopRun(mapId) {
    const run = state.runs[mapId]
    if (!run) return []

    const map = MAPS_BY_ID[mapId]
    const now = Date.now()
    const collected = map
      ? map.rewards.map(({ resourceId, amountPerHour }) => ({
          resourceId,
          amount: calcGain(amountPerHour, run.heroIds.length, run.startedAt, now),
        }))
      : []

    const resources = { ...state.resources }
    collected.forEach(({ resourceId, amount }) => {
      resources[resourceId] = (resources[resourceId] ?? 0) + amount
    })

    const { [mapId]: _finished, ...remainingRuns } = state.runs
    setState({ ...state, resources, runs: remainingRuns })
    return collected
  }

  // forja: consome os materiais e cria 1 unidade nível 1
  function forgeItem(baseId) {
    const base = EQUIPMENT_BASES_BY_ID[baseId]
    if (!base || !canAfford(base.cost)) return null

    const resources = { ...state.resources }
    base.cost.forEach(({ resourceId, amount }) => {
      resources[resourceId] -= amount
    })

    const created = createItem(baseId, 1)
    setState({ ...state, resources, equipment: [...state.equipment, created] })
    return created
  }

  // fusão: 3 unidades do mesmo equipamento viram 1, com o nível do meio
  function fuseItems(uids) {
    if (uids.length !== 3 || new Set(uids).size !== 3) return null

    const items = uids.map((uid) => state.equipment.find((item) => item.uid === uid))
    if (items.some((item) => !item)) return null
    if (items.some((item) => item.baseId !== items[0].baseId)) return null

    const created = createItem(items[0].baseId, medianLevel(items.map((i) => i.level)))
    setState({
      ...state,
      equipment: [...state.equipment.filter((item) => !uids.includes(item.uid)), created],
    })
    return created
  }

  const value = {
    equipment: state.equipment,
    runs: state.runs,
    getAmount,
    canAfford,
    startRun,
    stopRun,
    forgeItem,
    fuseItems,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory precisa ser usado dentro de um <InventoryProvider>')
  }
  return context
}