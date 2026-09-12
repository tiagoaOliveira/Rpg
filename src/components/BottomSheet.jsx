import { X } from 'lucide-react'
import './BottomSheet.css'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  function handleClose() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    onClose()
  }

  return (
    <>
      <div
        className={`bottom-sheet-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <div
        className={`bottom-sheet ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal={isOpen || undefined}
        inert={!isOpen}
      >
        <div className="bottom-sheet-handle" />
        <div className="bottom-sheet-header">
          <h2>{title}</h2>
          <button className="bottom-sheet-close" onClick={handleClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="bottom-sheet-content">{children}</div>
      </div>
    </>
  )
}