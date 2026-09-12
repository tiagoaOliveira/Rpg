import { useState } from 'react'
import { Coins, Gem, Menu, LogOut } from 'lucide-react'
import './Header.css'

export default function Header({
  avatarUrl,
  level = 1,
  combatPower = 0,
  gold = 0,
  diamonds = 0,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogoutClick() {
    setMenuOpen(false)
    onLogout?.()
  }

  return (
    <header className="game-header">
      <div className="game-header-player">
        <div className="player-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" />
          ) : (
            <div className="player-avatar-placeholder" />
          )}
          <span className="player-level">{level}</span>
        </div>
        <div className="player-info">
          <span className="player-label">Combat Power</span>
          <span className="player-cp">{combatPower.toLocaleString()}</span>
        </div>
      </div>

      <div className="game-header-right">
        <div className="game-header-currency">
          <div className="currency-item">
            <Coins size={16} />
            <span>{gold.toLocaleString()}</span>
          </div>
          <div className="currency-item">
            <Gem size={16} />
            <span>{diamonds.toLocaleString()}</span>
          </div>
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