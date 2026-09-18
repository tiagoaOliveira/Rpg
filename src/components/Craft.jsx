import { useState } from 'react'
import BottomSheet from './BottomSheet'
import './Craft.css'

// dados de teste: cada equipamento consome X barras de um tipo
const INITIAL_RECIPES = [
  { id: 'iron-sword', name: 'Espada de Ferro', barName: 'Barra de Ferro', barCost: 3, barOwned: 4 },
  { id: 'copper-shield', name: 'Escudo de Cobre', barName: 'Barra de Cobre', barCost: 4, barOwned: 1 },
  { id: 'gold-ring', name: 'Anel de Ouro', barName: 'Barra de Ouro', barCost: 2, barOwned: 0 },
]

export default function Craft({ isOpen, onClose }) {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES)

  function handleCraft(recipeId) {
    setRecipes((current) =>
      current.map((recipe) =>
        recipe.id === recipeId && recipe.barOwned >= recipe.barCost
          ? { ...recipe, barOwned: recipe.barOwned - recipe.barCost }
          : recipe
      )
    )
    // aqui depois entra a lógica real de adicionar o equipamento no inventário
    console.log('Fabricou:', recipeId)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Fabricar">
      <div className="craft-list">
        {recipes.map((recipe) => {
          const canCraft = recipe.barOwned >= recipe.barCost
          return (
            <div key={recipe.id} className="craft-item">
              <div className="craft-item-icon" />
              <div className="craft-item-info">
                <span className="craft-item-name">{recipe.name}</span>
                <span className={`craft-item-cost ${canCraft ? '' : 'is-insufficient'}`}>
                  {recipe.barName}: {recipe.barOwned}/{recipe.barCost}
                </span>
              </div>
              <button
                className="craft-item-button"
                disabled={!canCraft}
                onClick={() => handleCraft(recipe.id)}
              >
                Fabricar
              </button>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}