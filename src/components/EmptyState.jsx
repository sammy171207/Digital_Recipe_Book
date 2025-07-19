import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '🍳',
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionText = '',
  actionLink = '',
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState; 