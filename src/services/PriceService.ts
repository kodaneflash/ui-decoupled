import { BigNumber } from "bignumber.js";

export interface LivePrice {
  id: string;
  usd: number;
  usd_24h_change: number;
  last_updated_at: number;
}

export interface PriceData {
  [key: string]: LivePrice;
}

export interface ValueChangeData {
  value: number;
  percentage: number;
  absoluteValue: number;
  priceStart: number;
  priceEnd: number;
}

// Enhanced historical data interfaces for real API integration
export interface HistoricalPricePoint {
  timestamp: number;
  price: number;
}

export interface HistoricalDataCache {
  data: HistoricalPricePoint[];
  timestamp: number;
  timeframe: string;
  cryptoId: string;
}

// Cache configuration for different timeframes
const CACHE_CONFIG = {
  '1d': {
    duration: 5 * 60 * 1000, // 5 minutes cache for 1D (more frequent updates)
    maxAge: 24 * 60 * 60 * 1000, // Data valid for 24 hours
  },
  '1w': {
    duration: 30 * 60 * 1000, // 30 minutes cache for 1W (less frequent updates)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Data valid for 7 days
  },
  '1m': {
    duration: 60 * 60 * 1000, // 1 hour cache for 1M (even less frequent)
    maxAge: 30 * 24 * 60 * 60 * 1000, // Data valid for 30 days
  },
  // Keep static data for longer timeframes to avoid API abuse
  '1y': {
    duration: 24 * 60 * 60 * 1000, // 24 hours cache
    maxAge: 365 * 24 * 60 * 60 * 1000, // Data valid for 1 year
  },
  'all': {
    duration: 24 * 60 * 60 * 1000, // 24 hours cache
    maxAge: 2 * 365 * 24 * 60 * 60 * 1000, // Data valid for 2 years
  },
} as const;

// Historical price data for different timeframes (static but realistic)
// NOW ONLY USED FOR 1Y AND ALL TIMEFRAMES + FALLBACK
export const HISTORICAL_PRICES = {
  bitcoin: {
    '1d': {
      priceStart: 95200,
      priceEnd: 97000,
      change: 1.89, // +1.89%
    },
    '1w': {
      priceStart: 92000,
      priceEnd: 97000,
      change: 5.43, // +5.43%
    },
    '1m': {
      priceStart: 85000,
      priceEnd: 97000,
      change: 14.12, // +14.12%
    },
    '1y': {
      priceStart: 35000,
      priceEnd: 97000,
      change: 177.14, // +177.14%
    },
    'all': {
      priceStart: 8000,
      priceEnd: 97000,
      change: 1112.50, // +1112.50%
    },
  },
  solana: {
    '1d': {
      priceStart: 238,
      priceEnd: 242,
      change: 1.68, // +1.68%
    },
    '1w': {
      priceStart: 220,
      priceEnd: 242,
      change: 10.00, // +10.00%
    },
    '1m': {
      priceStart: 180,
      priceEnd: 242,
      change: 34.44, // +34.44%
    },
    '1y': {
      priceStart: 25,
      priceEnd: 242,
      change: 868.00, // +868.00%
    },
    'all': {
      priceStart: 2,
      priceEnd: 242,
      change: 11900.00, // +11900.00%
    },
  },
};

// Supported crypto currencies for live pricing (BTC and SOL only)
const SUPPORTED_CRYPTOS = {
  bitcoin: 'bitcoin',
  solana: 'solana',
} as const;

export type SupportedCryptoId = keyof typeof SUPPORTED_CRYPTOS;

class PriceService {
  private static instance: PriceService;
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { data: PriceData; timestamp: number }> = new Map();
  private historicalCache: Map<string, HistoricalDataCache> = new Map();
  private cacheTimeout = 60000; // 1 minute cache for current prices
  private requestQueue: Map<string, Promise<any>> = new Map(); // Prevent duplicate requests

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  /**
   * Enhanced historical data fetching with intelligent caching
   */
  async fetchHistoricalData(
    cryptoId: SupportedCryptoId,
    timeframe: string
  ): Promise<HistoricalPricePoint[]> {
    const cacheKey = `${cryptoId}-${timeframe}`;
    const cached = this.historicalCache.get(cacheKey);
    const config = CACHE_CONFIG[timeframe as keyof typeof CACHE_CONFIG];
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < config.duration) {
      console.log(`[PriceService] Using cached historical data for ${cryptoId} ${timeframe}`);
      return cached.data;
    }

    // Prevent duplicate requests using request queue
    if (this.requestQueue.has(cacheKey)) {
      console.log(`[PriceService] Waiting for existing request for ${cryptoId} ${timeframe}`);
      return await this.requestQueue.get(cacheKey);
    }

    // Create new request
    const requestPromise = this.fetchHistoricalDataFromAPI(cryptoId, timeframe);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      
      // Cache the result
      this.historicalCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        timeframe,
        cryptoId,
      });
      
      console.log(`[PriceService] Cached historical data for ${cryptoId} ${timeframe}: ${data.length} points`);
      return data;
      
    } catch (error) {
      console.error(`[PriceService] Error fetching historical data for ${cryptoId} ${timeframe}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log(`[PriceService] Using expired cached data due to error`);
        return cached.data;
      }
      
      // Fallback to generated historical data
      return this.generateFallbackHistoricalData(cryptoId, timeframe);
      
    } finally {
      // Clean up request queue
      this.requestQueue.delete(cacheKey);
    }
  }

  /**
   * Fetch historical data from CoinGecko API
   */
  private async fetchHistoricalDataFromAPI(
    cryptoId: SupportedCryptoId,
    timeframe: string
  ): Promise<HistoricalPricePoint[]> {
    const coinGeckoId = SUPPORTED_CRYPTOS[cryptoId];
    const now = Date.now();
    let fromTimestamp: number;
    let toTimestamp = now;

    // Calculate time range based on timeframe
    switch (timeframe) {
      case '1w':
        fromTimestamp = now - (7 * 24 * 60 * 60 * 1000); // 7 days ago
        break;
      case '1m':
        fromTimestamp = now - (30 * 24 * 60 * 60 * 1000); // 30 days ago
        break;
      default:
        throw new Error(`Unsupported timeframe for historical API: ${timeframe}`);
    }

    // Use CoinGecko's range endpoint for historical data
    const fromSeconds = Math.floor(fromTimestamp / 1000);
    const toSeconds = Math.floor(toTimestamp / 1000);
    
    const url = `${this.baseUrl}/coins/${coinGeckoId}/market_chart/range?vs_currency=usd&from=${fromSeconds}&to=${toSeconds}`;
    
    console.log(`[PriceService] Fetching historical data from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.warn(`[PriceService] Rate limited for ${cryptoId} ${timeframe}, using fallback`);
        throw new Error('Rate limited');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API response (prices array) to our format
    const historicalPoints: HistoricalPricePoint[] = data.prices.map((pricePoint: [number, number]) => ({
      timestamp: pricePoint[0],
      price: pricePoint[1],
    }));
    
    console.log(`[PriceService] Fetched ${historicalPoints.length} historical points for ${cryptoId} ${timeframe}`);
    return historicalPoints;
  }

  /**
   * Generate fallback historical data when API is unavailable
   */
  private generateFallbackHistoricalData(
    cryptoId: SupportedCryptoId,
    timeframe: string
  ): HistoricalPricePoint[] {
    console.log(`[PriceService] Generating fallback historical data for ${cryptoId} ${timeframe}`);
    
    const historicalData = HISTORICAL_PRICES[cryptoId][timeframe as keyof typeof HISTORICAL_PRICES[typeof cryptoId]];
    if (!historicalData) {
      return [];
    }

    const now = Date.now();
    const points: HistoricalPricePoint[] = [];
    const numPoints = timeframe === '1w' ? 168 : 30; // Hourly for 1W, daily for 1M
    const timeIncrement = timeframe === '1w' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    for (let i = 0; i < numPoints; i++) {
      const timestamp = now - ((numPoints - 1 - i) * timeIncrement);
      const progress = i / (numPoints - 1);
      const price = historicalData.priceStart + (historicalData.priceEnd - historicalData.priceStart) * progress;
      
      points.push({
        timestamp,
        price: price + (Math.random() - 0.5) * (price * 0.02), // Add some realistic volatility
      });
    }

    return points;
  }

  /**
   * Enhanced value change calculation with real historical data
   */
  async calculateHistoricalValueChange(
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    timeframe: string,
    decimals: number = 8
  ): Promise<ValueChangeData> {
    const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(decimals));
    
    try {
      // Use real historical data for 1W and 1M
      if (timeframe === '1w' || timeframe === '1m') {
        const historicalData = await this.fetchHistoricalData(cryptoId, timeframe);
        
        if (historicalData.length === 0) {
          throw new Error('No historical data available');
        }
        
        // Get start and end prices
        const startPrice = historicalData[0].price;
        const endPrice = historicalData[historicalData.length - 1].price;
        
        // Calculate fiat values
        const startValue = adjustedAmount.multipliedBy(startPrice);
        const endValue = adjustedAmount.multipliedBy(endPrice);
        const valueChange = endValue.minus(startValue);
        const percentageChange = startValue.isZero() ? 0 : valueChange.dividedBy(startValue).toNumber();
        
        console.log(`[PriceService] Historical ${timeframe} change for ${cryptoId}:`, {
          amount: adjustedAmount.toNumber(),
          startPrice,
          endPrice,
          startValue: startValue.toNumber(),
          endValue: endValue.toNumber(),
          valueChange: valueChange.toNumber(),
          percentageChange: percentageChange,
        });
        
        return {
          value: valueChange.toNumber(),
          percentage: percentageChange,
          absoluteValue: Math.abs(valueChange.toNumber()),
          priceStart: startPrice,
          priceEnd: endPrice,
        };
      }
      
      // Fall back to static data for other timeframes
      return this.calculateTimeframeValueChange(cryptoId, amount, timeframe, decimals);
      
    } catch (error) {
      console.error(`[PriceService] Error calculating historical ${timeframe} change for ${cryptoId}:`, error);
      
      // Fallback to static data
      return this.calculateTimeframeValueChange(cryptoId, amount, timeframe, decimals);
    }
  }

  /**
   * Fetch live prices for BTC and SOL from CoinGecko
   */
  async fetchPrices(): Promise<PriceData> {
    const cacheKey = 'live-prices';
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const cryptoIds = Object.values(SUPPORTED_CRYPTOS).join(',');
      const url = `${this.baseUrl}/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;
      
      console.log('[PriceService] Fetching prices from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API response to our format
      const priceData: PriceData = {};
      
      for (const [cryptoId, priceInfo] of Object.entries(data)) {
        if (typeof priceInfo === 'object' && priceInfo !== null) {
          const info = priceInfo as any;
          priceData[cryptoId] = {
            id: cryptoId,
            usd: info.usd || 0,
            usd_24h_change: info.usd_24h_change || 0,
            last_updated_at: info.last_updated_at || Date.now() / 1000,
          };
        }
      }
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: priceData,
        timestamp: Date.now(),
      });
      
      console.log('[PriceService] Fetched prices:', priceData);
      return priceData;
      
    } catch (error) {
      console.error('[PriceService] Error fetching prices:', error);
      
      // Return cached data if available, otherwise fallback prices
      if (cached) {
        console.log('[PriceService] Using cached data due to error');
        return cached.data;
      }
      
      // Fallback prices if no cache available
      return this.getFallbackPrices();
    }
  }

  /**
   * Calculate value change for specific timeframe and asset quantity
   * For 1d: Uses real CoinGecko API data
   * For other timeframes: Uses realistic static historical data
   */
  async calculate24hValueChange(
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    decimals: number = 8
  ): Promise<ValueChangeData> {
    const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(decimals));
    
    try {
      // For 1d timeframe, use real API data
      const prices = await this.fetchPrices();
      const coinGeckoId = SUPPORTED_CRYPTOS[cryptoId];
      const currentPrice = prices[coinGeckoId]?.usd || 0;
      const change24hPercent = prices[coinGeckoId]?.usd_24h_change || 0;
      
      // Calculate the previous price 24h ago
      const previousPrice = currentPrice / (1 + change24hPercent / 100);
      
      // Calculate fiat values
      const currentValue = adjustedAmount.multipliedBy(currentPrice);
      const previousValue = adjustedAmount.multipliedBy(previousPrice);
      const valueChange = currentValue.minus(previousValue);
      
      console.log(`[PriceService] 24h change for ${cryptoId}:`, {
        amount: adjustedAmount.toNumber(),
        currentPrice,
        previousPrice,
        currentValue: currentValue.toNumber(),
        previousValue: previousValue.toNumber(),
        valueChange: valueChange.toNumber(),
        changePercent: change24hPercent,
      });
      
      return {
        value: valueChange.toNumber(),
        percentage: change24hPercent / 100, // Convert to decimal format
        absoluteValue: Math.abs(valueChange.toNumber()),
        priceStart: previousPrice,
        priceEnd: currentPrice,
      };
      
    } catch (error) {
      console.error(`[PriceService] Error calculating 24h change for ${cryptoId}:`, error);
      
      // Fallback to static data
      const historicalData = HISTORICAL_PRICES[cryptoId]['1d'];
      const currentValue = adjustedAmount.multipliedBy(historicalData.priceEnd);
      const previousValue = adjustedAmount.multipliedBy(historicalData.priceStart);
      const valueChange = currentValue.minus(previousValue);
      
      return {
        value: valueChange.toNumber(),
        percentage: historicalData.change / 100,
        absoluteValue: Math.abs(valueChange.toNumber()),
        priceStart: historicalData.priceStart,
        priceEnd: historicalData.priceEnd,
      };
    }
  }

  /**
   * Calculate value change for specific timeframe using static historical data
   * This is used for 1y, and all timeframes + fallback
   */
  calculateTimeframeValueChange(
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    timeframe: string,
    decimals: number = 8
  ): ValueChangeData {
    const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(decimals));
    
    // Get historical price data for the timeframe
    const historicalData = HISTORICAL_PRICES[cryptoId][timeframe as keyof typeof HISTORICAL_PRICES[typeof cryptoId]];
    
    if (!historicalData) {
      console.warn(`[PriceService] No historical data for ${cryptoId} ${timeframe}`);
      return {
        value: 0,
        percentage: 0,
        absoluteValue: 0,
        priceStart: 0,
        priceEnd: 0,
      };
    }
    
    // Calculate fiat values at start and end of timeframe
    const startValue = adjustedAmount.multipliedBy(historicalData.priceStart);
    const endValue = adjustedAmount.multipliedBy(historicalData.priceEnd);
    const valueChange = endValue.minus(startValue);
    
    console.log(`[PriceService] ${timeframe} change for ${cryptoId}:`, {
      amount: adjustedAmount.toNumber(),
      priceStart: historicalData.priceStart,
      priceEnd: historicalData.priceEnd,
      startValue: startValue.toNumber(),
      endValue: endValue.toNumber(),
      valueChange: valueChange.toNumber(),
      changePercent: historicalData.change,
    });
    
    return {
      value: valueChange.toNumber(),
      percentage: historicalData.change / 100, // Convert to decimal format
      absoluteValue: Math.abs(valueChange.toNumber()),
      priceStart: historicalData.priceStart,
      priceEnd: historicalData.priceEnd,
    };
  }

  /**
   * Get value change for any timeframe - ENHANCED with real historical data
   */
  async getValueChangeForTimeframe(
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    timeframe: string,
    decimals: number = 8
  ): Promise<ValueChangeData> {
    if (timeframe === '1d') {
      // Use real API data for 24h changes
      return this.calculate24hValueChange(cryptoId, amount, decimals);
    } else if (timeframe === '1w' || timeframe === '1m') {
      // Use real historical data for 1W and 1M
      return this.calculateHistoricalValueChange(cryptoId, amount, timeframe, decimals);
    } else {
      // Use static historical data for other timeframes (1y, all)
      return this.calculateTimeframeValueChange(cryptoId, amount, timeframe, decimals);
    }
  }

  /**
   * Get price for specific cryptocurrency
   */
  async getPrice(cryptoId: SupportedCryptoId): Promise<number> {
    const prices = await this.fetchPrices();
    const coinGeckoId = SUPPORTED_CRYPTOS[cryptoId];
    return prices[coinGeckoId]?.usd || 0;
  }

  /**
   * Calculate fiat value for crypto amount
   */
  async calculateFiatValue(
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    decimals: number = 8
  ): Promise<BigNumber> {
    const price = await this.getPrice(cryptoId);
    const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(decimals));
    return adjustedAmount.multipliedBy(price);
  }

  /**
   * Get 24h change percentage for crypto
   */
  async get24hChange(cryptoId: SupportedCryptoId): Promise<number> {
    const prices = await this.fetchPrices();
    const coinGeckoId = SUPPORTED_CRYPTOS[cryptoId];
    return prices[coinGeckoId]?.usd_24h_change || 0;
  }

  /**
   * Fallback static prices for development/error scenarios
   */
  private getFallbackPrices(): PriceData {
    console.log('[PriceService] Using fallback prices');
    return {
      bitcoin: {
        id: 'bitcoin',
        usd: 97000,
        usd_24h_change: 1.89,
        last_updated_at: Date.now() / 1000,
      },
      solana: {
        id: 'solana',
        usd: 242,
        usd_24h_change: 1.68,
        last_updated_at: Date.now() / 1000,
      },
    };
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cache.clear();
    this.historicalCache.clear();
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats(): { current: number; historical: number } {
    return {
      current: this.cache.size,
      historical: this.historicalCache.size,
    };
  }
}

export default PriceService.getInstance(); 