import React from 'react';

interface RoastMeterProps {
  roastLevel?: number; // 0-100 where 0 is lightest, 100 is darkest
  showLabels?: boolean;
}

export default function RoastMeter({ roastLevel = 50, showLabels = true }: RoastMeterProps) {
  // Ensure roast level is between 0-100 and is a valid number
  const validRoastLevel = 
    roastLevel === undefined || isNaN(Number(roastLevel)) 
    ? 50 // Default to medium roast if undefined or NaN
    : Number(roastLevel);
  
  const normalizedLevel = Math.max(0, Math.min(100, validRoastLevel));
  
  // Get the roast category based on the level
  const getRoastCategory = (level: number): string => {
    if (level < 25) return 'Light';
    if (level < 45) return 'Medium-Light';
    if (level < 60) return 'Medium';
    if (level < 80) return 'Medium-Dark';
    return 'Dark';
  };
  
  const roastCategory = getRoastCategory(normalizedLevel);
  
  return (
    <div className={showLabels ? "mt-4" : "mt-1"}>
      <div className="relative">
        {showLabels && (
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#333533]">LIGHT</span>
            <span className="text-xs text-[#333533]">DARK</span>
          </div>
        )}
        
        <div className={`${showLabels ? "h-1" : "h-[3px]"} w-full bg-gradient-to-r from-[#E8EDDF] to-[#242423] rounded-full`}>
          <div 
            className={`absolute ${showLabels ? "h-3 w-3 -mt-1" : "h-2 w-2 -mt-[3px]"} bg-[#F5CB5C] rounded-full transform -translate-x-1/2 border border-[#242423]`}
            style={{ 
              left: `${normalizedLevel}%`,
              transition: 'left 0.3s ease-out'
            }}
          />
        </div>
        
        {showLabels && (
          <div className="mt-1 flex justify-center">
            <span className="text-xs font-medium text-[#333533]">{roastCategory} Roast</span>
          </div>
        )}
      </div>
    </div>
  );
} 