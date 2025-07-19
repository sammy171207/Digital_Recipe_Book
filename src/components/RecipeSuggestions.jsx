import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeSuggestions } from '../feature/recipes/recipeSlice';
import { useNavigate } from 'react-router-dom';
import { FaLightbulb, FaClock, FaUtensils, FaStar, FaBrain, FaMagic, FaThermometerHalf } from 'react-icons/fa';

const RecipeSuggestions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suggestions, suggestionsLoading, suggestionsError } = useSelector(state => state.recipes);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchRecipeSuggestions());
    }
  }, [dispatch, user]);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'ai_generated') {
      // Navigate to add recipe page with AI-generated suggestion
      navigate('/add-recipe', { 
        state: { 
          prefillCategory: suggestion.category,
          suggestion: suggestion.title,
          aiGenerated: true,
          cookingTime: suggestion.cookingTime,
          difficulty: suggestion.difficulty,
          reasoning: suggestion.reasoning
        } 
      });
    } else if (suggestion.type === 'category') {
      // Navigate to add recipe page with category pre-filled
      navigate('/add-recipe', { 
        state: { 
          prefillCategory: suggestion.category,
          suggestion: suggestion.title 
        } 
      });
    } else if (suggestion.type === 'ingredient') {
      // Navigate to recipes page filtered by ingredient
      navigate('/recipes', { 
        state: { 
          searchTerm: suggestion.ingredient 
        } 
      });
    } else if (suggestion.type === 'seasonal') {
      // Navigate to add recipe page with seasonal suggestion
      navigate('/add-recipe', { 
        state: { 
          prefillCategory: suggestion.category,
          suggestion: suggestion.title 
        } 
      });
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'ai_generated':
        return <FaBrain className="text-orange-500" />;
      case 'category':
        return <FaUtensils className="text-orange-500" />;
      case 'ingredient':
        return <FaStar className="text-orange-500" />;
      case 'seasonal':
        return <FaLightbulb className="text-orange-500" />;
      case 'basic':
        return <FaMagic className="text-orange-500" />;
      default:
        return <FaLightbulb className="text-orange-500" />;
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

  const getSeasonalBadge = (seasonal) => {
    if (!seasonal) return null;
    
    const seasonalColors = {
      spring: 'bg-green-100 text-green-800',
      summer: 'bg-yellow-100 text-yellow-800',
      fall: 'bg-orange-100 text-orange-800',
      winter: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${seasonalColors[seasonal.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {seasonal.charAt(0).toUpperCase() + seasonal.slice(1)}
      </span>
    );
  };

  if (suggestionsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaBrain className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recipe Suggestions</h3>
        </div>
        <div className="flex items-center justify-center space-x-2 py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          <span className="text-gray-600">AI is thinking...</span>
        </div>
      </div>
    );
  }

  if (suggestionsError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaBrain className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recipe Suggestions</h3>
        </div>
        <div className="text-center text-red-600">
          <p>Unable to load AI suggestions</p>
          <button 
            onClick={() => dispatch(fetchRecipeSuggestions())}
            className="mt-2 text-orange-600 hover:text-orange-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaBrain className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">AI Recipe Suggestions</h3>
        </div>
        <div className="text-center text-gray-600">
          <FaBrain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No AI suggestions available yet</p>
          <p className="text-sm">Start adding recipes to get personalized AI recommendations!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FaBrain className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800">AI Recipe Suggestions</h3>
      </div>
      
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getSuggestionIcon(suggestion.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {suggestion.title}
                  </h4>
                  {suggestion.type === 'ai_generated' && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      AI
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {suggestion.description}
                </p>
                
                {/* AI-specific details */}
                {suggestion.type === 'ai_generated' && (
                  <div className="space-y-2 mb-3">
                    {suggestion.reasoning && (
                      <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        �� {suggestion.reasoning}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-3 text-xs">
                      {suggestion.cookingTime && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <FaClock className="h-3 w-3" />
                          <span>{suggestion.cookingTime}</span>
                        </div>
                      )}
                      
                      {suggestion.difficulty && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(suggestion.difficulty)}`}>
                          <span>{getDifficultyIcon(suggestion.difficulty)}</span>
                          <span>{suggestion.difficulty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {suggestion.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {suggestion.category}
                      </span>
                    )}
                    {suggestion.seasonal && getSeasonalBadge(suggestion.seasonal)}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {suggestion.confidence && (
                      <span className="text-xs font-medium text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% match
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {suggestions.some(s => s.type === 'ai_generated') 
            ? 'AI suggestions are personalized based on your recipe history and preferences'
            : 'Suggestions are based on your recipe history and seasonal trends'
          }
        </p>
      </div>
    </div>
  );
};

export default RecipeSuggestions; 