import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import PriceService, { PriceData, ValueChangeData, SupportedCryptoId } from '../services/PriceService';

interface PriceContextType {
  prices: PriceData;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  selectedTimeframe: string;
  calculateFiatValue: (cryptoId: SupportedCryptoId, amount: BigNumber, magnitude: number) => BigNumber;
  get24hChange: (cryptoId: SupportedCryptoId) => number;
  getValueChangeForTimeframe: (cryptoId: SupportedCryptoId, amount: BigNumber, timeframe: string, magnitude?: number) => Promise<ValueChangeData>;
  calculate24hValueChange: (cryptoId: SupportedCryptoId, amount: BigNumber, magnitude?: number) => Promise<ValueChangeData>;
  setSelectedTimeframe: (timeframe: string) => void;
  refreshPrices: () => Promise<void>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const usePriceContext = (): PriceContextType => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePriceContext must be used within a PriceProvider');
  }
  return context;
};

interface PriceProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
}

export const PriceProvider: React.FC<PriceProviderProps> = ({ 
  children, 
  refreshInterval = 60000 // 1 minute default
}) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState<boolean>(false); // Changed to false to prevent initial loading crash
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1w'); // Default to 1w
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchPrices = useCallback(async () => {
    try {
      console.log('[PriceContext] Fetching prices...');
      setLoading(true);
      setError(null);
      
      // Add timeout for network requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Network request timeout')), 10000);
      });

      const priceData = await Promise.race([
        PriceService.fetchPrices(),
        timeoutPromise
      ]);

      setPrices(priceData);
      setLastUpdate(new Date());
      setInitialized(true);
      
      console.log('[PriceContext] Prices updated:', priceData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch prices';
      console.error('[PriceContext] Error fetching prices:', errorMsg);
      setError(errorMsg);
      
      // Set fallback prices if this is the first load
      if (!initialized) {
        console.log('[PriceContext] Setting fallback prices for initial load');
        setPrices({
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
        });
        setInitialized(true);
      }
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // Delayed initial fetch to prevent startup crashes
  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      fetchPrices();
    }, 2000); // 2 second delay to let app fully initialize

    return () => clearTimeout(delayedFetch);
  }, [fetchPrices]);

  // Periodic refresh (only after initial load)
  useEffect(() => {
    if (refreshInterval <= 0 || !initialized) return;

    const interval = setInterval(fetchPrices, refreshInterval);
    console.log(`[PriceContext] Started price refresh interval: ${refreshInterval}ms`);
    
    return () => {
      clearInterval(interval);
      console.log('[PriceContext] Cleared price refresh interval');
    };
  }, [fetchPrices, refreshInterval, initialized]);

  const calculateFiatValue = useCallback((cryptoId: SupportedCryptoId, amount: BigNumber, magnitude: number): BigNumber => {
    const coinGeckoId = cryptoId;
    const price = prices[coinGeckoId]?.usd || 0;
    
    if (price === 0) {
      console.warn(`[PriceContext] No price available for ${cryptoId}`);
      return new BigNumber(0);
    }
    
    // Convert from smallest unit to main unit (e.g., satoshis to BTC)
    const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(magnitude));
    const fiatValue = adjustedAmount.multipliedBy(price);
    
    console.log(`[PriceContext] ${cryptoId} calculation:`, {
      amount: amount.toNumber(),
      adjustedAmount: adjustedAmount.toNumber(),
      price,
      fiatValue: fiatValue.toNumber(),
    });
    
    return fiatValue;
  }, [prices]);

  const get24hChange = (cryptoId: SupportedCryptoId): number => {
    const coinGeckoId = cryptoId;
    return prices[coinGeckoId]?.usd_24h_change || 0;
  };

  // New method: Get value change for any timeframe
  const getValueChangeForTimeframe = useCallback(async (
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    timeframe: string,
    magnitude: number = 8
  ): Promise<ValueChangeData> => {
    try {
      console.log(`[PriceContext] Getting ${timeframe} value change for ${cryptoId}:`, {
        amount: amount.toNumber(),
        timeframe,
        magnitude,
      });
      
      return await PriceService.getValueChangeForTimeframe(cryptoId, amount, timeframe, magnitude);
    } catch (error) {
      console.error(`[PriceContext] Error getting ${timeframe} value change for ${cryptoId}:`, error);
      return {
        value: 0,
        percentage: 0,
        absoluteValue: 0,
        priceStart: 0,
        priceEnd: 0,
      };
    }
  }, []);

  // New method: Get 24h value change with real API data
  const calculate24hValueChange = useCallback(async (
    cryptoId: SupportedCryptoId,
    amount: BigNumber,
    magnitude: number = 8
  ): Promise<ValueChangeData> => {
    try {
      console.log(`[PriceContext] Getting 24h value change for ${cryptoId}:`, {
        amount: amount.toNumber(),
        magnitude,
      });
      
      return await PriceService.calculate24hValueChange(cryptoId, amount, magnitude);
    } catch (error) {
      console.error(`[PriceContext] Error getting 24h value change for ${cryptoId}:`, error);
      return {
        value: 0,
        percentage: 0,
        absoluteValue: 0,
        priceStart: 0,
        priceEnd: 0,
      };
    }
  }, []);

  const handleSetSelectedTimeframe = useCallback((timeframe: string) => {
    console.log(`[PriceContext] Timeframe changed from ${selectedTimeframe} to ${timeframe}`);
    setSelectedTimeframe(timeframe);
  }, [selectedTimeframe]);

  const refreshPrices = useCallback(async () => {
    console.log('[PriceContext] Manual price refresh triggered');
    await fetchPrices();
  }, [fetchPrices]);

  const contextValue: PriceContextType = {
    prices,
    loading,
    error,
    lastUpdate,
    selectedTimeframe,
    calculateFiatValue,
    get24hChange,
    getValueChangeForTimeframe,
    calculate24hValueChange,
    setSelectedTimeframe: handleSetSelectedTimeframe,
    refreshPrices,
  };

  return (
    <PriceContext.Provider value={contextValue}>
      {children}
    </PriceContext.Provider>
  );
}; 