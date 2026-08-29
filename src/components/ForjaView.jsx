import { useEffect, useState } from 'react';
import { getItemById } from '../data/items';
import { getProfessionById, getProfessionsList } from '../data/professionsCatalog';
import { getRecipesByProfession } from '../data/recipesCatalog';
import { getLearnedRecipes } from '../utils/recipes';
import { getInventory, addItem, removeItem } from '../utils/inventory';
import { getCharacterProfessions, learnProfession, addProfessionXp, getMaxProfessions } from '../utils/professions';
import Modal from './Modal';
import './ForjaView.css';

export default function ForjaView({ characterId }) {
  const [learnedRecipeIds, setLearnedRecipeIds] = useState([]);
  const [inventory, setInventory] = useState({});
  const [professions, setProfessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [learnError, setLearnError] = useState('');
  const [openProfessionId, setOpenProfessionId] = useState(null);

  useEffect(() => {
    Promise.all([
      getLearnedRecipes(characterId),
      getInventory(characterId),
      getCharacterProfessions(characterId),
    ]).then(([recipeIds, inv, profs]) => {
      setLearnedRecipeIds(recipeIds);
      setInventory(inv);
      setProfessions(profs);
      setLoading(false);
    });
  }, [characterId]);

  const learnedProfessionIds = Object.keys(professions);
  const isMaxed = learnedProfessionIds.length >= getMaxProfessions();
  // Lista de profissões é catálogo estático em cache — não busca de novo aqui.
  const availableToLearn = getProfessionsList().filter((p) => !learnedProfessionIds.includes(p.id));

  async function handleLearnProfession(professionId) {
    setLearnError('');
    try {
      const updated = await learnProfession(characterId, professionId);
      setProfessions(updated);
    } catch (err) {
      setLearnError(err.message);
    }
  }

  if (loading) return null;

  return (
    <div className="forja-view">
      {learnedProfessionIds.length > 0 && (
        <div className="profession-grid">
          {learnedProfessionIds.map((id) => {
            const info = getProfessionById(id);
            const prof = professions[id];
            const xpToNext = prof.level * 100;
            return (
              <button key={id} className="profession-tile" onClick={() => setOpenProfessionId(id)}>
                <span className="profession-tile__name">{info?.name ?? id}</span>
                <span className="profession-tile__level">Nível {prof.level}</span>
                <div className="profession-tile__xp-bar">
                  <div
                    className="profession-tile__xp-fill"
                    style={{ width: `${Math.min(100, (prof.xp / xpToNext) * 100)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!isMaxed && (
        <div className="forja-section">
          <h3 className="forja-section__title">
            {learnedProfessionIds.length === 0 ? 'Escolha uma profissão' : 'Aprender outra profissão'}
          </h3>
          <div className="profession-learn-list">
            {availableToLearn.map((p) => (
              <div key={p.id} className="profession-learn-card">
                <div>
                  <span className="profession-learn-card__name">{p.name}</span>
                  <span className="profession-learn-card__desc">{p.description}</span>
                </div>
                <button className="btn btn--primary" onClick={() => handleLearnProfession(p.id)}>
                  Aprender
                </button>
              </div>
            ))}
          </div>
          {learnError && <p className="forja-card__lock">{learnError}</p>}
        </div>
      )}

      {openProfessionId && (
        <Modal title={getProfessionById(openProfessionId)?.name} onClose={() => setOpenProfessionId(null)}>
          <ProfessionModalContent
            characterId={characterId}
            professionId={openProfessionId}
            profession={professions[openProfessionId]}
            learnedRecipeIds={learnedRecipeIds}
            inventory={inventory}
            onInventoryChange={setInventory}
            onProfessionChange={(updated) =>
              setProfessions((prev) => ({ ...prev, [openProfessionId]: updated }))
            }
          />
        </Modal>
      )}
    </div>
  );
}

function ProfessionModalContent({
  characterId,
  professionId,
  profession,
  learnedRecipeIds,
  inventory,
  onInventoryChange,
  onProfessionChange,
}) {
  const [feedback, setFeedback] = useState({});
  // Receitas dessa profissão vêm do catálogo em cache — nenhuma busca ao abrir o modal.
  const recipes = getRecipesByProfession(professionId).filter((r) => learnedRecipeIds.includes(r.id));
  const xpToNext = profession.level * 100;

  function craftLockReason(recipe) {
    if (profession.level < recipe.unlockLevel) {
      return `Requer nível ${recipe.unlockLevel} (atual: ${profession.level})`;
    }
    return null;
  }

  async function handleCraft(recipe) {
    const lockReason = craftLockReason(recipe);
    const materialsOk = recipe.materials.every((m) => (inventory[m.itemId] || 0) >= m.quantity);
    if (lockReason || !materialsOk) return;

    for (const m of recipe.materials) {
      await removeItem(characterId, m.itemId, m.quantity);
    }
    await addItem(characterId, recipe.resultItemId, 1);
    onInventoryChange(await getInventory(characterId));

    // Depois do xp_cap_level configurado na receita, forjar esse item não dá mais XP.
    const withinXpCap = recipe.xpCapLevel == null || profession.level <= recipe.xpCapLevel;
    if (withinXpCap) {
      const result = await addProfessionXp(characterId, professionId, recipe.xpReward);
      if (result) onProfessionChange(result);
    }

    setFeedback((prev) => ({ ...prev, [recipe.id]: true }));
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [recipe.id]: false }));
    }, 1800);
  }

  return (
    <div className="profession-modal">
      <div className="profession-modal__xp">
        <span className="profession-modal__xp-label">Nível {profession.level}</span>
        <span className="profession-modal__xp-value">
          {profession.xp} / {xpToNext} XP
        </span>
      </div>

      {recipes.length === 0 ? (
        <p className="forja-empty-text">Nenhuma receita conhecida dessa profissão ainda. Farme para encontrar uma.</p>
      ) : (
        recipes.map((recipe) => {
          const resultItem = getItemById(recipe.resultItemId);
          const lockReason = craftLockReason(recipe);
          const materialsOk = recipe.materials.every((m) => (inventory[m.itemId] || 0) >= m.quantity);
          const craftable = !lockReason && materialsOk;

          return (
            <div key={recipe.id} className="forja-card">
              <div className="forja-card__icon" style={{ '--item-color': resultItem?.color }}>
                <span>{resultItem?.name.charAt(0).toUpperCase()}</span>
              </div>

              <div className="forja-card__info">
                <h3 className="forja-card__name">{resultItem?.name}</h3>
                {lockReason ? (
                  <p className="forja-card__lock">{lockReason}</p>
                ) : (
                  <ul className="forja-card__materials">
                    {recipe.materials.map((m) => {
                      const material = getItemById(m.itemId);
                      const have = inventory[m.itemId] || 0;
                      const enough = have >= m.quantity;
                      return (
                        <li key={m.itemId} className={enough ? '' : 'forja-card__material--missing'}>
                          {material?.name} {have}/{m.quantity}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button
                className="btn btn--primary forja-card__action"
                disabled={!craftable}
                onClick={() => handleCraft(recipe)}
              >
                {feedback[recipe.id] ? 'Forjado!' : 'Forjar'}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}