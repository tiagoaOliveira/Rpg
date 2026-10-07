import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BottomSheet from './BottomSheet'
import EquipmentModal from './EquipmentModal'
import './Character.css'

import { EQUIPMENT_BY_ID } from '../data/equipment'

// ESTADO DO JOGADOR (mock): quais itens ele tem e qual está equipado.
// Isso virá do backend. A definição de cada item vem de data/equipment.js.
const TEST_HERO_EQUIPMENT = {
  'hero-1': { topLeft: { equippedId: 'eq-1', itemIds: ['eq-1', 'eq-2', 'eq-3'] } },
  'hero-2': { topLeft: { equippedId: 'eq-4', itemIds: ['eq-4', 'eq-5'] } },
}

const SLOTS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']

function toKebab(key) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export default function Character({ isOpen, onClose, heroes = [], initialHeroId }) {
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('status')
  const [openSlot, setOpenSlot] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    const index = heroes.findIndex((h) => h.id === initialHeroId)
    setHeroIndex(index >= 0 ? index : 0)
    setActiveTab('status')
    setOpenSlot(null)
  }, [isOpen, initialHeroId, heroes])

  const hero = heroes[heroIndex]
  const heroState = hero ? TEST_HERO_EQUIPMENT[hero.id] ?? {} : {}
  const heroEquipment = Object.fromEntries(
    Object.entries(heroState).map(([slot, state]) => [
      slot,
      {
        equippedId: state.equippedId,
        items: state.itemIds.map((id) => EQUIPMENT_BY_ID[id]),
      },
    ])
  )
  function goToPrevious() {
    setHeroIndex((current) => (current - 1 + heroes.length) % heroes.length)
  }

  function goToNext() {
    setHeroIndex((current) => (current + 1) % heroes.length)
  }

  function handleSlotClick(slotKey) {
    if (!heroEquipment[slotKey]) return
    setOpenSlot(slotKey)
  }

  const openSlotData = openSlot ? heroEquipment[openSlot] : null

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      headerContent={
        <div className="character-header-selector">
          {heroes.map((h, index) => (
            <button
              key={h.id}
              className={`character-header-avatar ${index === heroIndex ? 'is-active' : ''}`}
              onClick={() => setHeroIndex(index)}
              aria-label={h.name}
            >
              {/* futuramente: <img src={h.avatarUrl} alt={h.name} /> */}
            </button>
          ))}
        </div>
      }
    >
      <div className="character-panel">
        <div className="character-card-wrapper">
          <button
            className="character-nav-arrow"
            onClick={goToPrevious}
            aria-label="Herói anterior"
            disabled={heroes.length < 2}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="character-card">
            {SLOTS.map((slotKey) => (
              <div key={slotKey} className={`equipment-slot slot-${toKebab(slotKey)}`}>
                <button
                  className={`equipment-slot-button ${heroEquipment[slotKey] ? 'has-item' : ''}`}
                  onClick={() => handleSlotClick(slotKey)}
                  disabled={!heroEquipment[slotKey]}
                />
              </div>
            ))}
            <div className="character-image-placeholder" />
          </div>

          <button
            className="character-nav-arrow"
            onClick={goToNext}
            aria-label="Próximo herói"
            disabled={heroes.length < 2}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="character-tabs">
          <button
            className={`character-tab ${activeTab === 'status' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
          <button
            className={`character-tab ${activeTab === 'ascension' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('ascension')}
          >
            Ascensão
          </button>
        </div>

        <div className="character-tab-content">
          {activeTab === 'status' ? (
            <div className="status-content" />
          ) : (
            <div className="ascension-content" />
          )}
        </div>
      </div>

      <EquipmentModal
        isOpen={openSlot !== null}
        onClose={() => setOpenSlot(null)}
        equippedId={openSlotData?.equippedId}
        items={openSlotData?.items ?? []}
      />
    </BottomSheet>
  )
}