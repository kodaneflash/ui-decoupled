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
    '1y': Array.from({ length: 52 }, (_, i) => {
      const basePrice = 35000; // Much lower starting point for 1Y
      const yearlyBull = i * 1000; // Strong bull market over year
      const seasonality = Math.sin(i * 0.12) * 8000; // Seasonal patterns
      const volatility = (Math.random() - 0.5) * 2000;
      const corrections = i > 30 ? Math.sin((i - 30) * 0.8) * -3000 : 0; // Mid-year correction
      const btcPrice = Math.max(20000, basePrice + yearlyBull + seasonality + volatility + corrections);
      return {
        date: new Date(Date.now() - (51 - i) * 7 * 24 * 60 * 60 * 1000),
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
    '1y': Array.from({ length: 52 }, (_, i) => {
      const basePrice = 25; // Much lower starting point
      const parabolicGrowth = i * 4; // Strong altcoin growth
      const altSeasonality = Math.sin(i * 0.15) * 45;
      const volatility = (Math.random() - 0.5) * 15;
      const corrections = i > 35 ? Math.sin((i - 35) * 1.2) * -20 : 0;
      const solPrice = Math.max(10, basePrice + parabolicGrowth + altSeasonality + volatility + corrections);
      return {
        date: new Date(Date.now() - (51 - i) * 7 * 24 * 60 * 60 * 1000),
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
  console.log(`[calculatePortfolioHistory] Generating data for range: ${range}`);
  
  // Get all asset histories for the selected range
  const allHistories = assets.map(asset => {
    const assetHistory = HISTORICAL_BALANCES[asset.id as keyof typeof HISTORICAL_BALANCES];
    if (!assetHistory) {
      console.warn(`[calculatePortfolioHistory] No history found for asset: ${asset.id}`);
      return [];
    }
    
    const rangeHistory = assetHistory[range as keyof typeof assetHistory];
    if (!rangeHistory || rangeHistory.length === 0) {
      console.warn(`[calculatePortfolioHistory] No history found for range ${range} of asset: ${asset.id}`);
      return [];
    }
    
    console.log(`[calculatePortfolioHistory] Found ${rangeHistory.length} points for ${asset.id} ${range}`);
    return rangeHistory;
  }).filter(history => history.length > 0);
  
  // If no valid histories found, create a realistic fallback based on current values
  if (allHistories.length === 0) {
    console.log(`[calculatePortfolioHistory] No valid histories found, creating fallback for range: ${range}`);
    
    // Create realistic portfolio progression based on range
    const getDataPoints = (range: string) => {
      switch (range) {
        case '1d': return 24;   // Hourly
        case '1w': return 168;  // Hourly  
        case '1m': return 30;   // Daily
        case '1y': return 52;   // Weekly
        case 'all': return 104; // Weekly over 2 years
        default: return 24;
      }
    };
    
    const getTimeIncrement = (range: string) => {
      switch (range) {
        case '1d': return 60 * 60 * 1000;        // 1 hour
        case '1w': return 60 * 60 * 1000;        // 1 hour
        case '1m': return 24 * 60 * 60 * 1000;   // 1 day
        case '1y': return 7 * 24 * 60 * 60 * 1000; // 1 week
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
  for (let time = minDate; time <= maxDate; time += timeStep) {
    unifiedDates.push(new Date(time));
  }
  
  console.log(`[calculatePortfolioHistory] Created ${unifiedDates.length} unified timeline points`);
  
  // Aggregate portfolio values for each date
  const portfolioHistory = unifiedDates.map(date => {
    const portfolioValue = allHistories.reduce((totalValue, assetHistory) => {
      // Find the closest data point for this date
      const targetTime = date.getTime();
      let closestPoint = assetHistory[0];
      let minDiff = Math.abs(closestPoint.date.getTime() - targetTime);
      
      for (const point of assetHistory) {
        const diff = Math.abs(point.date.getTime() - targetTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = point;
        }
      }
      
      return totalValue + (closestPoint?.fiatValue || 0);
    }, 0);
    
    return {
      date,
      value: portfolioValue,
    };
  });
  
  console.log(`[calculatePortfolioHistory] Generated ${portfolioHistory.length} portfolio points`);
  console.log(`[calculatePortfolioHistory] Value range: ${Math.min(...portfolioHistory.map(p => p.value))} - ${Math.max(...portfolioHistory.map(p => p.value))}`);
  
  return portfolioHistory;
}

export function calculatePortfolioDelta(
  balanceHistory: Array<{ date: Date; value: number }>
): { value: number; percentage: number } {
  if (balanceHistory.length === 0) {
    return { value: 0, percentage: 0 };
  }
  
  // Find first significant (non-zero) balance
  const firstSignificantIndex = balanceHistory.findIndex(b => b.value !== 0);
  const startValue = balanceHistory[firstSignificantIndex]?.value || 0;
  const endValue = balanceHistory[balanceHistory.length - 1]?.value || 0;
  
  if (startValue === 0) {
    return { value: 0, percentage: 0 };
  }
  
  const dollarChange = endValue - startValue;
  const percentageChange = dollarChange / startValue;
  
  console.log(`[calculatePortfolioDelta] Start: ${startValue}, End: ${endValue}, Change: ${dollarChange} (${(percentageChange * 100).toFixed(2)}%)`);
  
  return {
    value: dollarChange,
    percentage: percentageChange, // Already in 0-1 decimal format
  };
}

export function generatePortfolioData(range: string = '1w'): any {
  console.log(`[generatePortfolioData] Generating portfolio data for range: ${range}`);
  
  const balanceHistory = calculatePortfolioHistory(CRYPTO_ASSETS, range);
  const countervalueChange = calculatePortfolioDelta(balanceHistory);
  
  return {
    ...PORTFOLIO_DATA,
    balanceHistory,
    range,
    countervalueChange,
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
      color: '#F7931A',
      units: [{name: 'bitcoin', code: 'BTC', magnitude: 8, symbol: '₿'}],
    },
    // Crypto amount in smallest units (satoshis for BTC)
    balance: 83.5206, // Display balance (83.5206 BTC)
    amount: '8352060000', // 83.5206 BTC in satoshis (8,352,060,000 sats)
    icon: {
      backgroundColor: '#F7931A',
      symbol: '₿',
      color: '#FFFFFF',
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
      color: '#9945FF',
      units: [{name: 'solana', code: 'SOL', magnitude: 9, symbol: '◎'}],
    },
    // Crypto amount in smallest units (lamports for SOL)
    balance: 6247.57, // Display balance (6,247.57 SOL)
    amount: '6247570000000', // 6,247.57 SOL in lamports (6,247,570,000,000 lamports)
    icon: {
      backgroundColor: '#9945FF',
      symbol: '◎',
      color: '#FFFFFF',
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
