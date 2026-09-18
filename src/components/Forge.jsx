import { useState } from 'react'
import BottomSheet from './BottomSheet'
import './Forge.css'

// dados de teste: cada receita converte X minérios em 1 barra
const INITIAL_RECIPES = [
  { id: 'iron', name: 'Barra de Ferro', oreName: 'Minério de Ferro', oreCost: 5, oreOwned: 12 },
  { id: 'copper', name: 'Barra de Cobre', oreName: 'Minério de Cobre', oreCost: 5, oreOwned: 3 },
  { id: 'gold', name: 'Barra de Ouro', oreName: 'Minério de Ouro', oreCost: 8, oreOwned: 0 },
]

export default function Forge({ isOpen, onClose }) {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES)

  function handleForge(recipeId) {
    setRecipes((current) =>
      current.map((recipe) =>
        recipe.id === recipeId && recipe.oreOwned >= recipe.oreCost
          ? { ...recipe, oreOwned: recipe.oreOwned - recipe.oreCost }
          : recipe
      )
    )
    // aqui depois entra a lógica real de adicionar a barra no inventário
    console.log('Forjou:', recipeId)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Forja">
      <div className="forge-list">
        {recipes.map((recipe) => {
          const canForge = recipe.oreOwned >= recipe.oreCost
          return (
            <div key={recipe.id} className="forge-item">
              <div className="forge-item-icon" />
              <div className="forge-item-info">
                <span className="forge-item-name">{recipe.name}</span>
                <span className={`forge-item-cost ${canForge ? '' : 'is-insufficient'}`}>
                  {recipe.oreName}: {recipe.oreOwned}/{recipe.oreCost}
                </span>
              </div>
              <button
                className="forge-item-button"
                disabled={!canForge}
                onClick={() => handleForge(recipe.id)}
              >
                Forjar
              </button>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}