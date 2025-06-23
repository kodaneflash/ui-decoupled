// Static Portfolio Data with realistic values
export const PORTFOLIO_DATA = {
  totalBalance: 45000, // Main portfolio balance shown in 42px font
  totalFiatBalance: {
    value: 53941,
    unit: {code: 'USD', symbol: '$', magnitude: 2},
  },
  countervalueChange: {
    value: 5000, // Dollar amount change (+$5000)
    percentage: 3.7703, // 37703% display (multiply by 100 in Delta component)
  },
  balanceHistory: [
    { date: new Date('2024-01-01'), value: 40000 },
    { date: new Date('2024-01-02'), value: 41500 },
    { date: new Date('2024-01-03'), value: 43000 },
    { date: new Date('2024-01-04'), value: 44200 },
    { date: new Date('2024-01-05'), value: 45000 }, // Current balance
  ],
  range: '1w',
  balanceAvailable: true,
  // Chart data points for SVG path
  chartData: [
    {x: 0, y: 50},
    {x: 1, y: 52},
    {x: 2, y: 48},
    {x: 3, y: 55},
    {x: 4, y: 49},
    {x: 5, y: 53},
    {x: 6, y: 50},
  ],
};

// Mock Currency Unit (USD)
export const MOCK_CURRENCY_UNIT = {
  code: 'USD',
  symbol: '$',
  magnitude: 2,
  name: 'US Dollar',
};

// Dynamic Crypto Assets Data - Only BTC and SOL with live pricing
export const CRYPTO_ASSETS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    ticker: 'BTC',
    currency: {
      id: 'bitcoin',
      ticker: 'BTC',
      name: 'Bitcoin',
      color: '#F7931A',
      units: [{name: 'bitcoin', code: 'BTC', magnitude: 8, symbol: '₿'}],
    },
    // Crypto amount in smallest units (satoshis for BTC)
    balance: 1.5, // Display balance (1.5 BTC)
    amount: '150000000', // 1.5 BTC in satoshis (150,000,000 sats)
    icon: {
      backgroundColor: '#F7931A',
      symbol: '₿',
      color: '#FFFFFF',
    },
    // Fiat values will be calculated dynamically - no hardcoded values
  },
  {
    id: 'solana',
    name: 'Solana',
    ticker: 'SOL',
    currency: {
      id: 'solana',
      ticker: 'SOL',
      name: 'Solana',
      color: '#9945FF',
      units: [{name: 'solana', code: 'SOL', magnitude: 9, symbol: '◎'}],
    },
    // Crypto amount in smallest units (lamports for SOL)
    balance: 3.2, // Display balance (3.2 SOL)
    amount: '3200000000', // 3.2 SOL in lamports (3,200,000,000 lamports)
    icon: {
      backgroundColor: '#9945FF',
      symbol: '◎',
      color: '#FFFFFF',
    },
    // Fiat values will be calculated dynamically - no hardcoded values
  },
];

// Static Tab Data
export const TAB_DATA = {
  activeTab: 'Assets' as const,
  tabs: [
    {id: 'Assets', label: 'Crypto', count: CRYPTO_ASSETS.length}, // Now shows 2 (BTC + SOL)
    {id: 'NFTs', label: 'NFTs', count: 0},
    {id: 'Market', label: 'Market', count: 0},
  ],
};

// Static Graph Time Range Data
export const GRAPH_TIME_RANGES = [
  {label: '1D', value: '1d', active: false, key: '1d'},
  {label: '1W', value: '1w', active: true, key: '1w'}, // Default active
  {label: '1M', value: '1m', active: false, key: '1m'},
  {label: '1Y', value: '1y', active: false, key: '1y'},
  {label: 'ALL', value: 'all', active: false, key: 'all'},
];

// Note: Complex mock hooks removed - not needed for simple static UI replica

// Simple types for static UI replica - only what's actually used
export interface SimplePortfolioData {
  totalBalance: number;
  countervalueChange: {
    value: number;
    percentage: number;
  };
  balanceHistory: Array<{
    date: Date;
    value: number;
  }>;
}
