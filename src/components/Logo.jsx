import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Logo({ width = '100px', showIcon = true }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/')}
      className="flex items-center space-x-2 cursor-pointerAlphx2243 group transition-transform duration-200 hover:scale-105"
      style={{ width }}
    >
      {showIcon && (
        <Stethoscope 
          className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" 
        />
      )}
      <div className="flex flex-col">
        <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          ResQMed
        </h3>
        <span className="text-xs text-gray-500 font-medium tracking-wider">
          EMERGENCY CARE
        </span>
      </div>
    </div>
  );
}

export default Logo;