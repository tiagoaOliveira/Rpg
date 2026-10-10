import { useState } from 'react'
import { Sword, Shield, HardHat, Hand, Footprints, CircleDot } from 'lucide-react'
import { EQUIPMENT_TYPES, EQUIPMENT_BASES_BY_TYPE } from '../data/equipment'
import { RESOURCES } from '../data/resources'
import { useInventory } from '../context/InventoryContext'
import './Forge.css'

const TYPE_ICONS = {
  weapon: Sword,
  armor: Shield,
  helmet: HardHat,
  gloves: Hand,
  pants: Footprints,
  ring: CircleDot,
}

export default function Forge() {
  const { getAmount, canAfford, forgeItem } = useInventory()
  const [selectedType, setSelectedType] = useState(null)
  const [message, setMessage] = useState(null)

  const bases = selectedType ? EQUIPMENT_BASES_BY_TYPE[selectedType] : []

  function handleSelectType(typeId) {
    setSelectedType(typeId)
    setMessage(null)
  }

  function handleForge(base) {
    if (forgeItem(base.id)) {
      setMessage(`Forjado: ${base.name} Nv 1`)
    }
  }

  return (
    <div className="forge-page">
      <div className="forge-categories">
        {EQUIPMENT_TYPES.map((type) => {
          const Icon = TYPE_ICONS[type.id]
          return (
            <button
              key={type.id}
              className={`forge-category ${selectedType === type.id ? 'is-active' : ''}`}
              onClick={() => handleSelectType(type.id)}
            >
              <Icon size={22} />
              {type.name}
            </button>
          )
        })}
      </div>

      {!selectedType && (
        <p className="forge-hint">Escolha uma categoria para ver o que pode ser forjado.</p>
      )}

      {selectedType && (
        <div className="forge-list">
          {bases.map((base) => {
            const affordable = canAfford(base.cost)
            return (
              <div key={base.id} className="forge-item">
                <div className="forge-item-icon" />
                <div className="forge-item-info">
                  <span className="forge-item-name">{base.name}</span>
                  <div className="forge-item-costs">
                    {base.cost.map(({ resourceId, amount }) => {
                      const have = getAmount(resourceId)
                      return (
                        <span
                          key={resourceId}
                          className={`forge-item-cost ${have >= amount ? '' : 'is-insufficient'}`}
                        >
                          {RESOURCES[resourceId].name}: {have}/{amount}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <button
                  className="forge-item-button"
                  disabled={!affordable}
                  onClick={() => handleForge(base)}
                >
                  Forjar
                </button>
              </div>
            )
          })}
        </div>
      )}

      {message && <p className="forge-message">{message}</p>}
    </div>)
}