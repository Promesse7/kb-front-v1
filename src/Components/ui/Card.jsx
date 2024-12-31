import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      {children}
    </div>
  );
};

export default Card;
