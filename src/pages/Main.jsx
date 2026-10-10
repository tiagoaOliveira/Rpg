import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useInventory } from '../context/InventoryContext'
import Header from '../components/Header'
import Hub from '../components/Hub'
import Inventory from '../components/Inventory'
import Character from '../components/Character'
import Map from '../components/Map'
import Forge from '../components/Forge'
import Fusion from '../components/Fusion'
import './Main.css'

// cada chave do Hub aponta para o componente que vira a página
const VIEWS = {
  character: Character,
  map: Map,
  inventory: Inventory,
  forge: Forge,
  fusion: Fusion,
}

export default function Main() {
  const { user, signOut } = useAuth()
  const { getAmount } = useInventory()
  const [activeView, setActiveView] = useState('character')

  async function handleLogout() {
    try {
      await signOut()
    } catch (err) {
      console.error('Erro ao sair:', err.message)
    }
  }

  const ActiveView = VIEWS[activeView]

  return (
    <div className="main-page">
      <Header
        avatarUrl={user?.user_metadata?.avatar_url}
        level={1}
        resources={[
          { id: 'gold', amount: getAmount('gold') },
          { id: 'iron_ore', amount: getAmount('iron_ore') },
        ]}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <ActiveView />
      </main>

      <Hub active={activeView} onOpen={setActiveView} />
    </div>
  )
}