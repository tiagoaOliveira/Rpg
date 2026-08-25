import { useState } from 'react';
import { getInventory } from '../utils/inventory';
import { getItemById } from '../data/items';
import { learnRecipe, hasLearnedRecipe } from '../utils/recipes';
import { equip } from '../utils/equipment';
import { EQUIPMENT_SLOTS } from '../data/equipmentSlots';
import Modal from './Modal';
import './InventoryView.css';

const TABS = [
  { id: 'materiais', label: 'Materiais', category: 'material' },
  { id: 'equipamentos', label: 'Equipamentos', category: 'equipment' },
  { id: 'receitas', label: 'Receitas', category: 'recipe' },
];

const ALL_SLOTS = [...EQUIPMENT_SLOTS.left, ...EQUIPMENT_SLOTS.right, ...EQUIPMENT_SLOTS.bottom];

export default function InventoryView({ characterId }) {
  const [inventory, setInventory] = useState(() => getInventory(characterId));
  const [activeTab, setActiveTab] = useState('materiais');
  const [openItemId, setOpenItemId] = useState(null);

  const allOwned = Object.entries(inventory).filter(([, qty]) => qty > 0);
  const openItem = openItemId ? getItemById(openItemId) : null;

  function refreshInventory() {
    setInventory(getInventory(characterId));
  }

  function handleLearn() {
    if (!openItem?.recipeId) return;
    learnRecipe(characterId, openItem.recipeId);
    refreshInventory();
  }

  function handleEquip() {
    if (!openItem?.slot) return;
    equip(characterId, openItem.slot, openItem.id);
    refreshInventory();
    setOpenItemId(null);
  }

  if (allOwned.length === 0) {
    return (
      <div className="inventory-view inventory-view--empty">
        <span className="inventory-empty__badge">Vazio</span>
        <p>Você ainda não tem nenhum item. Vá farmar algo.</p>
      </div>
    );
  }

  const activeCategory = TABS.find((t) => t.id === activeTab)?.category;
  const visibleEntries = allOwned.filter(([itemId]) => getItemById(itemId)?.category === activeCategory);

  return (
    <div className="inventory-view">
      <div className="inventory-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`inventory-tab ${activeTab === tab.id ? 'inventory-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleEntries.length === 0 ? (
        <p className="inventory-tab-empty">Nada aqui ainda.</p>
      ) : (
        <div className="inventory-grid">
          {visibleEntries.map(([itemId, quantity]) => {
            const item = getItemById(itemId);
            const isRecipe = Boolean(item.isRecipe);
            const isEquipment = item.category === 'equipment';
            const isClickable = isRecipe || isEquipment;

            return (
              <button
                key={itemId}
                className={`inventory-slot ${isRecipe ? 'inventory-slot--recipe' : ''}`}
                style={{ '--item-color': item.color }}
                onClick={isClickable ? () => setOpenItemId(itemId) : undefined}
                disabled={!isClickable}
              >
                <div className="inventory-slot__icon">
                  <span>{isRecipe ? '?' : item.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="inventory-slot__name">{item.name}</span>
                <span className="inventory-slot__qty">x{quantity}</span>
              </button>
            );
          })}
        </div>
      )}

      {openItem && openItem.isRecipe && (
        <Modal title={openItem.name} onClose={() => setOpenItemId(null)}>
          <RecipeModalContent
            item={openItem}
            characterId={characterId}
            onLearn={handleLearn}
            onClose={() => setOpenItemId(null)}
          />
        </Modal>
      )}

      {openItem && openItem.category === 'equipment' && (
        <Modal title={openItem.name} onClose={() => setOpenItemId(null)}>
          <div className="equip-modal">
            <p className="equip-modal__slot">
              Slot: {ALL_SLOTS.find((s) => s.id === openItem.slot)?.label ?? openItem.slot}
            </p>
            <button className="btn btn--primary" onClick={handleEquip}>
              Equipar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RecipeModalContent({ item, characterId, onLearn, onClose }) {
  const [justLearned, setJustLearned] = useState(false);
  const alreadyLearned = hasLearnedRecipe(characterId, item.recipeId);

  if (justLearned) {
    return (
      <div className="recipe-modal">
        <p className="recipe-modal__success">Você aprendeu essa receita! Ela já está disponível na Forja.</p>
        <button className="btn btn--primary" onClick={onClose}>
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="recipe-modal">
      <p className="recipe-modal__mystery">
        Uma receita antiga e desgastada. Só vai saber do que se trata ao aprendê-la.
      </p>
      {alreadyLearned ? (
        <p className="recipe-modal__note">Você já conhece essa receita.</p>
      ) : (
        <button
          className="btn btn--primary"
          onClick={() => {
            onLearn();
            setJustLearned(true);
          }}
        >
          Aprender
        </button>
      )}
    </div>
  );
}