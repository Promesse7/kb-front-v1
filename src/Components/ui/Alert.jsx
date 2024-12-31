import React from 'react';
import AlertDescription from './AlertDescription'; // Ensure this import is correct

const Alert = ({ children, type = 'info' }) => {
  const alertTypeClass = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  }[type];

  return (
    <div className={`border-l-4 p-4 ${alertTypeClass}`}>
      <AlertDescription>{children}</AlertDescription>
    </div>
  );
};

export default Alert;
