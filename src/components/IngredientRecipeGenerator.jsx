import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateRecipeFromIngredients, clearGeneratedRecipe } from '../feature/recipes/recipeSlice';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaMagic, FaBrain, FaClock, FaThermometerHalf, FaSave } from 'react-icons/fa';

const IngredientRecipeGenerator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { generatedRecipe, generatedRecipeLoading, generatedRecipeError } = useSelector(state => state.recipes);
  
  const [ingredients, setIngredients] = useState(['']);
  const [showGenerator, setShowGenerator] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleGenerateRecipe = async () => {
    const validIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    dispatch(generateRecipeFromIngredients(validIngredients));
  };

  const handleUseGeneratedRecipe = () => {
    if (generatedRecipe) {
      navigate('/add-recipe', {
        state: {
          prefillName: generatedRecipe.title,
          prefillCategory: 'Dinner', // Default category
          prefillIngredients: generatedRecipe.ingredients?.join(', ') || '',
          prefillInstructions: generatedRecipe.instructions?.join('\n') || '',
          prefillCookTime: generatedRecipe.cookingTime?.replace(/\D/g, '') || '',
          aiGenerated: true,
          generatedRecipe: generatedRecipe
        }
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'expert':
        return 'text-red-600 bg-red-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'beginner':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'expert':
        return '🔥';
      case 'intermediate':
        return '⚡';
      case 'beginner':
        return '🌱';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaBrain className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recipe Generator</h3>
        </div>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          {showGenerator ? 'Hide' : 'Show'} Generator
        </button>
      </div>

      {showGenerator && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the ingredients you have, and AI will generate a recipe for you!
          </p>

          {/* Ingredients Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Ingredients
            </label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., chicken, rice, tomatoes..."
                    className="flex-1 rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addIngredient}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                <FaPlus className="h-3 w-3" />
                <span>Add Ingredient</span>
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateRecipe}
            disabled={generatedRecipeLoading}
            className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {generatedRecipeLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Recipe...</span>
              </>
            ) : (
              <>
                <FaMagic className="h-4 w-4" />
                <span>Generate Recipe with AI</span>
              </>
            )}
          </button>

          {/* Error Display */}
          {generatedRecipeError && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
              {generatedRecipeError}
            </div>
          )}

          {/* Generated Recipe Display */}
          {generatedRecipe && (
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{generatedRecipe.title}</h4>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  AI Generated
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{generatedRecipe.description}</p>

              {/* Recipe Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {generatedRecipe.cookingTime && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FaClock className="h-4 w-4 text-gray-500" />
                    <span>{generatedRecipe.cookingTime}</span>
                  </div>
                )}
                {generatedRecipe.difficulty && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(generatedRecipe.difficulty)}`}>
                    <span>{getDifficultyIcon(generatedRecipe.difficulty)}</span>
                    <span>{generatedRecipe.difficulty}</span>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {generatedRecipe.ingredients && generatedRecipe.ingredients.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Ingredients:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {generatedRecipe.instructions && generatedRecipe.instructions.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h5>
                  <ol className="text-sm text-gray-600 space-y-2">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-orange-500 font-medium text-xs mt-1">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleUseGeneratedRecipe}
                  className="flex-1 flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <FaSave className="h-4 w-4" />
                  <span>Use This Recipe</span>
                </button>
                <button
                  onClick={() => dispatch(clearGeneratedRecipe())}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientRecipeGenerator; 