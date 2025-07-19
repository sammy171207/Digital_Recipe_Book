import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const ViewAllRecipesPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  const categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snack',
    'Beverage',
  ];

  const fetchRecipes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const recipesSnap = await getDocs(
        query(
          collection(db, 'recipes'),
          where('userId', '==', user.uid)
        )
      );
      const recipesData = recipesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipesData);
      setFilteredRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  // Refresh data when component comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchRecipes();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  // Filter recipes based on search term and category
  useEffect(() => {
    let filtered = recipes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, selectedCategory, recipes]);

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Please log in to view your recipes.</div>;
  }

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Recipes</h1>
            <p className="text-gray-600">Your personal recipe collection</p>
          </div>
          <Link
            to="/add-recipe"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            + Add New Recipe
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Search Recipes</label>
              <input
                type="text"
                placeholder="Search by name or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm || selectedCategory ? 'No recipes found' : 'No recipes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first recipe!'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Link
                to="/add-recipe"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition"
              >
                Create Your First Recipe
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        {recipe.category || 'Uncategorized'}
                      </span>
                      <span>⏱️ {formatTime(recipe.cookTime)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👥 {recipe.servings || 'N/A'} servings</span>
                      <span>🕐 {formatTime(recipe.prepTime)} prep</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {recipe.ingredients?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default ViewAllRecipesPage; 