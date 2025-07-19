import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  className = '',
  text = 'Loading...',
  showText = false
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-orange-500 ${sizes[size]}`}></div>
      {showText && text && (
        <span className="ml-2 text-gray-600">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner; 