import React from 'react';
import { StockData } from '../types';

interface MoodIndicatorProps {
  data: StockData;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({ data }) => {
  const { direction } = data;
  
  // Logic: Happy when DOWN, Sad when UP (Short Seller Persona)
  const isHappy = direction === 'DOWN';
  const isNeutral = direction === 'NEUTRAL';

  if (isNeutral) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-float">
        <div className="text-9xl mb-4">😐</div>
        <h2 className="text-2xl font-bold text-gray-500">Waiting for market moves...</h2>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 transition-all duration-500 ${isHappy ? 'animate-float' : 'animate-pulse'}`}>
      <div className="relative">
        <div className="text-9xl mb-4 transform transition-transform duration-500 hover:scale-110 cursor-default">
          {isHappy ? '🤑' : '😭'}
        </div>
        {/* Decorative elements */}
        {isHappy && (
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce delay-100">
            💸
          </div>
        )}
        {!isHappy && (
          <div className="absolute top-1/2 -left-8 text-4xl animate-pulse">
             📉
          </div>
        )}
      </div>
      
      <h2 className={`text-4xl font-extrabold mt-4 text-center ${isHappy ? 'text-green-600' : 'text-red-500'}`}>
        {isHappy ? "IT'S CRASHING! YES!" : "OH NO, IT'S GOING UP!"}
      </h2>
      <p className="text-gray-500 mt-2 font-medium italic">
        (Short Seller Perspective)
      </p>
    </div>
  );
};

export default MoodIndicator;