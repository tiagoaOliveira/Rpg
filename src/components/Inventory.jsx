import { useState } from 'react'
import Item from './Item'
import { EQUIPMENT_BASES_BY_ID } from '../data/equipment'
import { useInventory } from '../context/InventoryContext'
import './Inventory.css'

export default function Inventory() {
  const { equipment } = useInventory()
  const [selectedItem, setSelectedItem] = useState(null)


  return (
    <div className="inventory-panel">
      <section>
        <h3 className="inventory-section-title">Equipamentos</h3>
        {equipment.length === 0 ? (
          <p className="inventory-empty">Nenhum equipamento ainda.</p>
        ) : (
          <div className="inventory-grid">
            {equipment.map((item) => {
              const base = EQUIPMENT_BASES_BY_ID[item.baseId]
              return (
                <button
                  key={item.uid}
                  className="inventory-slot"
                  onClick={() => setSelectedItem({ name: `${base.name} Nv ${item.level}` })}
                >
                  <span className="inventory-slot-level">Nv {item.level}</span>
                  <span className="inventory-slot-name">{base.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <Item
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  )
}