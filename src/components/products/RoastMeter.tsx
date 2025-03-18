
import React from 'react';

interface RoastMeterProps {
  roastLevel: number; // 0-100 where 0 is lightest, 100 is darkest
  showLabels?: boolean;
}

export default function RoastMeter({ roastLevel, showLabels = true }: RoastMeterProps) {
  // Ensure roast level is between 0-100
  const normalizedLevel = Math.max(0, Math.min(100, roastLevel));
  
  return (
    <div className="mt-8">
      
      <div className="relative">
        {showLabels && (
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#333533]">LIGHT</span>
            <span className="text-xs text-[#333533]">DARK</span>
          </div>
        )}
        
        <div className="h-1 w-full bg-gradient-to-r from-[#E8EDDF] to-[#242423] rounded-full">
          <div 
            className="absolute h-3 w-3 bg-[#F5CB5C] rounded-full -mt-1 transform -translate-x-1/2 border border-[#242423]" 
            style={{ 
              left: `${normalizedLevel}%`,
              transition: 'left 0.3s ease-out'
            }}
          />
        </div>
      </div>
    </div>
  );
} 