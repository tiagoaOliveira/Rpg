import { useState } from 'react';
import { ChevronLeft, ChevronRight, ScrollText, Lock } from 'lucide-react';
import { FARM_ZONES } from '../data/farmZones';
import { addItem } from '../utils/inventory';
import Modal from './Modal';
import './FarmView.css';

export default function FarmView({ characterId }) {
  const [zoneIndex, setZoneIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [runOpen, setRunOpen] = useState(false);
  // Só uma run ativa por vez: { zoneId, drops: { itemId: quantidade } }
  const [activeFarm, setActiveFarm] = useState(null);

  const zone = FARM_ZONES[zoneIndex];
  const isFarmingHere = activeFarm?.zoneId === zone.id;
  const isFarmingElsewhere = Boolean(activeFarm) && activeFarm.zoneId !== zone.id;

  function goPrev() {
    setZoneIndex((i) => (i - 1 + FARM_ZONES.length) % FARM_ZONES.length);
  }

  function goNext() {
    setZoneIndex((i) => (i + 1) % FARM_ZONES.length);
  }

  function pickWeightedDrop(drops) {
    const weights = drops.map((d) => parseFloat(d.rate) || 0);
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < drops.length; i++) {
      if (roll < weights[i]) return drops[i];
      roll -= weights[i];
    }
    return drops[drops.length - 1];
  }

  function handleFarm() {
    if (zone.requiresAccount || isFarmingElsewhere) return;

    // Teste: cada clique dropa 5 itens instantaneamente, sorteados por peso (rate) da zona.
    const gained = {};
    for (let i = 0; i < 5; i++) {
      const drop = pickWeightedDrop(zone.drops);
      gained[drop.itemId] = (gained[drop.itemId] || 0) + 1;
      addItem(characterId, drop.itemId, 1);
    }

    setActiveFarm((prev) => {
      const base = prev && prev.zoneId === zone.id ? prev.drops : {};
      const merged = { ...base };
      Object.entries(gained).forEach(([itemId, qty]) => {
        merged[itemId] = (merged[itemId] || 0) + qty;
      });
      return { zoneId: zone.id, drops: merged };
    });
  }

  function handleStop() {
    setActiveFarm(null);
  }

  const runDrops = isFarmingHere ? Object.entries(activeFarm.drops) : [];

  return (
    <div className="farm-view">
      <div className="farm-nav">
        <button className="farm-arrow" onClick={goPrev} aria-label="Zona anterior">
          <ChevronLeft size={22} />
        </button>

        <div className="farm-card">
          <span className="farm-card__level">Nv. {zone.levelRange}</span>

          <button
            className="farm-card__info"
            onClick={() => setInfoOpen(true)}
            aria-label={`Ver drops de ${zone.name}`}
          >
            ?
          </button>

          <h3 className="farm-card__name">{zone.name}</h3>

          {zone.requiresAccount ? (
            <div className="farm-card__locked">
              <Lock size={18} />
              <span>Requer conta para farmar aqui</span>
            </div>
          ) : (
            <>
              <div className="farm-card__actions">
                <button
                  className="btn btn--primary farm-card__action"
                  onClick={handleFarm}
                  disabled={isFarmingElsewhere}
                >
                  {isFarmingHere ? 'Farmar novamente' : 'Farmar'}
                </button>
                <button
                  className="farm-card__run-btn"
                  onClick={() => setRunOpen(true)}
                  aria-label="Ver drops da run"
                >
                  <ScrollText size={18} />
                </button>
              </div>

              {isFarmingHere && (
                <button className="btn btn--ghost farm-card__stop" onClick={handleStop}>
                  Parar run
                </button>
              )}
            </>
          )}

          {isFarmingElsewhere && (
            <span className="farm-card__warning">
              Run ativa em {FARM_ZONES.find((z) => z.id === activeFarm.zoneId)?.name}. Pare antes de
              farmar aqui.
            </span>
          )}
        </div>

        <button className="farm-arrow" onClick={goNext} aria-label="Próxima zona">
          <ChevronRight size={22} />
        </button>
      </div>

      {infoOpen && (
        <Modal title={zone.name} onClose={() => setInfoOpen(false)}>
          <div className="farm-info">
            <div className="farm-info__xp">
              <span className="farm-info__xp-label">XP por hora</span>
              <span className="farm-info__xp-value">{zone.xpPerHour}</span>
            </div>

            <h4 className="farm-info__subtitle">Possíveis drops</h4>
            <ul className="farm-info__drops">
              {zone.drops.map((drop) => (
                <li key={drop.itemId} className="farm-info__drop">
                  <span>{drop.name}</span>
                  <span className="farm-info__drop-rate">{drop.rate}</span>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {runOpen && (
        <Modal title="Drops da run" onClose={() => setRunOpen(false)}>
          <div className="run-info">
            {runDrops.length === 0 ? (
              <p className="run-info__empty">Nenhum item dropado ainda nesta run.</p>
            ) : (
              <ul className="run-info__list">
                {runDrops.map(([itemId, qty]) => {
                  const dropInfo = zone.drops.find((d) => d.itemId === itemId);
                  return (
                    <li key={itemId} className="run-info__item">
                      <span>{dropInfo?.name ?? itemId}</span>
                      <span className="run-info__qty">x{qty}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}