import { useState } from 'react'
import { Plus, Info, Play } from 'lucide-react'
import Modal from './Modal'
import './Map.css'

import map1 from '/assets/maps/map1.jpg'
import map2 from '/assets/maps/cavern.jpg'
import map3 from '/assets/maps/map3.jpg'

const MAPS = [
  { id: 'map-1', name: 'Mapa 1', image: map1, rewardGold: 120, rewardXp: 45 },
  { id: 'map-2', name: 'Mapa 2', image: map2, rewardGold: 200, rewardXp: 80 },
  { id: 'map-3', name: 'Mapa 3', image: map3, rewardGold: 350, rewardXp: 150 },
]

export default function Map() {
  const [selectedMap, setSelectedMap] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  function toggleRewards(mapId) {
    setExpandedId((current) => (current === mapId ? null : mapId))
  }

  function handleFarm(map) {
    // aqui depois entra a lógica real de iniciar a run e dar as recompensas
    console.log('Iniciar farm em', map.name)
  }

  return (
    <section className="map-list">
      {MAPS.map((map) => {
        const isExpanded = expandedId === map.id
        return (
          <div key={map.id} className="map-card">
            <button
              className="map-add-character"
              onClick={() => setSelectedMap(map)}
              aria-label={`Incluir personagem em ${map.name}`}
            >
              <Plus size={20} />
            </button>

            <button
              className="map-info-button"
              onClick={() => toggleRewards(map.id)}
              aria-label={`Ver recompensas de ${map.name}`}
            >
              <Info size={16} />
            </button>

            <img className="map-image" src={map.image} alt={map.name} />

            <div className={`map-rewards-overlay ${isExpanded ? 'is-open' : ''}`}>
              <span className="map-reward-item">Ouro: {map.rewardGold}</span>
              <span className="map-reward-item">XP: {map.rewardXp}</span>
            </div>

            <button
              className="map-farm-button"
              onClick={() => handleFarm(map)}
            >
              <Play size={16} />
              Farm
            </button>
          </div>
        )
      })}

      <Modal
        isOpen={selectedMap !== null}
        onClose={() => setSelectedMap(null)}
        title={selectedMap?.name ?? 'Personagem'}
      >
        <div className="map-character-modal">
          <div className="map-character-image-placeholder" />
          <div className="map-character-stats">
            <div className="map-character-stat">
              <span className="stat-label">HP</span>
              <span className="stat-value">100</span>
            </div>
            <div className="map-character-stat">
              <span className="stat-label">ATK</span>
              <span className="stat-value">20</span>
            </div>
            <div className="map-character-stat">
              <span className="stat-label">DEF</span>
              <span className="stat-value">10</span>
            </div>
            <button
              className="map-fight-button"
              onClick={() => console.log('Lutar em', selectedMap?.name)}
            >
              Lutar
            </button>
          </div>
        </div>
      </Modal>
    </section>
  )
}