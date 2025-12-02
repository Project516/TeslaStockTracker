import React from 'react';
import { StockData } from '../types';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface StockCardProps {
  data: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ data }) => {
  const isUp = data.direction === 'UP';
  const isDown = data.direction === 'DOWN';

  // Standard market colors (Green = Up, Red = Down)
  // Note: This contrasts with the "Mood" which is inverted.
  const textColor = isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-600';
  const bgBorder = isUp ? 'border-green-200 bg-green-50' : isDown ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50';

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className={`rounded-xl border-2 p-6 shadow-lg transition-colors duration-300 ${bgBorder}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Tesla, Inc. (TSLA)</h3>
            <p className="text-xs text-gray-500">Real-time Data via Google Search</p>
          </div>
          <div className={`p-2 rounded-full ${isUp ? 'bg-green-100' : isDown ? 'bg-red-100' : 'bg-gray-100'}`}>
            {isUp ? <ArrowUp className="w-6 h-6 text-green-600" /> : isDown ? <ArrowDown className="w-6 h-6 text-red-600" /> : <div className="w-6 h-6" />}
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl font-black text-slate-800 mb-2">{data.price}</div>
          <div className={`flex items-center justify-center gap-2 text-xl font-bold ${textColor}`}>
            <span>{data.changeAmount}</span>
            <span>({data.changePercent})</span>
          </div>
        </div>

        <div className="border-t border-black/10 pt-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.rawSummary}
          </p>
        </div>
      </div>

      {/* Sources Section */}
      {data.groundingSources.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">Sources</h4>
          <div className="flex flex-wrap gap-2">
            {data.groundingSources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="truncate max-w-[150px]">{source.title}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;