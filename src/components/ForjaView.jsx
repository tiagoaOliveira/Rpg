import { useState } from 'react';
import { RECIPES } from '../data/recipes';
import { getItemById } from '../data/items';
import { getLearnedRecipes } from '../utils/recipes';
import { getInventory, addItem, removeItem } from '../utils/inventory';
import './ForjaView.css';

export default function ForjaView({ characterId }) {
  const [learnedIds] = useState(() => getLearnedRecipes(characterId));
  const [inventory, setInventory] = useState(() => getInventory(characterId));
  const [feedback, setFeedback] = useState({});

  const learnedRecipes = learnedIds.map((id) => RECIPES[id]).filter(Boolean);

  function canCraft(recipe) {
    return recipe.materials.every((m) => (inventory[m.itemId] || 0) >= m.quantity);
  }

  function handleCraft(recipe) {
    if (!canCraft(recipe)) return;

    let updated = inventory;
    recipe.materials.forEach((m) => {
      updated = removeItem(characterId, m.itemId, m.quantity);
    });
    updated = addItem(characterId, recipe.resultItemId, 1);
    setInventory(updated);

    setFeedback((prev) => ({ ...prev, [recipe.id]: true }));
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [recipe.id]: false }));
    }, 1800);
  }

  if (learnedRecipes.length === 0) {
    return (
      <div className="forja-view forja-view--empty">
        <span className="forja-empty__badge">Nenhuma receita</span>
        <p>Você ainda não aprendeu nenhuma receita. Farme para encontrar uma.</p>
      </div>
    );
  }

  return (
    <div className="forja-view">
      {learnedRecipes.map((recipe) => {
        const resultItem = getItemById(recipe.resultItemId);
        const craftable = canCraft(recipe);

        return (
          <div key={recipe.id} className="forja-card">
            <div className="forja-card__icon" style={{ '--item-color': resultItem?.color }}>
              <span>{resultItem?.name.charAt(0).toUpperCase()}</span>
            </div>

            <div className="forja-card__info">
              <h3 className="forja-card__name">{resultItem?.name}</h3>
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
      })}
    </div>
  );
}