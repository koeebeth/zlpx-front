import React, { useState } from 'react';
import { DebugModal } from './DebugModal';

export const DebugButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDebugClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleDebugClick}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg z-50"
        style={{ fontSize: '12px' }}
      >
        🐛 Debug
      </button>
      
      <DebugModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}; 