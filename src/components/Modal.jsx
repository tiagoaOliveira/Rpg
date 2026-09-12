import { X } from 'lucide-react'
import './Modal.css'

export default function Modal({ isOpen, onClose, title, children }) {
  function handleClose() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    onClose()
  }

  return (
    <>
      <div
        className={`modal-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <div
        className={`modal-box ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal={isOpen || undefined}
        inert={!isOpen}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </>
  )
}