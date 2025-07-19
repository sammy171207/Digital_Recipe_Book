import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({
  recipe,
  showLink = true,
  className = '',
  ...props
}) => {
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const cardContent = (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" {...props}>
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
  );

  if (showLink) {
    return (
      <Link to={`/recipe/${recipe.id}`} className={className}>
        {cardContent}
      </Link>
    );
  }

  return <div className={className}>{cardContent}</div>;
};

export default RecipeCard; 