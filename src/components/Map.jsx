import { useState, useEffect } from 'react'
import { Play, Square, Check, Coins, Star, Mountain, Pickaxe } from 'lucide-react'
import Modal from './Modal'
import { MAPS } from '../data/maps'
import { HEROES } from '../data/heroes'
import { RESOURCES } from '../data/resources'
import { useInventory } from '../context/InventoryContext'
import { calcGain } from '../lib/gameMath'
import { RESOURCE_ICONS } from '../lib/resourceIcons'
import './Map.css'

export default function Map() {
  const { runs, startRun, stopRun } = useInventory()
  const [farmMap, setFarmMap] = useState(null)
  const [selectedHeroIds, setSelectedHeroIds] = useState([])
  const [now, setNow] = useState(() => Date.now())

  const hasRuns = Object.keys(runs).length > 0

  // um único relógio para todos os mapas, só existe enquanto há run ativa.
  // É só visual: o que vai pro storage é o startedAt, não o contador.
  useEffect(() => {
    if (!hasRuns) return
    setNow(Date.now())
    const intervalId = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(intervalId)
  }, [hasRuns])

  // heróis que já estão farmando em algum mapa
  const busyHeroIds = new Set(Object.values(runs).flatMap((run) => run.heroIds))

  function openFarmModal(map) {
    setSelectedHeroIds([])
    setFarmMap(map)
  }

  function toggleHero(heroId) {
    setSelectedHeroIds((current) =>
      current.includes(heroId)
        ? current.filter((id) => id !== heroId)
        : [...current, heroId]
    )
  }

  function handleStart() {
    startRun(farmMap.id, selectedHeroIds)
    setFarmMap(null)
  }

  function handleStop(map) {
    const collected = stopRun(map.id)
    console.log('Farm encerrado em', map.name, collected)
  }

  const hasSelection = selectedHeroIds.length > 0
  // sem herói selecionado mostra o padrão do mapa (1x)
  const multiplier = Math.max(1, selectedHeroIds.length)

  return (
    <section className="map-list">
      {MAPS.map((map) => {
        const run = runs[map.id]
        return (
          <div key={map.id} className="map-card">
            <div className="map-rewards">
              {map.rewards.map(({ resourceId, amountPerHour }) => {
                const Icon = RESOURCE_ICONS[resourceId]
                return (
                  <span
                    key={resourceId}
                    className="map-reward-item"
                    title={RESOURCES[resourceId].name}
                  >
                    <Icon size={14} />
                    {amountPerHour}/h
                  </span>
                )
              })}
            </div>

            {run && (
              <div className="map-farm-status">
                <span className="map-farm-multiplier">{run.heroIds.length}x</span>
                {map.rewards.map(({ resourceId, amountPerHour }) => {
                  const Icon = RESOURCE_ICONS[resourceId]
                  const gain = calcGain(
                    amountPerHour,
                    run.heroIds.length,
                    run.startedAt,
                    now
                  )
                  return (
                    <span key={resourceId} className="map-farm-gain">
                      <Icon size={12} />+{gain.toFixed(2)}
                    </span>
                  )
                })}
              </div>
            )}

            <img className="map-image" src={map.image} alt={map.name} />

            {run ? (
              <button
                className="map-farm-button is-running"
                onClick={() => handleStop(map)}
              >
                <Square size={14} />
                Parar
              </button>
            ) : (
              <button className="map-farm-button" onClick={() => openFarmModal(map)}>
                <Play size={16} />
                Farm
              </button>
            )}
          </div>
        )
      })}

      <Modal
        isOpen={farmMap !== null}
        onClose={() => setFarmMap(null)}
        title={farmMap?.name ?? 'Farm'}
      >
        <div className="farm-modal">
          <div className="farm-hero-list">
            {HEROES.map((hero) => {
              const isSelected = selectedHeroIds.includes(hero.id)
              const isBusy = busyHeroIds.has(hero.id)
              return (
                <button
                  key={hero.id}
                  className={`farm-hero-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => toggleHero(hero.id)}
                  disabled={isBusy}
                >
                  <div className="farm-hero-avatar" />
                  <div className="farm-hero-info">
                    <span className="farm-hero-name">{hero.name}</span>
                    <span className="farm-hero-stats">
                      <span>Nv {hero.level}</span>
                      <span className="farm-hero-mining">
                        <Pickaxe size={11} />
                        {hero.miningPower}
                      </span>
                    </span>
                  </div>
                  {isBusy && <span className="farm-hero-busy">Em farm</span>}
                  {isSelected && (
                    <span className="farm-hero-check">
                      <Check size={14} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {farmMap && (
            <div className="farm-preview">
              <span className="farm-preview-label">
                Previsão por hora
                {multiplier > 1 && (
                  <span className="farm-preview-multiplier">{multiplier}x</span>
                )}
              </span>
              <div className="farm-preview-items">
                {farmMap.rewards.map(({ resourceId, amountPerHour }) => (
                  <span key={resourceId} className="farm-preview-item">
                    {RESOURCES[resourceId].name}: {amountPerHour * multiplier}/h
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="farm-start-button"
            disabled={!hasSelection}
            onClick={handleStart}
          >
            Iniciar
          </button>
        </div>
      </Modal>
    </section>
  )
}