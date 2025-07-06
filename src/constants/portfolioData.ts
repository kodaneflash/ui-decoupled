import { BigNumber } from 'bignumber.js';
import HistoricalPortfolioService from '../services/HistoricalPortfolioService';

// Static Portfolio Data with realistic values and enhanced historical data for timeframes
export const PORTFOLIO_DATA = {
  totalBalance: 9500000, // Main portfolio balance shown in 42px font
  totalFiatBalance: {
    value: 9800000,
    unit: {code: 'USD', symbol: '$', magnitude: 2},
  },
  countervalueChange: {
    value: 280000, // Dollar amount change (+$280,000)
    percentage: 0.037703, // Decimal format (3.7703%)
  },
  balanceHistory: [
    { date: new Date('2024-01-01'), value: 8400000 },
    { date: new Date('2024-01-02'), value: 8750000 },
    { date: new Date('2024-01-03'), value: 9100000 },
    { date: new Date('2024-01-04'), value: 9350000 },
    { date: new Date('2024-01-05'), value: 9500000 }, // Current balance
  ],
  range: '1w',
  balanceAvailable: true,
};

// Enhanced Historical Balance Data for Different Timeframes - REALISTIC MARKET BEHAVIOR
export const HISTORICAL_BALANCES = {
  bitcoin: {
    '1d': Array.from({ length: 24 }, (_, i) => {
      // Bitcoin: More volatile intraday with realistic $97,000 base price
      const basePrice = 97000;
      const trend = Math.sin(i * 0.2) * 1500; // Gentle trend
      const volatility = (Math.random() - 0.5) * 800; // ±$400 random moves
      const momentum = i * 10; // Slight momentum
      const btcPrice = basePrice + trend + volatility + momentum;
      return {
        date: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        cryptoAmount: 83.5206,
        fiatValue: btcPrice * 83.5206,
      };
    }),
    '1w': Array.from({ length: 168 }, (_, i) => {
      const basePrice = 95000; // Lower starting point for 1W
      const weeklyTrend = Math.sin(i * 0.05) * 3000; // Larger weekly swings
      const dailyPattern = Math.sin(i * 0.3) * 800; // Daily patterns
      const randomWalk = (Math.random() - 0.5) * 600;
      const growth = i * 15; // Weekly growth trend
      const btcPrice = basePrice + weeklyTrend + dailyPattern + randomWalk + growth;
      return {
        date: new Date(Date.now() - (167 - i) * 60 * 60 * 1000),
        cryptoAmount: 83.5206,
        fiatValue: btcPrice * 83.5206,
      };
    }),
    '1m': Array.from({ length: 30 }, (_, i) => {
      const basePrice = 85000; // Lower starting point for 1M
      const monthlyTrendUp = i * 400; // Strong upward trend over month
      const cyclical = Math.sin(i * 0.4) * 4000; // Larger swings
      const volatility = (Math.random() - 0.5) * 1200;
      const btcPrice = basePrice + monthlyTrendUp + cyclical + volatility;
      return {
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        cryptoAmount: 83.5206,
        fiatValue: btcPrice * 83.5206,
      };
    }),
    '1y': Array.from({ length: 365 }, (_, i) => {
      const basePrice = 35000; // Much lower starting point for 1Y
      const yearlyBull = i * 170; // Strong bull market over year (365 days)
      const seasonality = Math.sin(i * 0.017) * 8000; // Seasonal patterns (daily intervals)
      const volatility = (Math.random() - 0.5) * 2000;
      const corrections = i > 200 ? Math.sin((i - 200) * 0.03) * -3000 : 0; // Mid-year correction
      const btcPrice = Math.max(20000, basePrice + yearlyBull + seasonality + volatility + corrections);
      return {
        date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000), // Daily intervals
        cryptoAmount: 83.5206,
        fiatValue: btcPrice * 83.5206,
      };
    }),
    'all': Array.from({ length: 104 }, (_, i) => {
      const basePrice = 8000; // Very low starting point for ALL
      const megaTrend = i * 800; // Massive growth over 2 years
      const cycles = Math.sin(i * 0.08) * 15000; // Multi-year cycles
      const volatility = (Math.random() - 0.5) * 3000;
      const bearPhases = i > 60 && i < 80 ? -8000 : 0; // Bear market phase
      const btcPrice = Math.max(5000, basePrice + megaTrend + cycles + volatility + bearPhases);
      return {
        date: new Date(Date.now() - (103 - i) * 7 * 24 * 60 * 60 * 1000),
        cryptoAmount: 83.5206,
        fiatValue: btcPrice * 83.5206,
      };
    }),
  },
  solana: {
    '1d': Array.from({ length: 24 }, (_, i) => {
      // Solana: Higher volatility, ~$240 base price
      const basePrice = 240;
      const intraday = Math.sin(i * 0.35) * 15; // Quick movements
      const volatility = (Math.random() - 0.5) * 8;
      const momentum = i * 0.3;
      const solPrice = basePrice + intraday + volatility + momentum;
      return {
        date: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        cryptoAmount: 6247.57,
        fiatValue: solPrice * 6247.57,
      };
    }),
    '1w': Array.from({ length: 168 }, (_, i) => {
      const basePrice = 220;
      const weeklyTrend = Math.sin(i * 0.07) * 25;
      const dailyNoise = Math.sin(i * 0.4) * 8;
      const randomWalk = (Math.random() - 0.5) * 5;
      const growth = i * 0.12;
      const solPrice = basePrice + weeklyTrend + dailyNoise + randomWalk + growth;
      return {
        date: new Date(Date.now() - (167 - i) * 60 * 60 * 1000),
        cryptoAmount: 6247.57,
        fiatValue: solPrice * 6247.57,
      };
    }),
    '1m': Array.from({ length: 30 }, (_, i) => {
      const basePrice = 180;
      const monthlyGrowth = i * 2;
      const altcoinSwings = Math.sin(i * 0.5) * 35;
      const volatility = (Math.random() - 0.5) * 12;
      const solPrice = Math.max(50, basePrice + monthlyGrowth + altcoinSwings + volatility);
      return {
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        cryptoAmount: 6247.57,
        fiatValue: solPrice * 6247.57,
      };
    }),
    '1y': Array.from({ length: 365 }, (_, i) => {
      const basePrice = 25; // Much lower starting point
      const parabolicGrowth = i * 0.6; // Strong altcoin growth (365 days)
      const altSeasonality = Math.sin(i * 0.017) * 45;
      const volatility = (Math.random() - 0.5) * 15;
      const corrections = i > 250 ? Math.sin((i - 250) * 0.03) * -20 : 0;
      const solPrice = Math.max(10, basePrice + parabolicGrowth + altSeasonality + volatility + corrections);
      return {
        date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000), // Daily intervals
        cryptoAmount: 6247.57,
        fiatValue: solPrice * 6247.57,
      };
    }),
    'all': Array.from({ length: 104 }, (_, i) => {
      const basePrice = 2; // Very low starting point
      const altcoinSupercycle = i * 2.3; // Massive altcoin growth
      const majorCycles = Math.sin(i * 0.1) * 80;
      const volatility = (Math.random() - 0.5) * 25;
      const cryptoWinter = i > 70 && i < 85 ? -60 : 0;
      const solPrice = Math.max(1, basePrice + altcoinSupercycle + majorCycles + volatility + cryptoWinter);
      return {
        date: new Date(Date.now() - (103 - i) * 7 * 24 * 60 * 60 * 1000),
        cryptoAmount: 6247.57,
        fiatValue: solPrice * 6247.57,
      };
    }),
  },
};

// FIXED: Portfolio History Generation with Proper Asset Aggregation
export function calculatePortfolioHistory(
  assets: CryptoAsset[],
  range: string = '1w'
): Array<{ date: Date; value: number }> {
  console.log(`[calculatePortfolioHistory] Starting calculation for range: ${range}`);
  console.log(`[calculatePortfolioHistory] Assets:`, assets?.map(a => ({ id: a.id, name: a.name })));
  
  // Get all asset histories for the given range
  const allHistories = assets.map(asset => {
    const assetHistories = HISTORICAL_BALANCES[asset.id as keyof typeof HISTORICAL_BALANCES];
    if (!assetHistories) {
      console.warn(`[calculatePortfolioHistory] No histories found for asset ${asset.id}`);
      return [];
    }
    
    const history = assetHistories[range as keyof typeof assetHistories];
    if (!history) {
      console.warn(`[calculatePortfolioHistory] No history found for asset ${asset.id} in range ${range}`);
      return [];
    }
    
    return history.map((h: { date: Date; cryptoAmount: number; fiatValue: number }) => ({ 
      date: h.date, 
      value: h.fiatValue 
    }));
  });
  
  console.log(`[calculatePortfolioHistory] Found ${allHistories.length} asset histories`);
  
  // If no valid histories found, create a realistic fallback based on current values
  if (allHistories.length === 0) {
    console.log(`[calculatePortfolioHistory] No valid histories found, creating fallback for range: ${range}`);
    return generateFallbackPortfolioHistory(range);
  }
  
  // Find the date range that covers all assets
  const allDates = allHistories.flat().map(h => h.date.getTime());
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);
  
  // Create unified timeline
  const firstHistory = allHistories[0];
  const timeStep = firstHistory.length > 1 
    ? firstHistory[1].date.getTime() - firstHistory[0].date.getTime()
    : 60 * 60 * 1000; // Default to 1 hour
    
  const unifiedDates: Date[] = [];
  for (let timestamp = minDate; timestamp <= maxDate; timestamp += timeStep) {
    unifiedDates.push(new Date(timestamp));
  }
  
  console.log(`[calculatePortfolioHistory] Created unified timeline with ${unifiedDates.length} points`);
  
  // Sum all assets at each time point
  const portfolioHistory = unifiedDates.map(date => {
    let totalValue = 0;
    
         // Sum value from all assets at this time point
     allHistories.forEach(history => {
       // Find the closest data point in this asset's history
       const closestPoint = history.reduce((closest: { date: Date; value: number }, current: { date: Date; value: number }) => {
         const currentDiff = Math.abs(current.date.getTime() - date.getTime());
         const closestDiff = Math.abs(closest.date.getTime() - date.getTime());
         return currentDiff < closestDiff ? current : closest;
       });
       
       totalValue += closestPoint.value;
     });
    
    return {
      date: date,
      value: totalValue,
    };
  });
  
  console.log(`[calculatePortfolioHistory] Generated portfolio history with ${portfolioHistory.length} points`);
  
  return portfolioHistory;
}

/**
 * Generate fallback portfolio history when no asset histories are available
 */
function generateFallbackPortfolioHistory(range: string): Array<{ date: Date; value: number }> {
  const getDataPoints = (range: string) => {
    switch (range) {
      case '1d': return 24;   // Hourly - matches ledger-live
      case '1w': return 168;  // Hourly - matches ledger-live  
      case '1m': return 30;   // Daily - matches ledger-live
      case '1y': return 365;  // Daily - matches ledger-live (FIXED from 52 weekly)
      case 'all': return 104; // Weekly over 2 years (custom)
      default: return 24;
    }
  };
  
  const getTimeIncrement = (range: string) => {
    switch (range) {
      case '1d': return 60 * 60 * 1000;        // 1 hour
      case '1w': return 60 * 60 * 1000;        // 1 hour
      case '1m': return 24 * 60 * 60 * 1000;   // 1 day
      case '1y': return 24 * 60 * 60 * 1000;   // 1 day (FIXED from 1 week)
      case 'all': return 7 * 24 * 60 * 60 * 1000; // 1 week
      default: return 60 * 60 * 1000;
    }
  };
  
  const dataPoints = getDataPoints(range);
  const timeIncrement = getTimeIncrement(range);
  const baseValue = 8500000; // Realistic high-net-worth portfolio starting value
  
  return Array.from({ length: dataPoints }, (_, i) => ({
    date: new Date(Date.now() - (dataPoints - 1 - i) * timeIncrement),
    value: baseValue + Math.sin(i * 0.1) * 1200000 + i * 10000 + Math.random() * 300000,
  }));
}

/**
 * Enhanced portfolio data generation with real historical data integration
 */
export function generatePortfolioData(selectedRange: string): {
  range: string;
  balanceHistory: Array<{ date: Date; value: number }>;
  countervalueChange: { value: number; percentage: number };
  balanceAvailable: boolean;
} {
  console.log(`[generatePortfolioData] Generating data for range: ${selectedRange}`);
  
  let balanceHistory: Array<{ date: Date; value: number }>;
  
  try {
    // Use static historical data for chart display
    // Real historical data will be used by PriceService for calculations
    balanceHistory = calculatePortfolioHistory(CRYPTO_ASSETS, selectedRange);
    
  if (balanceHistory.length === 0) {
      throw new Error('No balance history generated');
  }
  
  } catch (error) {
    console.error(`[generatePortfolioData] Error generating portfolio data for ${selectedRange}:`, error);
    // Fallback to simple realistic data
    balanceHistory = generateFallbackPortfolioHistory(selectedRange);
  }
  
  // Calculate countervalue change from the generated history
  const startValue = balanceHistory[0]?.value || 0;
  const endValue = balanceHistory[balanceHistory.length - 1]?.value || 0;
  const valueChange = endValue - startValue;
  const percentageChange = startValue > 0 ? valueChange / startValue : 0;
  
  console.log(`[generatePortfolioData] Generated ${balanceHistory.length} data points for ${selectedRange}`);
  console.log(`[generatePortfolioData] Value change: ${valueChange}, Percentage: ${percentageChange * 100}%`);
  
  return {
    range: selectedRange,
    balanceHistory,
    countervalueChange: {
      value: valueChange,
      percentage: percentageChange, // Keep as decimal
    },
    balanceAvailable: true,
  };
}

/**
 * Async version for enhanced portfolio data generation with real historical data integration
 */
export async function generatePortfolioDataAsync(selectedRange: string): Promise<{
  range: string;
  balanceHistory: Array<{ date: Date; value: number }>;
  countervalueChange: { value: number; percentage: number };
  balanceAvailable: boolean;
}> {
  console.log(`[generatePortfolioDataAsync] Generating data for range: ${selectedRange}`);
  
  let balanceHistory: Array<{ date: Date; value: number }>;
  
  try {
    if (selectedRange === '1w' || selectedRange === '1m') {
      // Use real historical data for 1W and 1M
      const historicalService = HistoricalPortfolioService;
      balanceHistory = await historicalService.getHistoricalPortfolioData(selectedRange);
    } else {
      // Use static historical data for other timeframes
      balanceHistory = calculatePortfolioHistory(CRYPTO_ASSETS, selectedRange);
    }
    
    if (balanceHistory.length === 0) {
      throw new Error('No balance history generated');
    }
    
  } catch (error) {
    console.error(`[generatePortfolioDataAsync] Error generating portfolio data for ${selectedRange}:`, error);
    // Fallback to simple realistic data
    balanceHistory = generateFallbackPortfolioHistory(selectedRange);
  }
  
  // Calculate countervalue change from the generated history
  const startValue = balanceHistory[0]?.value || 0;
  const endValue = balanceHistory[balanceHistory.length - 1]?.value || 0;
  const valueChange = endValue - startValue;
  const percentageChange = startValue > 0 ? valueChange / startValue : 0;
  
  console.log(`[generatePortfolioDataAsync] Generated ${balanceHistory.length} data points for ${selectedRange}`);
  console.log(`[generatePortfolioDataAsync] Value change: ${valueChange}, Percentage: ${percentageChange * 100}%`);
  
  return {
    range: selectedRange,
    balanceHistory,
    countervalueChange: {
      value: valueChange,
      percentage: percentageChange, // Keep as decimal
    },
    balanceAvailable: true,
  };
}

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
      color: '#FFAD35', // Exact color from Ledger Live (shown in image)
      units: [{name: 'bitcoin', code: 'BTC', magnitude: 8, symbol: '₿'}],
    },
    // Crypto amount in smallest units (satoshis for BTC)
    balance: 83.5206, // Display balance (83.5206 BTC)
    amount: '8352060000', // 83.5206 BTC in satoshis (8,352,060,000 sats)
    icon: {
      backgroundColor: '#FFAD35', // Exact Ledger Live Bitcoin color
      symbol: '₿', // Bitcoin symbol - matches Ledger Live
      color: '#FFFFFF',
    },
    // Fallback countervalue changes for different timeframes (realistic gains)
    countervalueChange: {
      '1d': {
        value: 152817.67, // ~$152K gain in 1 day (83.5206 BTC * $1,830 price increase)
        percentage: 0.0189, // +1.89%
      },
      '1w': {
        value: 440502.58, // ~$440K gain in 1 week (83.5206 BTC * $5,000 price increase)
        percentage: 0.0543, // +5.43%
      },
      '1m': {
        value: 1002247.20, // ~$1M gain in 1 month (83.5206 BTC * $12,000 price increase)
        percentage: 0.1412, // +14.12%
      },
      '1y': {
        value: 5181771.20, // ~$5.2M gain in 1 year (83.5206 BTC * $62,000 price increase)
        percentage: 1.7714, // +177.14%
      },
      'all': {
        value: 7423433.40, // ~$7.4M gain over all time (83.5206 BTC * $89,000 price increase)
        percentage: 11.1250, // +1112.50%
      },
    },
  },
  {
    id: 'solana',
    name: 'Solana',
    ticker: 'SOL',
    currency: {
      id: 'solana',
      ticker: 'SOL',
      name: 'Solana',
      color: '#9945ff', // Exact color from Ledger Live design tokens
      units: [{name: 'solana', code: 'SOL', magnitude: 9, symbol: '◎'}],
    },
    // Crypto amount in smallest units (lamports for SOL)
    balance: 6247.57, // Display balance (6,247.57 SOL)
    amount: '6247570000000', // 6,247.57 SOL in lamports (6,247,570,000,000 lamports)
    icon: {
      backgroundColor: '#9945ff', // Exact Ledger Live Solana color
      symbol: '◎', // Solana symbol - matches Ledger Live
      color: '#FFFFFF',
    },
    // Fallback countervalue changes for different timeframes (realistic gains)
    countervalueChange: {
      '1d': {
        value: 24990.28, // ~$25K gain in 1 day (6,247.57 SOL * $4 price increase)
        percentage: 0.0168, // +1.68%
      },
      '1w': {
        value: 137447.54, // ~$137K gain in 1 week (6,247.57 SOL * $22 price increase)
        percentage: 0.1000, // +10.00%
      },
      '1m': {
        value: 387349.34, // ~$387K gain in 1 month (6,247.57 SOL * $62 price increase)
        percentage: 0.3444, // +34.44%
      },
      '1y': {
        value: 1355883.69, // ~$1.36M gain in 1 year (6,247.57 SOL * $217 price increase)
        percentage: 8.6800, // +868.00%
      },
      'all': {
        value: 1499416.80, // ~$1.5M gain over all time (6,247.57 SOL * $240 price increase)
        percentage: 119.0000, // +11900.00%
      },
    },
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

// Types for static UI replica
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

export interface CryptoAsset {
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
  amount: string;
  icon: {
    backgroundColor: string;
    symbol: string;
    color: string;
  };
}
