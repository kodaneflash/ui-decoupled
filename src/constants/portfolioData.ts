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

// Static Crypto Assets Data with realistic values for 100% fidelity
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
    balance: 1.5,
    amount: '150000000', // 1.5 BTC in satoshis
    fiatBalance: {
      value: 45234,
      unit: MOCK_CURRENCY_UNIT,
    },
    balanceFormatted: '1.5 BTC',
    fiatBalanceFormatted: '$45,234',
    icon: {
      backgroundColor: '#F7931A',
      symbol: '₿',
      color: '#FFFFFF',
    },
    change24h: 2500,
    changePercent24h: 19515, // 19515% as shown in reference
    countervalueChange: {
      value: 2500,
      percentage: 195.15, // 19515% / 100
    },
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    ticker: 'ETH',
    currency: {
      id: 'ethereum',
      ticker: 'ETH',
      name: 'Ethereum',
      color: '#627EEA',
      units: [{name: 'ethereum', code: 'ETH', magnitude: 18, symbol: 'Ξ'}],
    },
    balance: 2.8,
    amount: '2800000000000000000', // 2.8 ETH in wei
    fiatBalance: {
      value: 7892,
      unit: MOCK_CURRENCY_UNIT,
    },
    balanceFormatted: '2.8 ETH',
    fiatBalanceFormatted: '$7,892',
    icon: {
      backgroundColor: '#627EEA',
      symbol: 'Ξ',
      color: '#FFFFFF',
    },
    change24h: 450,
    changePercent24h: 1250,
    countervalueChange: {
      value: 450,
      percentage: 12.5,
    },
  },
  {
    id: 'tether',
    name: 'Tether USD',
    ticker: 'USDT',
    currency: {
      id: 'tether',
      ticker: 'USDT',
      name: 'Tether USD',
      color: '#26A17B',
      units: [{name: 'tether', code: 'USDT', magnitude: 6, symbol: '₮'}],
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT,
    },
    balanceFormatted: '0 USDT',
    fiatBalanceFormatted: '$0.00',
    icon: {
      backgroundColor: '#26A17B',
      symbol: '₮',
      color: '#FFFFFF',
    },
    change24h: 0,
    changePercent24h: 0,
  },
  {
    id: 'xrp',
    name: 'XRP',
    ticker: 'XRP',
    currency: {
      id: 'xrp',
      ticker: 'XRP',
      name: 'XRP',
      color: '#0085C3',
      units: [{name: 'xrp', code: 'XRP', magnitude: 6, symbol: '✕'}],
    },
    balance: 1250,
    amount: '1250000000', // 1250 XRP
    fiatBalance: {
      value: 875,
      unit: MOCK_CURRENCY_UNIT,
    },
    balanceFormatted: '1,250 XRP',
    fiatBalanceFormatted: '$875',
    icon: {
      backgroundColor: '#0085C3',
      symbol: '✕',
      color: '#FFFFFF',
    },
    change24h: 75,
    changePercent24h: 285, // 285% as shown in reference
    countervalueChange: {
      value: 75,
      percentage: 2.85,
    },
  },
  {
    id: 'bnb',
    name: 'Binance Smart Chain',
    ticker: 'BNB',
    currency: {
      id: 'bnb',
      ticker: 'BNB',
      name: 'Binance Smart Chain',
      color: '#F3BA2F',
      units: [{name: 'bnb', code: 'BNB', magnitude: 18, symbol: '◆'}],
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT,
    },
    balanceFormatted: '0 BNB',
    fiatBalanceFormatted: '$0.00',
    icon: {
      backgroundColor: '#F3BA2F',
      symbol: '◆',
      color: '#000000', // Black symbol for better contrast on yellow
    },
    change24h: 0,
    changePercent24h: 0,
  },
];

// Static Tab Data
export const TAB_DATA = {
  activeTab: 'Assets' as const,
  tabs: [
    {id: 'Assets', label: 'Crypto', count: CRYPTO_ASSETS.length},
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
