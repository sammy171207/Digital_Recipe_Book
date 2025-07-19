import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-sm',
  rounded = 'rounded-xl',
  background = 'bg-white',
  hover = false,
  ...props
}) => {
  const cardClasses = `${background} ${rounded} ${shadow} ${padding} ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card; 