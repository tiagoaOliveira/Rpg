import { Plus } from 'lucide-react'
import './Map.css'

import map1 from '/assets/maps/map1.jpg'
import map2 from '/assets/maps/map2.jpg'
import map3 from '/assets/maps/map3.jpg'

const MAPS = [
  { id: 'map-1', name: 'Mapa 1', image: map1 },
  { id: 'map-2', name: 'Mapa 2', image: map2 },
  { id: 'map-3', name: 'Mapa 3', image: map3 },
]

export default function Map({ onAddCharacter }) {
  return (
    <section className="map-list">
      {MAPS.map((map) => (
        <div key={map.id} className="map-row">
          <button
            className="map-add-character"
            onClick={() => onAddCharacter?.(map)}
            aria-label={`Incluir personagem em ${map.name}`}
          >
            <Plus size={20} />
          </button>

          <img
            className="map-image"
            src={map.image}
            alt={map.name}
          />
        </div>
      ))}
    </section>
  )
}