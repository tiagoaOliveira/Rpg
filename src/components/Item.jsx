import Modal from './Modal'
import './Item.css'

export default function Item({ isOpen, onClose, item }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item?.name ?? 'Item'}>
      <div className="item-panel">
        <div className="item-icon-large" />
        {/* descrição, raridade, stats do item entram aqui */}
      </div>
    </Modal>
  )
}