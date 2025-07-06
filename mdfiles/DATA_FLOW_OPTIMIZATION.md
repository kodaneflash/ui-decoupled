# Data Flow Optimization Plan

## Current Issues

### 1. Excessive Re-calculations
- `generatePortfolioData()` called 7+ times per timeframe change
- Multiple identical API calls to PriceService
- Redundant portfolio history generation

### 2. Mixed Data Sources Creating Confusion
```typescript
// Current State:
// 1D: Live CoinGecko API data
// 1W/1M/1Y/ALL: Static HISTORICAL_PRICES
// Current Balance: Live prices
// Graph: Static HISTORICAL_BALANCES
```

### 3. Performance Impact
- Each timeframe change triggers full re-render cascade
- No memoization of expensive calculations
- Static data regenerated unnecessarily

## Proposed Solutions

### 1. Implement Calculation Memoization
```typescript
// In PriceContext
const memoizedCalculations = useMemo(() => {
  return {
    [timeframe]: calculatePortfolioChange(timeframe)
  };
}, [timeframe, prices]);
```

### 2. Centralize Data Source Strategy
```typescript
interface TimeframeDataStrategy {
  '1d': 'live-api';
  '1w': 'static-historical';
  '1m': 'static-historical';
  '1y': 'static-historical';
  'all': 'static-historical';
}
```

### 3. Add React.memo and useCallback Optimization
```typescript
// Prevent unnecessary re-renders
const OptimizedAssetRow = React.memo(AssetRow, (prev, next) => {
  return prev.timeframe === next.timeframe && 
         prev.asset.id === next.asset.id;
});
```

### 4. Implement Single Source of Truth Pattern
```typescript
// Unified portfolio calculation hook
const usePortfolioCalculation = (timeframe: string) => {
  return useMemo(() => {
    if (timeframe === '1d') {
      return calculateLivePortfolioChange();
    } else {
      return calculateStaticPortfolioChange(timeframe);
    }
  }, [timeframe]);
};
```


## Data Consistency Strategy

### Option A: All Static (Current Mixed Approach)
- Pros: Predictable, no API dependencies
- Cons: Not realistic, confusing mix of data sources

### Option B: All Live API
- Pros: Realistic, consistent data source
- Cons: Requires historical API data (expensive)

### Option C: Hybrid with Clear Boundaries
- 1D and 1W Live API (realistic recent changes)
- 1M+: Static historical (simulated long-term performance)
- Clear UI indicators showing data source type

## Recommended Implementation Order

2. **Add memoization** to expensive calculations
3. **Implement single data source per timeframe** 
4. **Add loading states** during calculations
5. **Optimize re-render cycles** with React.memo
6. **Add data source indicators** in UI

## Current Values Summary

### Live API Data (1D only)
- Bitcoin: $105,871 (-1.19% = -$106,275)
- Solana: $148.34 (-3.32% = -$31,868)
- **Total Portfolio**: $9,769,173 (-$138,144)

### Static Historical Data (1W/1M/1Y/ALL)
- Uses predefined price ranges
- 1W Bitcoin: $92k→$97k (+5.43%)
- 1W Solana: $220→$242 (+10%)
- Graph shows separate static balance history

### Asset Holdings (Fixed)
- Bitcoin: 83.5206 BTC (8.35B satoshis)
- Solana: 6,247.57 SOL (6.25T lamports) 