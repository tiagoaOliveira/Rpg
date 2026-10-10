import { useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { RESOURCE_ICONS } from '../lib/resourceIcons'
import './Header.css'

export default function Header({ avatarUrl, level = 1, resources = [], onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogoutClick() {
    setMenuOpen(false)
    onLogout?.()
  }

  return (
    <header className="game-header">
      <div className="player-avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" />
        ) : (
          <div className="player-avatar-placeholder" />
        )}
        <span className="player-level">{level}</span>
      </div>

      <div className="game-header-right">
        <div className="game-header-currency">
          {resources.map(({ id, amount }) => {
            const Icon = RESOURCE_ICONS[id]
            return (
              <div key={id} className={`currency-item is-${id}`}>
                <Icon size={16} />
                <span>{amount.toLocaleString()}</span>
              </div>
            )
          })}
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