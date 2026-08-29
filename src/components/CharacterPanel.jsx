import { useEffect, useState } from 'react';
import { EQUIPMENT_SLOTS } from '../data/equipmentSlots';
import { getItemById } from '../data/items';
import { getInventory } from '../utils/inventory';
import { getEquipped, equip, unequip } from '../utils/equipment';
import Modal from './Modal';
import './CharacterPanel.css';

export default function CharacterPanel({ character }) {
  const characterId = character.id;
  const xpToNextLevel = character.level * 100;

  const [equipped, setEquipped] = useState({});
  const [inventory, setInventory] = useState({});
  const [openSlotId, setOpenSlotId] = useState(null);

  useEffect(() => {
    getEquipped(characterId).then(setEquipped);
    getInventory(characterId).then(setInventory);
  }, [characterId]);

  async function handleEquip(slotId, itemId) {
    const previousEquipped = equipped;
    const previousInventory = inventory;
    const previousItemId = equipped[slotId];

    // Otimista: atualiza a tela na hora, sem esperar o banco.
    setEquipped((prev) => ({ ...prev, [slotId]: itemId }));
    setInventory((prev) => {
      const next = { ...prev };
      next[itemId] = (next[itemId] || 0) - 1;
      if (next[itemId] <= 0) delete next[itemId];
      if (previousItemId) next[previousItemId] = (next[previousItemId] || 0) + 1;
      return next;
    });
    setOpenSlotId(null);

    try {
      await equip(characterId, slotId, itemId);
    } catch (err) {
      console.error('Erro ao equipar:', err);
      setEquipped(previousEquipped);
      setInventory(previousInventory);
    }
  }

  async function handleUnequip(slotId) {
    const previousEquipped = equipped;
    const previousInventory = inventory;
    const itemId = equipped[slotId];

    setEquipped((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setInventory((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    setOpenSlotId(null);

    try {
      await unequip(characterId, slotId);
    } catch (err) {
      console.error('Erro ao desequipar:', err);
      setEquipped(previousEquipped);
      setInventory(previousInventory);
    }
  }

  const allSlots = [...EQUIPMENT_SLOTS.left, ...EQUIPMENT_SLOTS.right, ...EQUIPMENT_SLOTS.bottom];
  const openSlot = allSlots.find((s) => s.id === openSlotId) || null;

  return (
    <div className="character-panel">
      <div className="equip-board">
        <div className="equip-column">
          {EQUIPMENT_SLOTS.left.map((slot) => (
            <EquipSlot
              key={slot.id}
              slot={slot}
              equippedItemId={equipped[slot.id]}
              onClick={() => setOpenSlotId(slot.id)}
            />
          ))}
        </div>

        <div className="equip-center">
          <div className="equip-portrait">
            <span>{character.name.charAt(0).toUpperCase()}</span>
          </div>
          <h3 className="equip-center__name">{character.name}</h3>
        </div>

        <div className="equip-column">
          {EQUIPMENT_SLOTS.right.map((slot) => (
            <EquipSlot
              key={slot.id}
              slot={slot}
              equippedItemId={equipped[slot.id]}
              onClick={() => setOpenSlotId(slot.id)}
            />
          ))}
        </div>
      </div>

      <div className="equip-bottom">
        {EQUIPMENT_SLOTS.bottom.map((slot) => (
          <EquipSlot
            key={slot.id}
            slot={slot}
            equippedItemId={equipped[slot.id]}
            onClick={() => setOpenSlotId(slot.id)}
            compact
          />
        ))}
      </div>

      <div className="level-block">
        <span>Nível {character.level}</span>
        <div className="level-block__xp-bar">
          <div
            className="level-block__xp-fill"
            style={{ width: `${Math.min(100, (character.xp / xpToNextLevel) * 100)}%` }}
          />
        </div>
        <span className="level-block__xp-label">
          {character.xp} / {xpToNextLevel} XP
        </span>
      </div>

      <div className="stats-panel">
        <h3 className="stats-panel__title">Atributos</h3>
        <div className="stats-panel__grid">
          <Stat label="HP" value={character.stats.hp} />
          <Stat label="Ataque" value={character.stats.attack} />
          <Stat label="Defesa" value={character.stats.defense} />
          <Stat label="Crítico" value={`${character.stats.crit}%`} />
          <Stat label="Velocidade" value={character.stats.speed} />
        </div>
      </div>

      {openSlot && (
        <Modal title={openSlot.label} onClose={() => setOpenSlotId(null)}>
          <SlotModalContent
            slot={openSlot}
            equippedItemId={equipped[openSlot.id]}
            inventory={inventory}
            onEquip={(itemId) => handleEquip(openSlot.id, itemId)}
            onUnequip={() => handleUnequip(openSlot.id)}
          />
        </Modal>
      )}
    </div>
  );
}

function SlotModalContent({ slot, equippedItemId, inventory, onEquip, onUnequip }) {
  const equippedItem = equippedItemId ? getItemById(equippedItemId) : null;

  const availableItems = Object.entries(inventory)
    .filter(([itemId, qty]) => {
      if (qty <= 0) return false;
      const item = getItemById(itemId);
      return item?.category === 'equipment' && item.slot === slot.id;
    })
    .map(([itemId]) => getItemById(itemId));

  return (
    <div className="slot-modal">
      {equippedItem && (
        <div className="slot-modal__current">
          <div className="slot-modal__current-icon" style={{ '--item-color': equippedItem.color }}>
            <span>{equippedItem.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="slot-modal__current-info">
            <span className="slot-modal__current-name">{equippedItem.name}</span>
            <span className="slot-modal__current-label">Equipado</span>
          </div>
          <button className="btn btn--ghost" onClick={onUnequip}>
            Desequipar
          </button>
        </div>
      )}

      <h4 className="slot-modal__subtitle">Disponíveis</h4>
      {availableItems.length === 0 ? (
        <p className="slot-modal__empty">Nenhum item disponível para esse slot.</p>
      ) : (
        <ul className="slot-modal__list">
          {availableItems.map((item) => (
            <li key={item.id} className="slot-modal__item">
              <div className="slot-modal__item-icon" style={{ '--item-color': item.color }}>
                <span>{item.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="slot-modal__item-name">{item.name}</span>
              <button className="btn btn--primary" onClick={() => onEquip(item.id)}>
                Equipar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EquipSlot({ slot, equippedItemId, onClick, compact }) {
  const item = equippedItemId ? getItemById(equippedItemId) : null;

  return (
    <button
      className={`equip-slot ${compact ? 'equip-slot--compact' : ''} ${item ? 'equip-slot--filled' : ''}`}
      style={item ? { '--item-color': item.color } : undefined}
      onClick={onClick}
      title={item ? item.name : slot.label}
    >
      {item ? (
        <span className="equip-slot__item-initial">{item.name.charAt(0).toUpperCase()}</span>
      ) : (
        <span className="equip-slot__label">{slot.label}</span>
      )}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-block">
      <span className="stat-block__label">{label}</span>
      <span className="stat-block__value">{value}</span>
    </div>
  );
}