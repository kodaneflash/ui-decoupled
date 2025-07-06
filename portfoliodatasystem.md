Read this analysis of my portfolio balance system for context, then think of the most efficient solution that follows best practices to replace the static historical data soures for the 1W, 1M, 1D timeframes that avoids hitting API limits such as caching mechanisms, etc. Currently, only the 1d timeframe uses live apidata in priceservice.ts.  Comprehensive Portfolio Balance System Analysis
1. Main Portfolio Balance Display (GraphCard.tsx)
The large 42px portfolio balance is controlled by this function:    Complete System Breakdown
1. Main Portfolio Balance (42px Display)
Location: GraphCard.tsx lines 344-364 const getDisplayValue = (): BigNumber => {
  if (hoveredItem && typeof hoveredItem.value === 'number') {
    // When hovering over chart, show historical data point
    return new BigNumber(hoveredItem.value);
  }
  
  // When not hovering, show current dynamic balance (live prices)
  if (!loading && !areAccountsEmpty) {
    return dynamicPortfolioBalance; // ← LIVE CALCULATION
  }
  
  // Fallback to historical data if dynamic calculation unavailable
  return new BigNumber(item?.value || 0);
}; Asset Addition - How All Assets Are Summed
Location: GraphCard.tsx lines 82-102 const calculatePortfolioBalance = (): BigNumber => {
  if (loading || areAccountsEmpty) return new BigNumber(0);

  let totalBalance = new BigNumber(0);

  CRYPTO_ASSETS.forEach(asset => {
    const cryptoId = asset.id as 'bitcoin' | 'solana';
    const magnitude = asset.currency.units[0].magnitude; // BTC=8, SOL=9
    const balance = new BigNumber(asset.amount); // Raw amount in satoshis/lamports
    
    // Convert to fiat using live API prices
    const fiatValue = calculateFiatValue(cryptoId, balance, magnitude);
    totalBalance = totalBalance.plus(fiatValue); // ← ADDITION HAPPENS HERE
  });

  return totalBalance;
}; Asset Data Structure:
Bitcoin: 83.5206 BTC (stored as 8352060000 satoshis)
Solana: 6,247.57 SOL (stored as 6247570000000 lamports)
3. Live Price Calculation
Location: PriceContext.tsx - uses PriceService.tsconst calculateFiatValue = (cryptoId: SupportedCryptoId, amount: BigNumber, magnitude: number): BigNumber => {
  const price = prices[cryptoId]?.usd || 0; // ← LIVE PRICE FROM COINGECKO
  
  // Convert from smallest unit to main unit (satoshis→BTC, lamports→SOL)
  const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(magnitude));
  const fiatValue = adjustedAmount.multipliedBy(price);
  
  return fiatValue;
};  Percentage Arrow Control
Location: Delta.tsx lines 55-61 
  Historical Data Sources
Different Timeframes:
1D: 24 hourly data points with realistic volatility
1W: 168 hourly data points with weekly trends
1M: 30 daily data points with monthly growth
1Y: 52 weekly data points with yearly bull/bear cycles
ALL: 104 weekly data points with multi-year trends
Data Generation Example (Bitcoin 1D):  const calculatePortfolioBalance = (): BigNumber => {
  if (loading || areAccountsEmpty) return new BigNumber(0);

  let totalBalance = new BigNumber(0);

  CRYPTO_ASSETS.forEach(asset => {
    const cryptoId = asset.id as 'bitcoin' | 'solana';
    const magnitude = asset.currency.units[0].magnitude; // BTC=8, SOL=9
    const balance = new BigNumber(asset.amount); // Raw amount in satoshis/lamports
    
    // Convert to fiat using live API prices
    const fiatValue = calculateFiatValue(cryptoId, balance, magnitude);
    totalBalance = totalBalance.plus(fiatValue); // ← ADDITION HAPPENS HERE
  });

  return totalBalance;
};   1D Timeframe - Live API Data
Location: PriceService.ts lines 139-180  const calculateFiatValue = (cryptoId: SupportedCryptoId, amount: BigNumber, magnitude: number): BigNumber => {
  const price = prices[cryptoId]?.usd || 0; // ← LIVE PRICE FROM COINGECKO
  
  // Convert from smallest unit to main unit (satoshis→BTC, lamports→SOL)
  const adjustedAmount = amount.dividedBy(new BigNumber(10).pow(magnitude));
  const fiatValue = adjustedAmount.multipliedBy(price);
  
  return fiatValue;
};  Data Flow Summary
Main Balance Calculation:
User sees: Large 42px portfolio balance
Powered by: getDisplayValue() → calculatePortfolioBalance()
Process: Loops through BTC + SOL → Gets live prices → Converts to USD → Sums total
Percentage Arrow:
User sees: Green/red arrow with percentage
Powered by: calculatePortfolioChange() → getValueChangeForTimeframe()
Process: Calculates change per asset → Sums changes → Calculates total percentage
Timeframe Switching:
User clicks: 1D, 1W, 1M, 1Y, ALL tabs
Triggers: updateTimeRange() → setSelectedTimeframe()
Updates: Portfolio balance, percentage arrow, chart data all recalculate  Data Sources:
1D: Live CoinGecko API with real-time prices
Other timeframes: Static but realistic historical data with market patterns
Chart: Historical balance arrays with proper date/value pairs
Assets: Fixed amounts (83.5206 BTC, 6,247.57 SOL) with dynamic pricing
This system provides a hybrid approach - live data for current/24h views and realistic static data for historical timeframes, creating a smooth user experience that closely mimics real Ledger Live behavior.  