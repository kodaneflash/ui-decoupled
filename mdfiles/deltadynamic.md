# Portfolio Delta Calculation Analysis - Ledger Live Mobile

## Overview

This document analyzes how the official Ledger Live mobile app calculates and displays portfolio percentage gain/loss (delta) over selected timeframes like '1Y' or 'All'. The analysis focuses on understanding the calculation logic, data flow, and component architecture to replicate this functionality with static data.

## Key Findings

### 🏗️ Architecture Pattern

Ledger Live uses a **calculation-at-data-layer** architecture where:
- **Display components** (Delta, AssetRowLayout, GraphCard) receive pre-calculated values
- **Business logic hooks** (`usePortfolio`, `useDistribution`) perform calculations
- **Data structures** (`ValueChange`, `Portfolio`) standardize the interface

### 📊 Delta Calculation Method

Ledger Live calculates portfolio delta using **historical balance snapshots**, not daily percentage tracking:

1. **Historical Balance Collection**: For each asset, collect balance history at specific intervals
2. **Fiat Conversion**: Convert crypto balances to fiat using historical exchange rates  
3. **Portfolio Aggregation**: Sum all fiat values across assets for each time point
4. **Delta Computation**: Calculate percentage change from first significant balance to current

---

## Component Analysis

### 1. Delta.tsx - Display Component

**Purpose**: Renders delta values with colors, arrows, and formatting

**Key Properties**:
```typescript
interface ValueChange {
  percentage: number | null | undefined; // 0-1 decimal format (not 0-100)
  value: number; // Dollar amount change
}
```

**Rendering Logic**:
- Multiplies `percentage` by 100 for display: `percentage * 100 → "25%"`
- Uses semantic colors: `success.c50` (green) for positive, `error.c50` (red) for negative
- Shows arrows for percentage view, parentheses for absolute value view
- Handles edge cases: zero delta, null/undefined values

**Key Insight**: Delta is purely presentational - receives pre-calculated `ValueChange` objects.

### 2. AssetRowLayout.tsx & GraphCard.tsx - Container Components

**Purpose**: Display individual assets and portfolio overview with delta

**Delta Integration**:
```typescript
// AssetRowLayout - per asset
<Delta
  percent
  show0Delta={balance.toNumber() !== 0}
  fallbackToPercentPlaceholder
  valueChange={countervalueChange} // Pre-calculated ValueChange
/>

// GraphCard - portfolio level  
<Delta
  percent
  show0Delta
  valueChange={portfolio.countervalueChange} // Portfolio-level ValueChange
/>
```

**Key Insight**: Both components consume `ValueChange` objects but don't perform calculations.

### 3. CounterValue.tsx - Currency Conversion

**Purpose**: Converts crypto amounts to fiat using live exchange rates

**Delta Relationship**: Provides current fiat values, but historical delta calculation happens elsewhere.

**Key Hook**: `useCalculate` from `@ledgerhq/live-countervalues-react`

### 4. PortfolioAssets.tsx - Data Orchestration

**Purpose**: Coordinates asset distribution and portfolio data

**Key Hook**: `useDistribution` - aggregates account data and provides asset-level information
```typescript
const distribution = useDistribution({
  showEmptyAccounts: true,
  hideEmptyTokenAccount,
});
```

**Data Structure**:
```typescript
type AssetsDistribution = {
  list: DistributionItem[]; // Each item has countervalue, currency, accounts
  sum: number; // Total portfolio value
  isAvailable: boolean;
}
```

---

## Core Calculation Logic

### Time Range Configuration

Different timeframes use different data granularities:

```typescript
const ranges: Record<PortfolioRange, PortfolioRangeConfig> = {
  day: {
    count: 24,              // 24 data points
    increment: hourIncrement, // 1 hour intervals
    granularityId: "HOUR",
  },
  week: {
    count: 7 * 24,          // 168 data points  
    increment: hourIncrement, // 1 hour intervals
    granularityId: "HOUR",
  },
  month: {
    count: 30,              // 30 data points
    increment: dayIncrement, // 1 day intervals
    granularityId: "DAY",
  },
  year: {
    count: 52,              // 52 data points
    increment: weekIncrement, // 1 week intervals  
    granularityId: "WEEK",
  },
  all: {
    increment: weekIncrement, // 1 week intervals
    granularityId: "WEEK",   // Count calculated from account creation date
  },
};
```

### Portfolio Delta Algorithm

The core calculation happens in `getPortfolio()` function:

#### Step 1: Collect Historical Balances

For each account:
```typescript
// Get account's balance history based on timeframe
const balanceHistory = getBalanceHistory(account, range, count);
// Convert to fiat using historical exchange rates
const countervalues = calculateMany(cvState, balanceHistory, {
  from: currency,
  to: fiatCurrency,
});
```

#### Step 2: Aggregate Portfolio History

Sum all accounts' fiat values for each time point:
```typescript
const balanceHistory = getDates(range, count).map((date, i) => ({
  date,
  value: histories.reduce((sum, h) => sum + (h[i]?.countervalue ?? 0), 0),
}));
```

#### Step 3: Calculate Delta

```typescript
// Find first non-zero balance point
const firstSignificantIndex = balanceHistory.findIndex(b => b.value !== 0);
const firstValue = balanceHistory[firstSignificantIndex]?.value ?? 0;

// Calculate total change across all accounts
const totalChangeValue = availableAccounts.reduce((sum, account) => {
  const accountChange = account.changes(firstSignificantIndex);
  return sum + accountChange.countervalueChange.value;
}, 0);

// Calculate percentage
const percentage = meaningfulPercentage(totalChangeValue, firstValue);

return {
  countervalueChange: {
    value: totalChangeValue,    // Dollar amount change
    percentage: percentage,     // Decimal percentage (0.25 = 25%)
  }
};
```

#### Step 4: ROI vs Market Change

Ledger Live has two calculation modes:

**Traditional (Default)**:
```typescript
// Use historical balance as denominator
const balanceDivider = firstSignificantHistoryValue;
```

**Experimental ROI Calculation**:
```typescript
// Use money actually invested (receives) as denominator
const balanceDivider = countervalueReceiveSum === 0
  ? firstSignificantHistoryValue + countervalueSendSum  
  : countervalueReceiveSum;
```

---

## Data Structures

### ValueChange Type

Core interface for all delta displays:
```typescript
export type ValueChange = {
  percentage: number | null | undefined; // 0-1 decimal format
  value: number; // Dollar amount change
};
```

### Portfolio Type

Main data structure passed to GraphCard:
```typescript
export type Portfolio = {
  balanceHistory: BalanceHistory;           // Historical balance points
  balanceAvailable: boolean;                // Data availability flag
  availableAccounts: AccountLike[];         // Accounts with data
  range: PortfolioRange;                    // Selected timeframe
  countervalueChange: ValueChange;          // Portfolio-level delta
  // ... other fields
};
```

### DistributionItem Type

Individual asset data from useDistribution:
```typescript
export type DistributionItem = {
  currency: CryptoCurrency | TokenCurrency;
  distribution: number;      // % of total portfolio (0-1)
  accounts: AccountLike[];   // Associated accounts
  amount: number;           // Crypto amount
  countervalue?: number;    // Fiat value
};
```

---

## Implementation Strategy for Static Data

### 1. Historical Balance Structure

Create time-series data for each supported cryptocurrency:

```typescript
// Enhanced portfolioData.ts structure
export const HISTORICAL_BALANCES = {
  bitcoin: {
    '1d': [
      { date: new Date('2024-01-01T00:00:00Z'), cryptoAmount: 1.5, fiatValue: 65000 },
      { date: new Date('2024-01-01T01:00:00Z'), cryptoAmount: 1.5, fiatValue: 65100 },
      // ... 24 hourly points
    ],
    '1w': [
      { date: new Date('2024-01-01T00:00:00Z'), cryptoAmount: 1.5, fiatValue: 65000 },
      { date: new Date('2024-01-01T01:00:00Z'), cryptoAmount: 1.5, fiatValue: 65100 },
      // ... 168 hourly points  
    ],
    '1m': [
      { date: new Date('2024-01-01'), cryptoAmount: 1.5, fiatValue: 65000 },
      { date: new Date('2024-01-02'), cryptoAmount: 1.5, fiatValue: 64800 },
      // ... 30 daily points
    ],
    '1y': [
      { date: new Date('2024-01-01'), cryptoAmount: 1.5, fiatValue: 65000 },
      { date: new Date('2024-01-08'), cryptoAmount: 1.5, fiatValue: 67200 },
      // ... 52 weekly points
    ],
    'all': [
      { date: new Date('2023-01-01'), cryptoAmount: 1.5, fiatValue: 16000 },
      { date: new Date('2023-01-08'), cryptoAmount: 1.5, fiatValue: 17200 },
      // ... variable weekly points from account creation
    ]
  },
  solana: {
    // Similar structure for SOL
  }
};
```

### 2. Portfolio Aggregation Function

Calculate portfolio-level historical balances:

```typescript
export function calculatePortfolioHistory(
  assets: CryptoAsset[],
  range: PortfolioRange
): BalanceHistory {
  const allHistories = assets.map(asset => 
    HISTORICAL_BALANCES[asset.id][range] || []
  );
  
  // Get unique dates and aggregate fiat values
  const dates = [...new Set(allHistories.flat().map(h => h.date.getTime()))]
    .sort()
    .map(timestamp => new Date(timestamp));
    
  return dates.map(date => ({
    date,
    value: allHistories.reduce((sum, history) => {
      const point = history.find(h => h.date.getTime() === date.getTime());
      return sum + (point?.fiatValue || 0);
    }, 0)
  }));
}
```

### 3. Delta Calculation Function

Replicate Ledger Live's delta calculation:

```typescript
export function calculatePortfolioDelta(
  balanceHistory: BalanceHistory
): ValueChange {
  if (balanceHistory.length === 0) {
    return { value: 0, percentage: 0 };
  }
  
  // Find first significant (non-zero) balance
  const firstSignificantIndex = balanceHistory.findIndex(b => b.value !== 0);
  const startValue = balanceHistory[firstSignificantIndex]?.value || 0;
  const endValue = balanceHistory[balanceHistory.length - 1]?.value || 0;
  
  const dollarChange = endValue - startValue;
  const percentageChange = startValue !== 0 ? dollarChange / startValue : 0;
  
  return {
    value: dollarChange,
    percentage: percentageChange, // Already in 0-1 decimal format
  };
}
```

### 4. Asset-Level Delta Function

Calculate individual asset deltas:

```typescript
export function calculateAssetDelta(
  asset: CryptoAsset,
  range: PortfolioRange
): ValueChange {
  const history = HISTORICAL_BALANCES[asset.id][range];
  if (!history || history.length === 0) {
    return { value: 0, percentage: 0 };
  }
  
  const startValue = history[0].fiatValue;
  const endValue = history[history.length - 1].fiatValue;
  const dollarChange = endValue - startValue;
  const percentageChange = startValue !== 0 ? dollarChange / startValue : 0;
  
  return {
    value: dollarChange,
    percentage: percentageChange,
  };
}
```

### 5. Integration with Existing Components

Update the portfolio data generation:

```typescript
// Enhanced portfolioData.ts
export function generatePortfolioData(range: PortfolioRange = '1w'): Portfolio {
  const balanceHistory = calculatePortfolioHistory(CRYPTO_ASSETS, range);
  const countervalueChange = calculatePortfolioDelta(balanceHistory);
  
  return {
    balanceHistory,
    balanceAvailable: true,
    range,
    countervalueChange,
    // ... other required fields
  };
}

// Enhanced crypto assets with delta
export function generateCryptoAssetsWithDelta(range: PortfolioRange = '1w') {
  return CRYPTO_ASSETS.map(asset => ({
    ...asset,
    countervalueChange: calculateAssetDelta(asset, range),
  }));
}
```

---

## Key Implementation Notes

### ✅ Delta Format Consistency

- **Storage**: Use decimal format (0.25 for 25%)
- **Display**: Delta component multiplies by 100 automatically
- **Colors**: Use exact Ledger Live semantic tokens (`success.c50`, `error.c50`)

### ✅ Data Point Requirements

- **1D**: 24 hourly points
- **1W**: 168 hourly points (7 * 24)
- **1M**: 30 daily points
- **1Y**: 52 weekly points
- **ALL**: Variable weekly points from "account creation" date

### ✅ Calculation Accuracy

- Find **first significant** (non-zero) balance as baseline
- Handle edge cases: empty portfolios, zero balances, missing data
- Use same `meaningfulPercentage` logic as Ledger Live (cap at 100,000% threshold)

### ✅ Performance Considerations

- Pre-calculate historical data (don't compute on every render)
- Use `React.memo` for Delta and AssetRowLayout components
- Implement data caching for expensive calculations

---

## Testing Strategy

### Unit Tests

```typescript
describe('Portfolio Delta Calculations', () => {
  test('calculates correct percentage for positive change', () => {
    const history = [
      { date: new Date('2024-01-01'), value: 1000 },
      { date: new Date('2024-01-02'), value: 1250 },
    ];
    const delta = calculatePortfolioDelta(history);
    expect(delta.percentage).toBe(0.25); // 25%
    expect(delta.value).toBe(250);
  });
  
  test('handles zero starting balance', () => {
    const history = [
      { date: new Date('2024-01-01'), value: 0 },
      { date: new Date('2024-01-02'), value: 1000 },
    ];
    const delta = calculatePortfolioDelta(history);
    expect(delta.percentage).toBe(0); // Avoid divide by zero
  });
});
```

### Integration Tests

Test complete data flow from static data to rendered components, ensuring deltas match expected calculations and display formats.

---

## Conclusion

Ledger Live's delta calculation system is sophisticated but reproducible:

1. **Time-based Balance Snapshots**: Historical crypto balances converted to fiat
2. **Portfolio Aggregation**: Sum all assets' fiat values per time point  
3. **First-Significant-Balance Baseline**: Calculate change from first non-zero portfolio value
4. **Component Separation**: Business logic in hooks, presentation in components
5. **Standardized Interface**: `ValueChange` objects ensure consistency

The static implementation strategy focuses on pre-calculating realistic historical data and replicating the exact calculation algorithms, ensuring pixel-perfect visual fidelity while maintaining clean, maintainable code architecture. 