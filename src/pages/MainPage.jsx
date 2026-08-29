import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveCharacterId, clearActiveCharacter, getCharacterById } from '../utils/characters';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import HamburgerMenu from '../components/HamburgerMenu';
import CharacterPanel from '../components/CharacterPanel';
import FarmView from '../components/FarmView';
import ForjaView from '../components/ForjaView';
import InventoryView from '../components/InventoryView';
import './MainPage.css';

const SECTION_TITLES = {
  personagem: 'Personagem',
  farm: 'Farm',
  forja: 'Forja',
  arena: 'Arena',
  mercado: 'Mercado',
  inventario: 'Inventário',
};

export default function MainPage() {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const [character, setCharacter] = useState(null);
  const [loadingCharacter, setLoadingCharacter] = useState(true);
  const [activeSection, setActiveSection] = useState('farm');

  useEffect(() => {
    if (authLoading) return;

    const activeId = getActiveCharacterId();
    if (!activeId) {
      navigate('/');
      return;
    }

    getCharacterById(activeId)
      .then((data) => {
        if (!data) {
          navigate('/');
          return;
        }
        setCharacter(data);
      })
      .finally(() => setLoadingCharacter(false));
  }, [authLoading, navigate]);

  function handleSwitchCharacter() {
    clearActiveCharacter();
    navigate('/');
  }

  if (authLoading || loadingCharacter || !character) return null;

  return (
    <div className="main-page">
      <header className="main-page__header">
        <span className="main-page__eyebrow">{SECTION_TITLES[activeSection]}</span>
        <HamburgerMenu onSwitchCharacter={handleSwitchCharacter} />
      </header>

      <main className="main-page__stage">
        {activeSection === 'personagem' ? (
          <CharacterPanel character={character} />
        ) : activeSection === 'farm' ? (
          <FarmView characterId={character.id} />
        ) : activeSection === 'forja' ? (
          <ForjaView characterId={character.id} />
        ) : activeSection === 'inventario' ? (
          <InventoryView characterId={character.id} />
        ) : (
          <ComingSoon />
        )}
      </main>

      <BottomNav activeId={activeSection} onSelect={setActiveSection} />
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="coming-soon">
      <span className="coming-soon__badge">Em breve</span>
      <p>Essa área ainda está sendo forjada.</p>
    </div>
  );
}