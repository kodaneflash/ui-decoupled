// Static Portfolio Data matching reference image ($0.00 balance)
export const PORTFOLIO_DATA = {
  totalBalance: 0,
  totalFiatBalance: {
    value: 0,
    unit: { code: "USD", symbol: "$", magnitude: 2 }
  },
  countervalueChange: {
    value: 0,
    percentage: 0
  },
  balanceHistory: [
    { date: new Date("2024-01-01"), value: 0 },
    { date: new Date("2024-01-02"), value: 0 },
    { date: new Date("2024-01-03"), value: 0 },
    { date: new Date("2024-01-04"), value: 0 },
    { date: new Date("2024-01-05"), value: 0 },
    { date: new Date("2024-01-06"), value: 0 },
    { date: new Date("2024-01-07"), value: 0 },
  ],
  // Chart data points for SVG path
  chartData: [
    { x: 0, y: 50 },
    { x: 1, y: 52 },
    { x: 2, y: 48 },
    { x: 3, y: 55 },
    { x: 4, y: 49 },
    { x: 5, y: 53 },
    { x: 6, y: 50 },
  ]
};

// Mock Currency Unit (USD)
export const MOCK_CURRENCY_UNIT = {
  code: "USD",
  symbol: "$",
  magnitude: 2,
  name: "US Dollar"
};

// Static Crypto Assets Data matching reference image (all showing 0 balances)
export const CRYPTO_ASSETS = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    currency: {
      id: "bitcoin",
      ticker: "BTC",
      name: "Bitcoin",
      color: "#F7931A",
      units: [
        { name: "bitcoin", code: "BTC", magnitude: 8, symbol: "₿" }
      ]
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT
    },
    balanceFormatted: "0 BTC",
    fiatBalanceFormatted: "$0.00",
    icon: {
      backgroundColor: "#F7931A",
      symbol: "₿",
      color: "#FFFFFF"
    },
    change24h: 0,
    changePercent24h: 0
  },
  {
    id: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    currency: {
      id: "ethereum",
      ticker: "ETH",
      name: "Ethereum",
      color: "#627EEA",
      units: [
        { name: "ethereum", code: "ETH", magnitude: 18, symbol: "Ξ" }
      ]
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT
    },
    balanceFormatted: "0 ETH",
    fiatBalanceFormatted: "$0.00",
    icon: {
      backgroundColor: "#627EEA",
      symbol: "Ξ",
      color: "#FFFFFF"
    },
    change24h: 0,
    changePercent24h: 0
  },
  {
    id: "tether",
    name: "Tether USD",
    ticker: "USDT",
    currency: {
      id: "tether",
      ticker: "USDT", 
      name: "Tether USD",
      color: "#26A17B",
      units: [
        { name: "tether", code: "USDT", magnitude: 6, symbol: "₮" }
      ]
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT
    },
    balanceFormatted: "0 USDT",
    fiatBalanceFormatted: "$0.00",
    icon: {
      backgroundColor: "#26A17B",
      symbol: "₮",
      color: "#FFFFFF"
    },
    change24h: 0,
    changePercent24h: 0
  },
  {
    id: "xrp",
    name: "XRP",
    ticker: "XRP",
    currency: {
      id: "xrp",
      ticker: "XRP",
      name: "XRP",
      color: "#0085C3",
      units: [
        { name: "xrp", code: "XRP", magnitude: 6, symbol: "✕" }
      ]
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT
    },
    balanceFormatted: "0 XRP",
    fiatBalanceFormatted: "$0.00",
    icon: {
      backgroundColor: "#0085C3",
      symbol: "✕",
      color: "#FFFFFF"
    },
    change24h: 0,
    changePercent24h: 0
  },
  {
    id: "bnb",
    name: "Binance Smart Chain",
    ticker: "BNB",
    currency: {
      id: "bnb",
      ticker: "BNB",
      name: "Binance Smart Chain",
      color: "#F3BA2F",
      units: [
        { name: "bnb", code: "BNB", magnitude: 18, symbol: "◆" }
      ]
    },
    balance: 0,
    fiatBalance: {
      value: 0,
      unit: MOCK_CURRENCY_UNIT
    },
    balanceFormatted: "0 BNB",
    fiatBalanceFormatted: "$0.00",
    icon: {
      backgroundColor: "#F3BA2F",
      symbol: "◆",
      color: "#000000" // Black symbol for better contrast on yellow
    },
    change24h: 0,
    changePercent24h: 0
  }
];

// Static Tab Data
export const TAB_DATA = {
  activeTab: "Assets" as const,
  tabs: [
    { id: "Assets", label: "Crypto", count: CRYPTO_ASSETS.length },
    { id: "NFTs", label: "NFTs", count: 0 },
    { id: "Market", label: "Market", count: 0 }
  ]
};

// Static Graph Time Range Data
export const GRAPH_TIME_RANGES = [
  { label: "1D", value: "1d", active: false },
  { label: "1W", value: "1w", active: true }, // Default active
  { label: "1M", value: "1m", active: false },
  { label: "1Y", value: "1y", active: false },
  { label: "ALL", value: "all", active: false }
];

// Mock hooks for static portfolio data
export const usePortfolioMock = () => ({
  portfolio: PORTFOLIO_DATA,
  counterValueCurrency: MOCK_CURRENCY_UNIT,
  loading: false,
  error: null
});

export const useAccountsMock = () => ({
  accounts: CRYPTO_ASSETS,
  loading: false,
  error: null
});

// TypeScript interfaces for the static data
export interface MockPortfolioData {
  totalBalance: number;
  totalFiatBalance: {
    value: number;
    unit: {
      code: string;
      symbol: string;
      magnitude: number;
    };
  };
  countervalueChange: {
    value: number;
    percentage: number;
  };
  balanceHistory: Array<{
    date: Date;
    value: number;
  }>;
  chartData: Array<{
    x: number;
    y: number;
  }>;
}

export interface MockCryptoAsset {
  id: string;
  name: string;
  ticker: string;
  currency: {
    id: string;
    ticker: string;
    name: string;
    color: string;
    units: Array<{
      name: string;
      code: string;
      magnitude: number;
      symbol: string;
    }>;
  };
  balance: number;
  fiatBalance: {
    value: number;
    unit: {
      code: string;
      symbol: string;
      magnitude: number;
      name: string;
    };
  };
  balanceFormatted: string;
  fiatBalanceFormatted: string;
  icon: {
    backgroundColor: string;
    symbol: string;
    color: string;
  };
  change24h: number;
  changePercent24h: number;
} 