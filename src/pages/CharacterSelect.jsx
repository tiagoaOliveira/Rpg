import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLASSES } from '../data/classes';
import {
  getCharacters,
  createCharacter,
  deleteCharacter,
  setActiveCharacter,
  MAX_CHARACTER_SLOTS,
} from '../utils/storage';
import './CharacterSelect.css';

export default function CharacterSelect() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(CLASSES[0].id);
  const [error, setError] = useState('');

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  function openCreateForm() {
    setName('');
    setSelectedClassId(CLASSES[0].id);
    setError('');
    setCreating(true);
  }

  function handleCreate(e) {
    e.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      setError('O nome precisa ter pelo menos 3 caracteres.');
      return;
    }

    const chosenClass = CLASSES.find((c) => c.id === selectedClassId);

    try {
      const newCharacter = createCharacter({
        name: trimmedName,
        classId: chosenClass.id,
        baseStats: chosenClass.baseStats,
      });
      setCharacters(getCharacters());
      setCreating(false);
      enterGame(newCharacter.id);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete(id, e) {
    e.stopPropagation();
    const confirmed = window.confirm('Excluir este personagem permanentemente?');
    if (!confirmed) return;
    deleteCharacter(id);
    setCharacters(getCharacters());
  }

  function enterGame(id) {
    setActiveCharacter(id);
    navigate('/game');
  }

  const emptySlots = MAX_CHARACTER_SLOTS - characters.length;

  return (
    <div className="char-select">
      <div className="char-select__header">
        <span className="char-select__eyebrow">Antes de partir</span>
        <h1 className="char-select__title">Escolha seu personagem</h1>
        <p className="char-select__subtitle">
          O progresso fica salvo neste dispositivo até você criar uma conta.
        </p>
      </div>

      <div className="char-select__grid">
        {characters.map((character) => {
          const characterClass = CLASSES.find((c) => c.id === character.classId);
          return (
            <div
  key={character.id}
  className="char-card"
  style={{ '--class-color': characterClass?.color }}
  onClick={() => enterGame(character.id)}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      enterGame(character.id);
    }
  }}
>
  <button
    type="button"
    className="char-card__delete"
    onClick={(e) => handleDelete(character.id, e)}
    aria-label={`Excluir ${character.name}`}
    title="Excluir personagem"
  >
    ×
  </button>

  <div className="char-card__portrait">
    <span>{character.name.charAt(0).toUpperCase()}</span>
  </div>

  <h2 className="char-card__name">{character.name}</h2>
  <span className="char-card__class">{characterClass?.name}</span>
  <span className="char-card__level">Nível {character.level}</span>

  <div className="char-card__stats">
    <span>HP {character.stats.hp}</span>
    <span>ATK {character.stats.attack}</span>
    <span>DEF {character.stats.defense}</span>
  </div>
</div>
          );
        })}

        {Array.from({ length: emptySlots }).map((_, i) => (
          <button key={`empty-${i}`} className="char-card char-card--empty" onClick={openCreateForm}>
            <span className="char-card__plus">+</span>
            <span>Criar personagem</span>
          </button>
        ))}
      </div>

      {creating && (
        <div className="char-modal__backdrop" onClick={() => setCreating(false)}>
          <form className="char-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
            <h2 className="char-modal__title">Novo personagem</h2>

            <label className="char-modal__label" htmlFor="char-name">
              Nome
            </label>
            <input
              id="char-name"
              className="char-modal__input"
              type="text"
              value={name}
              maxLength={16}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Kael"
              autoFocus
            />

            <span className="char-modal__label">Classe</span>
            <div className="char-modal__classes">
              {CLASSES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`class-option ${selectedClassId === c.id ? 'class-option--active' : ''}`}
                  style={{ '--class-color': c.color }}
                  onClick={() => setSelectedClassId(c.id)}
                >
                  <span className="class-option__name">{c.name}</span>
                  <span className="class-option__tagline">{c.tagline}</span>
                  <div className="class-option__stats">
                    <span>HP {c.baseStats.hp}</span>
                    <span>ATK {c.baseStats.attack}</span>
                    <span>DEF {c.baseStats.defense}</span>
                    <span>CRIT {c.baseStats.crit}%</span>
                    <span>VEL {c.baseStats.speed}</span>
                  </div>
                </button>
              ))}
            </div>

            {error && <p className="char-modal__error">{error}</p>}

            <div className="char-modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setCreating(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Começar jornada
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
