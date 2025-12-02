export interface StockData {
  price: string;
  changeAmount: string;
  changePercent: string;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  rawSummary: string;
  groundingSources: Array<{
    title: string;
    url: string;
  }>;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}