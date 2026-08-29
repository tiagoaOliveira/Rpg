import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCharacters,
  createCharacter,
  deleteCharacter,
  setActiveCharacter,
  MAX_CHARACTER_SLOTS,
} from '../utils/characters';
import { useAuth } from '../context/AuthContext';
import './CharacterSelect.css';

export default function CharacterSelect() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getCharacters(user.id)
      .then(setCharacters)
      .finally(() => setLoadingCharacters(false));
  }, [user]);

  function openCreateForm() {
    setName('');
    setError('');
    setCreating(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      setError('O nome precisa ter pelo menos 3 caracteres.');
      return;
    }

    try {
      const newCharacter = await createCharacter({ userId: user.id, name: trimmedName });
      setCharacters((prev) => [...prev, newCharacter]);
      setCreating(false);
      enterGame(newCharacter.id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    const confirmed = window.confirm('Excluir este personagem permanentemente?');
    if (!confirmed) return;
    await deleteCharacter(id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }

  function enterGame(id) {
    setActiveCharacter(id);
    navigate('/game');
  }

  if (authLoading || loadingCharacters) {
    return <div className="char-select__loading">Carregando...</div>;
  }

  const emptySlots = MAX_CHARACTER_SLOTS - characters.length;

  return (
    <div className="char-select">
      <div className="char-select__header">
        <span className="char-select__eyebrow">Antes de partir</span>
        <h1 className="char-select__title">Escolha seu personagem</h1>
        <p className="char-select__subtitle">Seu progresso fica salvo automaticamente.</p>
      </div>

      <div className="char-select__grid">
        {characters.map((character) => (
          <button key={character.id} className="char-card" onClick={() => enterGame(character.id)}>
            <button
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
            <span className="char-card__level">Nível {character.level}</span>
            <div className="char-card__stats">
              <span>HP {character.stats.hp}</span>
              <span>ATK {character.stats.attack}</span>
              <span>DEF {character.stats.defense}</span>
            </div>
          </button>
        ))}

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