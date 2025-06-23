import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BigNumber } from 'bignumber.js';
import PriceService, { PriceData, SupportedCryptoId } from '../services/PriceService';

interface PriceContextType {
  prices: PriceData;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  getPrice: (cryptoId: SupportedCryptoId) => number;
  calculateFiatValue: (cryptoId: SupportedCryptoId, amount: BigNumber, decimals?: number) => BigNumber;
  get24hChange: (cryptoId: SupportedCryptoId) => number;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const priceData = await PriceService.fetchPrices();
      setPrices(priceData);
      setLastUpdated(new Date());
      console.log('[PriceContext] Prices updated:', priceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      console.error('[PriceContext] Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPrices = async () => {
    setLoading(true);
    await fetchPrices();
  };

  const getPrice = (cryptoId: SupportedCryptoId): number => {
    const coinGeckoId = cryptoId === 'bitcoin' ? 'bitcoin' : 'solana';
    return prices[coinGeckoId]?.usd || 0;
  };

  const calculateFiatValue = (
    cryptoId: SupportedCryptoId, 
    amount: BigNumber, 
    decimals: number = 8
  ): BigNumber => {
    const price = getPrice(cryptoId);
    if (price === 0) {
      return new BigNumber(0);
    }
    
    const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(decimals));
    return adjustedAmount.multipliedBy(price);
  };

  const get24hChange = (cryptoId: SupportedCryptoId): number => {
    const coinGeckoId = cryptoId === 'bitcoin' ? 'bitcoin' : 'solana';
    return prices[coinGeckoId]?.usd_24h_change || 0;
  };

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Set up interval for periodic updates
    const interval = setInterval(fetchPrices, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [refreshInterval]);

  const contextValue: PriceContextType = {
    prices,
    loading,
    error,
    lastUpdated,
    getPrice,
    calculateFiatValue,
    get24hChange,
    refreshPrices,
  };

  return (
    <PriceContext.Provider value={contextValue}>
      {children}
    </PriceContext.Provider>
  );
}; 