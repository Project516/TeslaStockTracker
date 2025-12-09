import { GoogleGenAI } from "@google/genai";
import { StockData } from '../types';

// Initialize the Google GenAI client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchTeslaStockData = async (): Promise<StockData> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Perform a Google Search for the current real-time stock price of Tesla (TSLA).
      
      I need you to extract specific details and format the first part of your response strictly.
      
      Format your response as follows:
      Line 1: DIRECTION: <UP or DOWN or NEUTRAL>
      Line 2: PRICE: <Current Price with currency symbol>
      Line 3: CHANGE: <Change amount with currency symbol>
      Line 4: PERCENT: <Percentage change with %>
      
      After these 4 lines, provide a brief 1-sentence natural language summary of the market status.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be JSON when using googleSearch, so we parse text manually
      },
    });

    const text = response.text || "";
    const lines = text.split('\n');
    
    // Default values
    let direction: 'UP' | 'DOWN' | 'NEUTRAL' = 'NEUTRAL';
    let price = '---';
    let changeAmount = '---';
    let changePercent = '---';
    let summaryStartIndex = 0;

    // Simple parsing logic based on the requested format
    lines.forEach((line, index) => {
      const upperLine = line.toUpperCase().trim();
      if (upperLine.startsWith('DIRECTION:')) {
        const dir = upperLine.replace('DIRECTION:', '').trim();
        if (dir.includes('UP')) direction = 'UP';
        else if (dir.includes('DOWN')) direction = 'DOWN';
      } else if (upperLine.startsWith('PRICE:')) {
        price = line.replace(/PRICE:/i, '').trim();
      } else if (upperLine.startsWith('CHANGE:')) {
        changeAmount = line.replace(/CHANGE:/i, '').trim();
      } else if (upperLine.startsWith('PERCENT:')) {
        changePercent = line.replace(/PERCENT:/i, '').trim();
        summaryStartIndex = index + 1; // Content after this is likely summary
      }
    });

    // Fallback parsing if strict format fails (Gemini sometimes chats anyway)
    if (direction === 'NEUTRAL') {
      if (text.toLowerCase().includes('up') && !text.toLowerCase().includes('down')) direction = 'UP';
      if (text.toLowerCase().includes('down') && !text.toLowerCase().includes('up')) direction = 'DOWN';
      // Basic heuristic for price if missing
      if (price === '---') {
        const priceMatch = text.match(/\$\d{1,4}\.\d{2}/);
        if (priceMatch) price = priceMatch[0];
      }
    }

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        title: chunk.web!.title!,
        url: chunk.web!.uri!
      }));

    // Reconstruct raw summary from text if lines were split
    const rawSummary = lines.slice(summaryStartIndex).join(' ').trim() || text;

    return {
      direction,
      price,
      changeAmount,
      changePercent,
      rawSummary,
      groundingSources: sources
    };

  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};