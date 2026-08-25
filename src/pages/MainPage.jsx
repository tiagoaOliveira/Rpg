import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveCharacter, clearActiveCharacter } from '../utils/storage';
import { getClassById } from '../data/classes';
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
  const [character, setCharacter] = useState(null);
  const [activeSection, setActiveSection] = useState('farm');

  useEffect(() => {
    const active = getActiveCharacter();
    if (!active) {
      navigate('/');
      return;
    }
    setCharacter(active);
  }, [navigate]);

  function handleSwitchCharacter() {
    clearActiveCharacter();
    navigate('/');
  }

  if (!character) return null;

  const characterClass = getClassById(character.classId);

  return (
    <div className="main-page">
      <header className="main-page__header">
        <span className="main-page__eyebrow">{SECTION_TITLES[activeSection]}</span>
        <HamburgerMenu onSwitchCharacter={handleSwitchCharacter} />
      </header>

      <main className="main-page__stage">
        {activeSection === 'personagem' ? (
          <CharacterPanel character={character} characterClass={characterClass} />
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