import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Hub from '../components/Hub'
import Inventory from '../components/Inventory'
import Character from '../components/Character'
import Map from '../components/Map'
import Forge from '../components/Forge'
import Craft from '../components/Craft'
import './Main.css'

const HEROES = [
  { id: 'hero-1', name: 'Herói 1' },
  { id: 'hero-2', name: 'Herói 2' },
]

export default function Main() {
  const { user, signOut } = useAuth()
  const [activeSheet, setActiveSheet] = useState(null)
  const [selectedHero, setSelectedHero] = useState(null)

  async function handleLogout() {
    try {
      await signOut()
    } catch (err) {
      console.error('Erro ao sair:', err.message)
    }
  }

  function handleOpen(key) {
    setActiveSheet((current) => (current === key ? null : key))
  }

  function closeSheet() {
    setActiveSheet(null)
  }

  return (
    <div className="main-page">
      <Header
        avatarUrl={user?.user_metadata?.avatar_url}
        level={1}
        combatPower={1234}
        gold={500}
        diamonds={20}
        onLogout={handleLogout}
      />

      <Map />

      <Hub active={activeSheet} onOpen={handleOpen} />

      <Inventory isOpen={activeSheet === 'inventory'} onClose={closeSheet} />
      <Character
        isOpen={activeSheet === 'character'}
        onClose={closeSheet}
        heroes={HEROES}
        initialHeroId={selectedHero?.id}
      />
      <Forge isOpen={activeSheet === 'forge'} onClose={closeSheet} />
      <Craft isOpen={activeSheet === 'craft'} onClose={closeSheet} />
    </div>
  )
}