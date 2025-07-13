import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PORTFOLIO_DATA,
  CRYPTO_ASSETS,
  HISTORICAL_BALANCES,
  calculatePortfolioHistory,
  CryptoAsset,
} from '../constants/portfolioData';

// Storage key for persisting portfolio overrides
const PORTFOLIO_OVERRIDES_KEY = '@portfolio_overrides';

// Types for editable portfolio data
export interface EditableCryptoAsset extends CryptoAsset {
  // Allow editing of balance and amount
  balance: number;
  amount: string;
}

export interface EditablePortfolioData {
  // Base portfolio values
  totalBalance?: number;
  
  // Asset overrides
  cryptoAssets: EditableCryptoAsset[];
  
  // Historical data overrides (simplified for editor)
  historicalOverrides?: {
    [assetId: string]: {
      [timeRange: string]: number; // Multiplier for historical data (0.5 = 50% of original)
    };
  };
}

export interface Privacy {
  hasPassword: boolean;
  biometricsType?: string | null;
  biometricsEnabled: boolean;
}

export interface PortfolioDataContextValue {
  // Current portfolio data (merged static + overrides)
  portfolioData: EditablePortfolioData;
  
  // Editing state
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  
  // Privacy settings
  privacy: Privacy | null;
  setPrivacy: (privacy: Privacy) => void;
  
  // Actions
  setIsEditing: (editing: boolean) => void;
  updateAssetBalance: (assetId: string, balance: number) => void;
  updateHistoricalMultiplier: (assetId: string, timeRange: string, multiplier: number) => void;
  resetToDefaults: () => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  
  // Portfolio calculations (reactive)
  getPortfolioBalance: () => number;
  getPortfolioHistory: (range: string) => Array<{ date: Date; value: number }>;
  getPortfolioDelta: (range: string) => { value: number; percentage: number };
}

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);

// Default portfolio data from constants
const getDefaultPortfolioData = (): EditablePortfolioData => ({
  totalBalance: PORTFOLIO_DATA.totalBalance,
  cryptoAssets: CRYPTO_ASSETS.map(asset => ({ ...asset })),
  historicalOverrides: {},
});

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<EditablePortfolioData>(getDefaultPortfolioData());
  const [originalData, setOriginalData] = useState<EditablePortfolioData>(getDefaultPortfolioData());
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [privacy, setPrivacy] = useState<Privacy | null>(null);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(PORTFOLIO_OVERRIDES_KEY);
      if (storedData) {
        const overrides = JSON.parse(storedData) as EditablePortfolioData;
        const mergedData = mergeWithDefaults(overrides);
        setPortfolioData(mergedData);
        setOriginalData(mergedData);
      }
    } catch (error) {
      console.error('[PortfolioDataContext] Error loading persisted data:', error);
    }
  };

  const mergeWithDefaults = (overrides: Partial<EditablePortfolioData>): EditablePortfolioData => {
    const defaults = getDefaultPortfolioData();
    
    return {
      totalBalance: overrides.totalBalance ?? defaults.totalBalance,
      cryptoAssets: defaults.cryptoAssets.map(defaultAsset => {
        const override = overrides.cryptoAssets?.find(a => a.id === defaultAsset.id);
        return override ? { ...defaultAsset, ...override } : defaultAsset;
      }),
      historicalOverrides: overrides.historicalOverrides ?? {},
    };
  };

  const saveChanges = useCallback(async () => {
    try {
      // Only store the differences from defaults to keep storage minimal
      const overridesToStore: Partial<EditablePortfolioData> = {};
      const defaults = getDefaultPortfolioData();

      // Check for asset balance changes
      const changedAssets = portfolioData.cryptoAssets.filter(asset => {
        const defaultAsset = defaults.cryptoAssets.find(a => a.id === asset.id);
        return defaultAsset && (
          asset.balance !== defaultAsset.balance || 
          asset.amount !== defaultAsset.amount
        );
      });

      if (changedAssets.length > 0) {
        overridesToStore.cryptoAssets = changedAssets;
      }

      if (portfolioData.totalBalance !== defaults.totalBalance) {
        overridesToStore.totalBalance = portfolioData.totalBalance;
      }

      if (Object.keys(portfolioData.historicalOverrides || {}).length > 0) {
        overridesToStore.historicalOverrides = portfolioData.historicalOverrides;
      }

      await AsyncStorage.setItem(PORTFOLIO_OVERRIDES_KEY, JSON.stringify(overridesToStore));
      setOriginalData({ ...portfolioData });
      setHasUnsavedChanges(false);
      console.log('[PortfolioDataContext] Changes saved successfully');
    } catch (error) {
      console.error('[PortfolioDataContext] Error saving changes:', error);
      throw error;
    }
  }, [portfolioData]);

  const updateAssetBalance = useCallback((assetId: string, balance: number) => {
    setPortfolioData(prev => ({
      ...prev,
      cryptoAssets: prev.cryptoAssets.map(asset => 
        asset.id === assetId 
          ? { 
              ...asset, 
              balance,
              amount: (balance * Math.pow(10, asset.currency.units[0].magnitude)).toString()
            }
          : asset
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateHistoricalMultiplier = useCallback((assetId: string, timeRange: string, multiplier: number) => {
    setPortfolioData(prev => ({
      ...prev,
      historicalOverrides: {
        ...prev.historicalOverrides,
        [assetId]: {
          ...prev.historicalOverrides?.[assetId],
          [timeRange]: multiplier,
        },
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultPortfolioData();
    setPortfolioData(defaults);
    setHasUnsavedChanges(true);
  }, []);

  const discardChanges = useCallback(() => {
    setPortfolioData({ ...originalData });
    setHasUnsavedChanges(false);
  }, [originalData]);

  // Reactive calculations
  const getPortfolioBalance = useCallback((): number => {
    console.log('[PortfolioDataContext] getPortfolioBalance called');
    
    const totalBalance = portfolioData.cryptoAssets.reduce((total, asset) => {
      // For static UI, use the balance directly converted to fiat
      // In a real app, this would use live prices
      const estimatedFiatValue = asset.balance * (asset.id === 'bitcoin' ? 97000 : 240);
      
      console.log(`[PortfolioDataContext] Asset ${asset.id} balance:`, {
        balance: asset.balance,
        estimatedFiatValue,
        multiplier: asset.id === 'bitcoin' ? 97000 : 240,
      });
      
      return total + estimatedFiatValue;
    }, 0);
    
    console.log('[PortfolioDataContext] Total portfolio balance:', totalBalance);
    return totalBalance;
  }, [portfolioData.cryptoAssets]);

  const getPortfolioHistory = useCallback((range: string): Array<{ date: Date; value: number }> => {
    console.log(`[PortfolioDataContext] getPortfolioHistory called for range: ${range}`);
    
    // Generate modified historical data based on overrides
    const history = calculatePortfolioHistory(portfolioData.cryptoAssets, range);
    
    console.log(`[PortfolioDataContext] Generated ${history.length} history points for ${range}`);
    
    // Apply historical multipliers if any
    if (portfolioData.historicalOverrides) {
      const multiplier = getHistoricalMultiplier(range);
      console.log(`[PortfolioDataContext] Applying historical multiplier: ${multiplier} for ${range}`);
      
      const modifiedHistory = history.map(point => ({
        ...point,
        value: point.value * multiplier,
      }));
      
      console.log(`[PortfolioDataContext] Modified history sample:`, {
        original: history.slice(0, 3),
        modified: modifiedHistory.slice(0, 3),
        multiplier,
      });
      
      return modifiedHistory;
    }
    
    return history;
  }, [portfolioData]);

  const getHistoricalMultiplier = (range: string): number => {
    console.log(`[PortfolioDataContext] getHistoricalMultiplier called for range: ${range}`);
    
    // Calculate average multiplier across all assets for the given range
    const overrides = portfolioData.historicalOverrides || {};
    const multipliers: number[] = [];
    
    Object.entries(overrides).forEach(([assetId, assetOverrides]) => {
      if (assetOverrides[range]) {
        console.log(`[PortfolioDataContext] Found multiplier for ${assetId} ${range}:`, assetOverrides[range]);
        multipliers.push(assetOverrides[range]);
      }
    });
    
    const result = multipliers.length > 0 
      ? multipliers.reduce((sum, m) => sum + m, 0) / multipliers.length 
      : 1;
      
    console.log(`[PortfolioDataContext] Historical multiplier result:`, {
      range,
      multipliers,
      averageMultiplier: result,
    });
    
    return result;
  };

  const getPortfolioDelta = useCallback((range: string): { value: number; percentage: number } => {
    console.log(`[PortfolioDataContext] getPortfolioDelta called for range: ${range}`);
    
    const history = getPortfolioHistory(range);
    
    if (history.length === 0) {
      console.log(`[PortfolioDataContext] No history data for ${range}, returning zero delta`);
      return { value: 0, percentage: 0 };
    }
    
    console.log(`[PortfolioDataContext] Portfolio history analysis for ${range}:`, {
      totalPoints: history.length,
      firstPoint: history[0],
      lastPoint: history[history.length - 1],
      samplePoints: history.slice(0, 5),
    });
    
    // Find first significant (non-zero) balance
    const firstSignificantIndex = history.findIndex(b => b.value !== 0);
    const startValue = history[firstSignificantIndex]?.value || 0;
    const endValue = history[history.length - 1]?.value || 0;
    
    console.log(`[PortfolioDataContext] Value analysis for ${range}:`, {
      firstSignificantIndex,
      startValue,
      endValue,
      totalPoints: history.length,
    });
    
    if (startValue === 0) {
      console.log(`[PortfolioDataContext] Start value is zero for ${range}, returning zero delta`);
      return { value: 0, percentage: 0 };
    }
    
    const dollarChange = endValue - startValue;
    const percentageChange = dollarChange / startValue;
    
    console.log(`[PortfolioDataContext] Delta calculation for ${range}:`, {
      startValue,
      endValue,
      dollarChange,
      percentageChange,
      percentageAsPercent: (percentageChange * 100).toFixed(4) + '%',
      isChangeSmall: Math.abs(percentageChange) < 0.01,
      isChangeVerySmall: Math.abs(percentageChange) < 0.001,
    });
    
    console.log(`[getPortfolioDelta] Start: ${startValue}, End: ${endValue}, Change: ${dollarChange} (${(percentageChange * 100).toFixed(2)}%)`);
    
    return {
      value: dollarChange,
      percentage: percentageChange, // Already in 0-1 decimal format
    };
  }, [getPortfolioHistory]);

  const contextValue: PortfolioDataContextValue = {
    portfolioData,
    isEditing,
    hasUnsavedChanges,
    privacy,
    setPrivacy,
    setIsEditing,
    updateAssetBalance,
    updateHistoricalMultiplier,
    resetToDefaults,
    saveChanges,
    discardChanges,
    getPortfolioBalance,
    getPortfolioHistory,
    getPortfolioDelta,
  };

  return (
    <PortfolioDataContext.Provider value={contextValue}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = (): PortfolioDataContextValue => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};

export default PortfolioDataContext; 