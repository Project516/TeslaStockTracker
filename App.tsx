import React, { useState, useEffect } from 'react';
import { fetchTeslaStockData } from './services/geminiService';
import { StockData, AppState } from './types';
import MoodIndicator from './components/MoodIndicator';
import StockCard from './components/StockCard';
import { RefreshCw, TrendingDown } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const stockData = await fetchTeslaStockData();
      setData(stockData);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch stock data. Please check your API key or try again later.");
      setAppState(AppState.ERROR);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-200">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">TSLA Short Tracker</h1>
          </div>
          <button 
            onClick={loadData}
            disabled={appState === AppState.LOADING}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${appState === AppState.LOADING ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {appState === AppState.LOADING && !data && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 animate-pulse">Analyzing market sentiment with Gemini...</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-red-800 font-bold mb-2">Data Unavailable</h3>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <button 
              onClick={loadData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {(appState === AppState.SUCCESS || (appState === AppState.LOADING && data)) && data && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column: The Mood */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex items-center justify-center">
              <MoodIndicator data={data} />
            </div>

            {/* Right Column: The Data */}
            <div className="flex flex-col h-full justify-center">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wide mb-1">Concept</h3>
                <p className="text-blue-800 text-sm">
                  This app simulates a <strong>Short Seller's</strong> emotional state. 
                  They are happy when the stock drops and sad when it rises.
                </p>
              </div>
              <StockCard data={data} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>Powered by Gemini API &bull; Google Search Grounding</p>
      </footer>
    </div>
  );
};

export default App;