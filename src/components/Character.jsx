import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BottomSheet from './BottomSheet'
import EquipmentModal from './EquipmentModal'
import './Character.css'

// dados de teste: equipamento por herói, por slot
const EQUIPMENT_BY_HERO = {
  'hero-1': {
    topLeft: {
      equippedId: 'eq-1',
      items: [
        { id: 'eq-1', name: 'Espada Inicial' },
        { id: 'eq-2', name: 'Espada Afiada' },
        { id: 'eq-3', name: 'Espada Lendária' },
      ],
    },
  },
  'hero-2': {
    topLeft: {
      equippedId: 'eq-4',
      items: [
        { id: 'eq-4', name: 'Machado de Guerra' },
        { id: 'eq-5', name: 'Machado Rúnico' },
      ],
    },
  },
}

const SLOTS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']

function toKebab(key) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export default function Character({ isOpen, onClose, heroes = [], initialHeroId }) {
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('status')
  const [openSlot, setOpenSlot] = useState(null)

  // toda vez que o sheet abre, começa mostrando o herói que foi clicado
  useEffect(() => {
    if (!isOpen) return
    const index = heroes.findIndex((h) => h.id === initialHeroId)
    setHeroIndex(index >= 0 ? index : 0)
    setActiveTab('status')
    setOpenSlot(null)
  }, [isOpen, initialHeroId, heroes])

  const hero = heroes[heroIndex]
  const heroEquipment = hero ? EQUIPMENT_BY_HERO[hero.id] ?? {} : {}

  function goToPrevious() {
    setHeroIndex((current) => (current - 1 + heroes.length) % heroes.length)
  }

  function goToNext() {
    setHeroIndex((current) => (current + 1) % heroes.length)
  }

  function handleSlotClick(slotKey) {
    if (!heroEquipment[slotKey]) return // slot ainda sem equipamento de teste
    setOpenSlot(slotKey)
  }

  const openSlotData = openSlot ? heroEquipment[openSlot] : null

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={hero?.name ?? 'Personagem'}>
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
            <div className="status-content">{/* status do personagem entra aqui */}</div>
          ) : (
            <div className="ascension-content">{/* requisitos de ascensão entram aqui */}</div>
          )}
        </div>
        <button
          className="character-fight-button"
          onClick={() => console.log('Lutar com', hero?.name)}
        >
          Lutar
        </button>
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