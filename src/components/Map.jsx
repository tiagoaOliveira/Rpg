import { useState } from 'react'
import { Play, Check, Coins, Star, Mountain, Pickaxe } from 'lucide-react'
import Modal from './Modal'
import { MAPS } from '../data/maps'
import { HEROES } from '../data/heroes'
import { RESOURCES } from '../data/resources'
import './Map.css'

// ícone de cada recurso (a parte visual fica na UI, não nos dados)
const RESOURCE_ICONS = {
  gold: Coins,
  xp: Star,
  iron_ore: Mountain,
  mining_xp: Pickaxe,
}

export default function Map() {
  const [farmMap, setFarmMap] = useState(null)
  const [selectedHeroIds, setSelectedHeroIds] = useState([])

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
    // aqui depois entra a lógica real de iniciar a run com selectedHeroIds
    console.log('Iniciar farm em', farmMap?.name, 'com', selectedHeroIds)
    setFarmMap(null)
  }

  const hasSelection = selectedHeroIds.length > 0

  return (
    <section className="map-list">
      {MAPS.map((map) => (
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

          <img className="map-image" src={map.image} alt={map.name} />

          <button className="map-farm-button" onClick={() => openFarmModal(map)}>
            <Play size={16} />
            Farm
          </button>
        </div>
      ))}

      <Modal
        isOpen={farmMap !== null}
        onClose={() => setFarmMap(null)}
        title={farmMap?.name ?? 'Farm'}
      >
        <div className="farm-modal">
          <div className="farm-hero-list">
            {HEROES.map((hero) => {
              const isSelected = selectedHeroIds.includes(hero.id)
              return (
                <button
                  key={hero.id}
                  className={`farm-hero-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => toggleHero(hero.id)}
                >
                  <div className="farm-hero-avatar" />
                  <span className="farm-hero-name">{hero.name}</span>
                  {isSelected && (
                    <span className="farm-hero-check">
                      <Check size={14} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {hasSelection && farmMap && (
            <div className="farm-preview">
              <span className="farm-preview-label">Previsão por hora</span>
              <div className="farm-preview-items">
                {farmMap.rewards.map(({ resourceId, amountPerHour }) => (
                  <span key={resourceId} className="farm-preview-item">
                    {RESOURCES[resourceId].name}: {amountPerHour}/h
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