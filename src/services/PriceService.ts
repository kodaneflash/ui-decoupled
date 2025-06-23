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
  private cacheTimeout = 60000; // 1 minute cache

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
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
        usd: 45000,
        usd_24h_change: 2.5,
        last_updated_at: Date.now() / 1000,
      },
      solana: {
        id: 'solana',
        usd: 100,
        usd_24h_change: -1.2,
        last_updated_at: Date.now() / 1000,
      },
    };
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default PriceService.getInstance(); 