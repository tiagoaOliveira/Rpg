import { useState } from 'react'
import { EQUIPMENT_BASES_BY_ID } from '../data/equipment'
import { useInventory } from '../context/InventoryContext'
import { medianLevel } from '../lib/gameMath'
import './Fusion.css'

const FUSION_SIZE = 3

export default function Fusion() {
  const { equipment, fuseItems } = useInventory()
  const [selectedUids, setSelectedUids] = useState([])
  const [message, setMessage] = useState(null)

  const selectedItems = selectedUids
    .map((uid) => equipment.find((item) => item.uid === uid))
    .filter(Boolean)

  // depois do primeiro item escolhido, só os do mesmo equipamento ficam disponíveis
  const lockedBaseId = selectedItems[0]?.baseId ?? null
  const isReady = selectedItems.length === FUSION_SIZE
  const resultBase = lockedBaseId ? EQUIPMENT_BASES_BY_ID[lockedBaseId] : null
  const resultLevel = isReady ? medianLevel(selectedItems.map((item) => item.level)) : null

  const sortedEquipment = [...equipment].sort(
    (a, b) => a.baseId.localeCompare(b.baseId) || a.level - b.level
  )

  function toggleItem(uid) {
    setMessage(null)
    setSelectedUids((current) => {
      if (current.includes(uid)) return current.filter((id) => id !== uid)
      return current.length < FUSION_SIZE ? [...current, uid] : current
    })
  }

  function handleFuse() {
    const result = fuseItems(selectedUids)
    if (result) {
      setMessage(
        `Fusão concluída: ${EQUIPMENT_BASES_BY_ID[result.baseId].name} Nv ${result.level}`
      )
      setSelectedUids([])
    }
  }

  return (
    <div className="fusion-panel">
        <div className="fusion-slots">
          {Array.from({ length: FUSION_SIZE }, (_, index) => {
            const item = selectedItems[index]
            if (!item) return <div key={`empty-${index}`} className="fusion-slot" />
            return (
              <button
                key={item.uid}
                className="fusion-slot is-filled"
                onClick={() => toggleItem(item.uid)}
                aria-label="Remover da fusão"
              >
                <span className="fusion-slot-level">Nv {item.level}</span>
                <span className="fusion-slot-name">{EQUIPMENT_BASES_BY_ID[item.baseId].name}</span>
              </button>
            )
          })}
        </div>

        <p className="fusion-hint">
          Escolha 3 unidades do mesmo equipamento. O novo item terá o nível intermediário
          entre os três.
        </p>

        {isReady && (
          <div className="fusion-result">
            Resultado: {resultBase.name} Nv {resultLevel}
          </div>
        )}

        <button className="fusion-button" disabled={!isReady} onClick={handleFuse}>
          Fundir
        </button>

        {message && <p className="fusion-message">{message}</p>}

        <div className="fusion-list">
          {sortedEquipment.length === 0 && (
            <p className="fusion-empty">Você ainda não tem equipamentos.</p>
          )}
          {sortedEquipment.map((item) => {
            const base = EQUIPMENT_BASES_BY_ID[item.baseId]
            const isSelected = selectedUids.includes(item.uid)
            const isLocked = lockedBaseId !== null && item.baseId !== lockedBaseId
            const isFull = selectedUids.length >= FUSION_SIZE && !isSelected
            return (
              <button
                key={item.uid}
                className={`fusion-list-item ${isSelected ? 'is-selected' : ''}`}
                disabled={isLocked || isFull}
                onClick={() => toggleItem(item.uid)}
              >
                <div className="fusion-list-icon" />
                <span className="fusion-list-name">{base.name}</span>
                <span className="fusion-list-level">Nv {item.level}</span>
              </button>
            )
          })}
        </div>
      </div>
  )
}