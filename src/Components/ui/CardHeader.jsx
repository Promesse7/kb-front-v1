import React from 'react';

const CardHeader = ({ children }) => {
  return (
    <div className="bg-gray-100 p-4 border-b">
      {children}
    </div>
  );
};

export default CardHeader;
