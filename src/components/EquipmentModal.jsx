import { useState, useEffect } from 'react'
import Modal from './Modal'
import './EquipmentModal.css'

export default function EquipmentModal({ isOpen, onClose, equippedId, items = [] }) {
  const [compareId, setCompareId] = useState(null)

  // sempre que abre um slot novo, começa sem comparação
  useEffect(() => {
    if (isOpen) setCompareId(null)
  }, [isOpen])

  const equippedItem = items.find((item) => item.id === equippedId) ?? null
  const compareItem = compareId ? items.find((item) => item.id === compareId) : null

  function handleSelectItem(item) {
    setCompareId(item.id === equippedId ? null : item.id)
  }

  function handleSwap() {
    // aqui depois entra a chamada real pra equipar de fato
    console.log('Trocar equipamento para:', compareItem?.name)
    setCompareId(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Equipamento">
      <div className="equipment-modal">
        <div className={`equipment-display ${compareItem ? 'is-comparing' : ''}`}>
          <div className="equipment-display-item">
            <div className="item-icon-large" />
            <span className="equipment-display-label">{equippedItem?.name ?? '—'}</span>
            <span className="equipment-display-tag">Equipado</span>
          </div>

          {compareItem && (
            <>
              <button className="equipment-swap-button" onClick={handleSwap}>
                Trocar
              </button>
              <div className="equipment-display-item">
                <div className="item-icon-large" />
                <span className="equipment-display-label">{compareItem.name}</span>
              </div>
            </>
          )}
        </div>

        <div className="equipment-list">
          {items.map((item) => (
            <button
              key={item.id}
              className={`equipment-list-item ${item.id === equippedId ? 'is-equipped' : ''} ${
                item.id === compareId ? 'is-selected' : ''
              }`}
              onClick={() => handleSelectItem(item)}
            >
              <div className="item-icon-small" />
              <span>{item.name}</span>
              {item.id === equippedId && <span className="equipped-badge">Equipado</span>}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}