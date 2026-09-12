import { useState } from 'react'
import BottomSheet from './BottomSheet'
import Item from './Item'
import './Character.css'

const TEST_EQUIPMENT = { id: 'eq-1', name: 'Espada Inicial' }

export default function Character({ isOpen, onClose, hero }) {
  const [activeTab, setActiveTab] = useState('status')
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={hero?.name ?? 'Personagem'}>
      <div className="character-panel">
        <div className="character-card">
          <button
            className="equipment-slot slot-top-left has-item"
            onClick={() => setSelectedEquipment(TEST_EQUIPMENT)}
          />
          <div className="equipment-slot slot-top-right" />
          <div className="character-image-placeholder" />
          <div className="equipment-slot slot-bottom-left" />
          <div className="equipment-slot slot-bottom-right" />
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
      </div>

      <Item
        isOpen={selectedEquipment !== null}
        onClose={() => setSelectedEquipment(null)}
        item={selectedEquipment}
      />
    </BottomSheet>
  )
}