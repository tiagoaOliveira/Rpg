import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useInventory } from '../context/InventoryContext'
import { HEROES } from '../data/heroes'
import Header from '../components/Header'
import Hub from '../components/Hub'
import Inventory from '../components/Inventory'
import Character from '../components/Character'
import Map from '../components/Map'
import Arena from '../components/Arena'
import Forge from '../components/Forge'
import Fusion from '../components/Fusion'
import './Main.css'

// cada chave do Hub aponta para o componente que vira a página
const VIEWS = {
  map: Map,
  arena: Arena,
  character: Character,
  inventory: Inventory,
  forge: Forge,
  fusion: Fusion,
}

// soma de um atributo de todos os heróis do jogador
const sumHeroStat = (stat) => HEROES.reduce((total, hero) => total + hero[stat], 0)

export default function Main() {
  const { signOut } = useAuth()
  const { getAmount } = useInventory()
  const [activeView, setActiveView] = useState('map')

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
        combatPower={sumHeroStat('combatPower')}
        miningPower={sumHeroStat('miningPower')}
        resources={[
          { id: 'gold', amount: getAmount('gold') },
          { id: 'iron_ore', amount: getAmount('iron_ore') },
          { id: 'mitril_ore', amount: getAmount('mitril_ore') },
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