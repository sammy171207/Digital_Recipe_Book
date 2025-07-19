import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

const MealPlanPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [selectedDate, setSelectedDate] = useState('');
  const [userRecipes, setUserRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });
  const [existingMealPlans, setExistingMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch user's recipes
      const recipesSnap = await getDocs(
        query(collection(db, 'recipes'), where('userId', '==', user.uid))
      );
      const recipes = recipesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserRecipes(recipes);

      // Fetch existing meal plans
      const mealPlansSnap = await getDocs(
        query(
          collection(db, 'mealPlans'),
          where('userId', '==', user.uid)
          // Removed orderBy to avoid index error
          // orderBy('date', 'desc')
        )
      );
      const mealPlans = mealPlansSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExistingMealPlans(mealPlans);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's recipes and existing meal plans
  useEffect(() => {
    fetchData();
  }, [user]);

  // Refresh data when component comes into focus (when user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }
    if (!mealPlan.breakfast && !mealPlan.lunch && !mealPlan.dinner) {
      setError('Please select at least one meal');
      return;
    }

    try {
      await addDoc(collection(db, 'mealPlans'), {
        date: selectedDate,
        breakfast: mealPlan.breakfast,
        lunch: mealPlan.lunch,
        dinner: mealPlan.dinner,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setSuccess('Meal plan created successfully!');
      setMealPlan({ breakfast: '', lunch: '', dinner: '' });
      setSelectedDate('');

      // Refresh meal plans
      const mealPlansSnap = await getDocs(
        query(
          collection(db, 'mealPlans'),
          where('userId', '==', user.uid)
          // Removed orderBy to avoid index error
          // orderBy('date', 'desc')
        )
      );
      const updatedMealPlans = mealPlansSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExistingMealPlans(updatedMealPlans);
    } catch (err) {
      setError('Failed to create meal plan');
    }
  };

  const getRecipeName = (recipeId) => {
    const recipe = userRecipes.find(r => r.id === recipeId);
    return recipe ? recipe.title : 'Unknown Recipe';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Please log in to view meal plans.</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdf7f4] py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meal Planning</h1>

        {/* Create New Meal Plan */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Create New Meal Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-2">Breakfast</label>
                <select
                  value={mealPlan.breakfast}
                  onChange={(e) => setMealPlan({ ...mealPlan, breakfast: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="">Select breakfast</option>
                  {userRecipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Lunch</label>
                <select
                  value={mealPlan.lunch}
                  onChange={(e) => setMealPlan({ ...mealPlan, lunch: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="">Select lunch</option>
                  {userRecipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Dinner</label>
                <select
                  value={mealPlan.dinner}
                  onChange={(e) => setMealPlan({ ...mealPlan, dinner: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="">Select dinner</option>
                  {userRecipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {success && <div className="text-green-600 font-medium">{success}</div>}
            {error && <div className="text-red-600 font-medium">{error}</div>}

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Create Meal Plan
            </button>
          </form>
        </div>

        {/* Existing Meal Plans */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Meal Plans</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : existingMealPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No meal plans yet. Create your first one above!</div>
          ) : (
            <div className="space-y-4">
              {existingMealPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{formatDate(plan.date)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-orange-600">Breakfast:</span>
                      <p className="mt-1">{plan.breakfast ? getRecipeName(plan.breakfast) : 'Not planned'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-600">Lunch:</span>
                      <p className="mt-1">{plan.lunch ? getRecipeName(plan.lunch) : 'Not planned'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-600">Dinner:</span>
                      <p className="mt-1">{plan.dinner ? getRecipeName(plan.dinner) : 'Not planned'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanPage; 