import React from 'react';

const PageContainer = ({
  children,
  className = '',
  maxWidth = 'max-w-6xl',
  padding = 'py-10 px-4 sm:px-8',
  background = 'bg-gradient-to-br from-orange-50 to-red-50',
  ...props
}) => {
  return (
    <div className={`min-h-screen ${background} ${padding}`} {...props}>
      <div className={`${maxWidth} mx-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 