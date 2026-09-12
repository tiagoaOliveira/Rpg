import { useState } from 'react'
import BottomSheet from './BottomSheet'
import Item from './Item'
import './Inventory.css'

// só um item de teste por enquanto
const TEST_ITEMS = [{ id: 'item-1', name: 'Espada de Teste' }]

export default function Inventory({ isOpen, onClose }) {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Inventário">
      <div className="inventory-panel">
        <div className="inventory-grid">
          {TEST_ITEMS.map((item) => (
            <button
              key={item.id}
              className="inventory-slot"
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </div>

      <Item
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </BottomSheet>
  )
}