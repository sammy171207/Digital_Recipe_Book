import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { PageContainer, Button, RecipeCard, LoadingSpinner, EmptyState, Card } from '../components';
import RecipeSuggestions from '../components/RecipeSuggestions';

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ recipes: 0, mealPlans: 0, groceryLists: 0 });
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatsAndRecipes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch stats
      const [recipesSnap, mealPlansSnap, groceryListsSnap] = await Promise.all([
        getDocs(query(collection(db, 'recipes'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'mealPlans'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'groceryLists'), where('userId', '==', user.uid))),
      ]);
      setStats({
        recipes: recipesSnap.size,
        mealPlans: mealPlansSnap.size,
        groceryLists: groceryListsSnap.size,
      });
      // Fetch 3 most recent recipes for this user
      const popularSnap = await getDocs(
        query(
          collection(db, 'recipes'),
          where('userId', '==', user.uid),
          limit(3)
        )
      );
      const recipes = popularSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched recipes:', recipes);
      setPopularRecipes(recipes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndRecipes();
  }, [user]);

  // Refresh data when component comes into focus (when user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      fetchStatsAndRecipes();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  if (!user) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center text-xl">
          Please log in to view your dashboard.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Welcome Header */}
          <h1 className="text-3xl sm:text-4xl font-semibold mb-8">
            Welcome back, <span className="font-bold">{user.displayName || user.email}</span>
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Card className="flex flex-col items-start">
              <span className="text-md text-[#7c6f65] mb-2">Recipes</span>
              <span className="text-2xl font-bold text-[#1a1816]">
                {loading ? <LoadingSpinner size="sm" /> : stats.recipes}
              </span>
            </Card>
            <Card className="flex flex-col items-start">
              <span className="text-md text-[#7c6f65] mb-2">Meal Plans</span>
              <span className="text-2xl font-bold text-[#1a1816]">
                {loading ? <LoadingSpinner size="sm" /> : stats.mealPlans}
              </span>
            </Card>
            <Card className="flex flex-col items-start">
              <span className="text-md text-[#7c6f65] mb-2">Grocery Lists</span>
              <span className="text-2xl font-bold text-[#1a1816]">
                {loading ? <LoadingSpinner size="sm" /> : stats.groceryLists}
              </span>
            </Card>
          </div>

          {/* Popular Recipes */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Recipes</h2>
            {popularRecipes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-recipes')}
              >
                View All
              </Button>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-xl h-56 animate-pulse" />
              <div className="bg-white rounded-xl h-56 animate-pulse" />
              <div className="bg-white rounded-xl h-56 animate-pulse" />
            </div>
          ) : popularRecipes.length === 0 ? (
            <EmptyState
              icon="🍳"
              title="No recipes yet"
              description="Start by adding your first recipe to see it here."
              actionText="Add Your First Recipe"
              actionLink="/add-recipe"
              className="mb-10"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {popularRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {/* Quick Access */}
          <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/add-recipe')}
              className="flex items-center gap-2"
            >
              <span className="text-2xl font-bold">+</span> Add New Recipe
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/my-recipes')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg> View All Recipes
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/meal-plan')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg> Plan Your Week
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/add-grocery')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg> New Grocery List
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/grocery-lists')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg> View Grocery Lists
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/recipes')}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg> Discover Recipes
            </Button>
          </div>
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <RecipeSuggestions />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;