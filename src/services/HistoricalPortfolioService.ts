import { BigNumber } from 'bignumber.js';
import PriceService, { HistoricalPricePoint, SupportedCryptoId } from './PriceService';
import { CRYPTO_ASSETS } from '../constants/portfolioData';

export interface HistoricalPortfolioPoint {
  date: Date;
  value: number;
}

export interface PortfolioHistoryCache {
  data: HistoricalPortfolioPoint[];
  timestamp: number;
  timeframe: string;
}

/**
 * Service to handle real-time historical portfolio data
 * Integrates with PriceService to fetch real historical data for 1W and 1M timeframes
 */
class HistoricalPortfolioService {
  private static instance: HistoricalPortfolioService;
  private cache: Map<string, PortfolioHistoryCache> = new Map();
  private priceService = PriceService;

  // Cache durations aligned with PriceService
  private readonly CACHE_DURATIONS = {
    '1d': 5 * 60 * 1000,  // 5 minutes
    '1w': 30 * 60 * 1000, // 30 minutes
    '1m': 60 * 60 * 1000, // 1 hour
    '1y': 24 * 60 * 60 * 1000, // 24 hours
    'all': 24 * 60 * 60 * 1000, // 24 hours
  } as const;

  static getInstance(): HistoricalPortfolioService {
    if (!HistoricalPortfolioService.instance) {
      HistoricalPortfolioService.instance = new HistoricalPortfolioService();
    }
    return HistoricalPortfolioService.instance;
  }

  /**
   * Get historical portfolio data for a specific timeframe
   */
  async getHistoricalPortfolioData(timeframe: string): Promise<HistoricalPortfolioPoint[]> {
    const cacheKey = `portfolio-${timeframe}`;
    const cached = this.cache.get(cacheKey);
    const cacheDuration = this.CACHE_DURATIONS[timeframe as keyof typeof this.CACHE_DURATIONS] || 30 * 60 * 1000;

    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log(`[HistoricalPortfolioService] Using cached portfolio data for ${timeframe}`);
      return cached.data;
    }

    try {
      let portfolioHistory: HistoricalPortfolioPoint[];

      if (timeframe === '1w' || timeframe === '1m') {
        // Use real historical data for 1W and 1M
        portfolioHistory = await this.generateRealHistoricalData(timeframe);
      } else {
        // Use fallback data for other timeframes
        portfolioHistory = this.generateFallbackHistoricalData(timeframe);
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: portfolioHistory,
        timestamp: Date.now(),
        timeframe,
      });

      console.log(`[HistoricalPortfolioService] Generated ${portfolioHistory.length} portfolio points for ${timeframe}`);
      return portfolioHistory;

    } catch (error) {
      console.error(`[HistoricalPortfolioService] Error generating portfolio data for ${timeframe}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log(`[HistoricalPortfolioService] Using expired cached data due to error`);
        return cached.data;
      }

      // Final fallback
      return this.generateFallbackHistoricalData(timeframe);
    }
  }

  /**
   * Generate real historical portfolio data using live market data
   */
  private async generateRealHistoricalData(timeframe: string): Promise<HistoricalPortfolioPoint[]> {
    console.log(`[HistoricalPortfolioService] Generating real historical data for ${timeframe}`);

    // Fetch historical data for all assets in parallel
    const assetHistoricalData = await Promise.all(
      CRYPTO_ASSETS.map(async (asset) => {
        try {
          const cryptoId = asset.id as SupportedCryptoId;
          const historicalPrices = await this.priceService.fetchHistoricalData(cryptoId, timeframe);
          
          return {
            asset,
            prices: historicalPrices,
          };
        } catch (error) {
          console.error(`[HistoricalPortfolioService] Error fetching data for ${asset.id}:`, error);
          return {
            asset,
            prices: [],
          };
        }
      })
    );

    // Find the common timeline across all assets
    const allTimestamps = new Set<number>();
    assetHistoricalData.forEach(({ prices }) => {
      prices.forEach(({ timestamp }) => allTimestamps.add(timestamp));
    });

    const sortedTimestamps = Array.from(allTimestamps).sort();

    if (sortedTimestamps.length === 0) {
      throw new Error('No historical data available');
    }

    // Calculate portfolio value for each timestamp
    const portfolioHistory: HistoricalPortfolioPoint[] = sortedTimestamps.map(timestamp => {
      let totalValue = 0;

      assetHistoricalData.forEach(({ asset, prices }) => {
        if (prices.length === 0) return;

        // Find the closest price point for this timestamp
        const closestPrice = this.findClosestPrice(prices, timestamp);
        
        if (closestPrice) {
          // Calculate asset value using the historical price
          const assetAmount = new BigNumber(asset.amount);
          const magnitude = asset.currency.units[0].magnitude;
          const adjustedAmount = assetAmount.dividedBy(new BigNumber(10).pow(magnitude));
          const assetValue = adjustedAmount.multipliedBy(closestPrice.price);
          
          totalValue += assetValue.toNumber();
        }
      });

      return {
        date: new Date(timestamp),
        value: totalValue,
      };
    });

    console.log(`[HistoricalPortfolioService] Generated ${portfolioHistory.length} real historical points`);
    return portfolioHistory;
  }

  /**
   * Find the closest price point to a given timestamp
   */
  private findClosestPrice(prices: HistoricalPricePoint[], targetTimestamp: number): HistoricalPricePoint | null {
    if (prices.length === 0) return null;

    return prices.reduce((closest, current) => {
      const currentDiff = Math.abs(current.timestamp - targetTimestamp);
      const closestDiff = Math.abs(closest.timestamp - targetTimestamp);
      return currentDiff < closestDiff ? current : closest;
    });
  }

  /**
   * Generate fallback historical data for timeframes that don't use real data
   */
  private generateFallbackHistoricalData(timeframe: string): HistoricalPortfolioPoint[] {
    console.log(`[HistoricalPortfolioService] Generating fallback data for ${timeframe}`);
    
    const getDataPoints = (timeframe: string) => {
      switch (timeframe) {
        case '1d': return 24;   // Hourly
        case '1w': return 168;  // Hourly  
        case '1m': return 30;   // Daily
        case '1y': return 52;   // Weekly
        case 'all': return 104; // Weekly over 2 years
        default: return 24;
      }
    };

    const getTimeIncrement = (timeframe: string) => {
      switch (timeframe) {
        case '1d': return 60 * 60 * 1000;        // 1 hour
        case '1w': return 60 * 60 * 1000;        // 1 hour
        case '1m': return 24 * 60 * 60 * 1000;   // 1 day
        case '1y': return 7 * 24 * 60 * 60 * 1000; // 1 week
        case 'all': return 7 * 24 * 60 * 60 * 1000; // 1 week
        default: return 60 * 60 * 1000;
      }
    };

    const dataPoints = getDataPoints(timeframe);
    const timeIncrement = getTimeIncrement(timeframe);
    const baseValue = 8500000; // Realistic high-net-worth portfolio starting value

    return Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(Date.now() - (dataPoints - 1 - i) * timeIncrement),
      value: baseValue + Math.sin(i * 0.1) * 1200000 + i * 10000 + Math.random() * 300000,
    }));
  }

  /**
   * Clear cache for fresh data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): number {
    return this.cache.size;
  }
}

export default HistoricalPortfolioService.getInstance(); 