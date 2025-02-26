import React from 'react';

const background = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 text-white p-6">
      {children}
    </div>
  );
};

export default background;
