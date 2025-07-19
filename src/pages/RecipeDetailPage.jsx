import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import PageContainer from '../components/PageContainer';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const recipeDoc = await getDoc(doc(db, 'recipes', id));
        if (recipeDoc.exists()) {
          setRecipe({ id: recipeDoc.id, ...recipeDoc.data() });
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !recipe) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl p-8">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-2xl font-bold mb-4">Recipe Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The recipe you are looking for does not exist.'}</p>
            <Link
              to="/recipes"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Back to Recipes
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Recipes
          </Link>
        </div>

        {/* Recipe Content */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Recipe Image */}
          <div className="h-64 sm:h-80 overflow-hidden">
            <img
              src={recipe.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe Details */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  {recipe.category || 'Uncategorized'}
                </span>
                <span>⏱️ {formatTime(recipe.cookTime)} cooking</span>
                <span>🕐 {formatTime(recipe.prepTime)} prep</span>
                <span>👥 {recipe.servings || 'N/A'} servings</span>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Ingredients</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-gray-700 font-medium">
                  {recipe.ingredients}
                </pre>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Instructions</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {recipe.instructions}
                </pre>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{formatTime(recipe.prepTime)}</div>
                  <div className="text-sm text-gray-600">Preparation Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{formatTime(recipe.cookTime)}</div>
                  <div className="text-sm text-gray-600">Cooking Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{recipe.servings || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Servings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default RecipeDetailPage; 