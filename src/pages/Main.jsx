import { useState } from 'react'
import { Swords } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Hub from '../components/Hub'
import Inventory from '../components/Inventory'
import Character from '../components/Character'
import Map from '../components/Map'
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

  function handleSelectHero(hero) {
    setSelectedHero(hero)
    setActiveSheet('character')
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

      <section className="heroes-section">
        <h2>Seus heróis</h2>
        <div className="heroes-grid">
          {HEROES.map((hero) => (
            <button
              key={hero.id}
              className="hero-card"
              onClick={() => handleSelectHero(hero)}
            >
              <Swords size={28} />
              <span>{hero.name}</span>
            </button>
          ))}
        </div>
      </section>

      <Hub active={activeSheet} onOpen={handleOpen} />

      <Inventory isOpen={activeSheet === 'inventory'} onClose={closeSheet} />
      <Character isOpen={activeSheet === 'character'} onClose={closeSheet} hero={selectedHero} />
      <Map isOpen={activeSheet === 'map'} onClose={closeSheet} />
    </div>
  )
}