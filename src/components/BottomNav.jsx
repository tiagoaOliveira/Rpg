import { User, Sprout, Hammer, Backpack, Swords, Store } from 'lucide-react';
import './BottomNav.css';

const ITEMS = [
  { id: 'personagem', label: 'Personagem', icon: User },
  { id: 'farm', label: 'Farm', icon: Sprout },
  { id: 'forja', label: 'Forja', icon: Hammer },
  { id: 'inventario', label: 'Inventário', icon: Backpack },
  { id: 'arena', label: 'Arena', icon: Swords },
  { id: 'mercado', label: 'Mercado', icon: Store },
];

export default function BottomNav({ activeId, onSelect }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`bottom-nav__item ${activeId === id ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onSelect(id)}
        >
          <Icon size={20} strokeWidth={1.6} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}