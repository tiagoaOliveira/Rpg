import { Backpack, User, Map as MapIcon } from 'lucide-react'
import './Hub.css'

const HUB_ITEMS = [
  { key: 'inventory', label: 'Inventário', icon: Backpack },
  { key: 'character', label: 'Personagem', icon: User },
  { key: 'map', label: 'Mapa', icon: MapIcon },
]

export default function Hub({ active, onOpen }) {
  return (
    <nav className="hub">
      {HUB_ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={`hub-button ${active === key ? 'is-active' : ''}`}
          onClick={() => onOpen(key)}
        >
          <span className="hub-icon">
            <Icon size={22} />
          </span>
          <span className="hub-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}