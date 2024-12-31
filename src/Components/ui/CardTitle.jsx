import React from 'react';

const CardTitle = ({ children }) => {
  return (
    <h2 className="text-lg font-semibold">
      {children}
    </h2>
  );
};

export default CardTitle;
