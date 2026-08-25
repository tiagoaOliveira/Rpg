import { useState, useRef, useEffect } from 'react';
import { Menu, LogIn, LogOut, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HamburgerMenu.css';

export default function HamburgerMenu({ onSwitchCharacter }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogin() {
    setOpen(false);
    navigate('/login');
  }

  function handleLogout() {
    setOpen(false);
    signOut();
  }

  function handleSwitch() {
    setOpen(false);
    onSwitchCharacter();
  }

  return (
    <div className="hamburger" ref={menuRef}>
      <button className="hamburger__trigger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
        <Menu size={20} strokeWidth={1.8} />
      </button>

      {open && (
        <div className="hamburger__panel">
          {user ? (
            <>
              <div className="hamburger__user">{user.email}</div>
              <button className="hamburger__item" onClick={handleLogout}>
                <LogOut size={16} strokeWidth={1.8} />
                Sair
              </button>
            </>
          ) : (
            <button className="hamburger__item" onClick={handleLogin}>
              <LogIn size={16} strokeWidth={1.8} />
              Entrar
            </button>
          )}
          <button className="hamburger__item" onClick={handleSwitch}>
            <Users size={16} strokeWidth={1.8} />
            Trocar personagem
          </button>
        </div>
      )}
    </div>
  );
}