import { Star, Pickaxe } from 'lucide-react'
import { RESOURCES } from '../data/resources'
import './ResourceIcon.css'

import coinicon from '/assets/icons/coin.png'
import ironicon from '/assets/icons/iron.png'
import mitrilicon from '/assets/icons/mitril.png'

// recursos com imagem própria
const RESOURCE_IMAGES = {
  gold: coinicon,
  iron_ore: ironicon,
  mitril_ore: mitrilicon,
}

// recursos ainda sem imagem
const FALLBACK_ICONS = {
  xp: Star,
  mining_xp: Pickaxe,
}

export default function ResourceIcon({ id, size = 16 }) {
  const image = RESOURCE_IMAGES[id]
  if (image) {
    return (
      <img
        className="resource-icon"
        src={image}
        alt={RESOURCES[id]?.name ?? id}
        width={size}
        height={size}
      />
    )
  }

  const Fallback = FALLBACK_ICONS[id]
  return Fallback ? <Fallback size={size} /> : null
}