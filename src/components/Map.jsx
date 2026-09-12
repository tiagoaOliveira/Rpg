import BottomSheet from './BottomSheet'
import './Map.css'

export default function Map({ isOpen, onClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Mapa">
      <div className="map-panel">
        {/* conteúdo do mapa entra aqui */}
      </div>
    </BottomSheet>
  )
}