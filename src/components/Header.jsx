import { useState } from 'react'
import { Menu, LogOut, Swords, Pickaxe } from 'lucide-react'
import ResourceIcon from './ResourceIcon'
import { RESOURCES } from '../data/resources'
import { formatCompact } from '../lib/format'
import './Header.css'

export default function Header({
  combatPower = 0,
  miningPower = 0,
  resources = [],
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogoutClick() {
    setMenuOpen(false)
    onLogout?.()
  }

  return (
    <header className="game-header">
      <div className="game-header-stats">
        <div className="currency-item is-combat" title="Poder de combate">
          <Swords size={16} />
          <span>{formatCompact(combatPower)}</span>
        </div>
        <div className="currency-item is-mining" title="Poder de mineração">
          <Pickaxe size={16} />
          <span>{formatCompact(miningPower)}</span>
        </div>
      </div>

      <div className="game-header-right">
        <div className="game-header-currency">
          {resources.map(({ id, amount }) => (
            <div key={id} className="currency-item" title={RESOURCES[id].name}>
              <ResourceIcon id={id} size={16} />
              <span>{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="header-menu">
          <button
            className="header-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          {menuOpen && (
            <>
              <div className="header-menu-backdrop" onClick={() => setMenuOpen(false)} />
              <div className="header-menu-dropdown">
                <button className="header-menu-item" onClick={handleLogoutClick}>
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}