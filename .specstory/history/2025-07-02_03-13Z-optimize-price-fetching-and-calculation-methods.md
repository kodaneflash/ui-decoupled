<!-- Generated by SpecStory -->

# Optimize price fetching and calculation methods (2025-07-02 03:13Z)

_**User**_

Go with  option C in. @DATA_FLOW_OPTIMIZATION.md   aswell as fix the static pPlease analyze the current calculation and fetching methods for the 1d, 1w, 1m, 1y, and all timeframes prices. If static data is being used, replace it with dynamic fetching of the 1d, 1w, 1m, 1y prices, considering the quantity of the held asset (e.g., bitcoin 83.5206 sol 6247.57). Identify any rate limiting by checking the xcode build logs, and if present, implement workaround mechanisms that prioritize real market data for realism. This may involve implementing multiple API providers to avoid using static fallback values.  @DATA_FLOW_OPTIMIZATION.md   CLIENT OF UIKIT REQUIRES UPDATE: This process does not adopt UIScene lifecycle. This will become an assert in a future version.
Running application UIReplicationLedger ({
    initialProps =     {
    };
    rootTag = 1;
})
ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.
Unbalanced calls start/end for tag 19
Running "UIReplicationLedger
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'AssetsListView rendering with assets:', 2, 'estimated height:', 160
'[AssetRow] Using 1w data for bitcoin:', { value: 440502.58, percentage: 0.0543 }
'[AssetRow] Using 1w data for solana:', { value: 137447.54, percentage: 0.1 }
[GraphCard] Updating portfolio change for timeframe: 1w
[AssetRowLayout] Using static data for bitcoin - not supported or loading
[AssetRowLayout] Using static data for solana - not supported or loading
[PriceContext] Fetching prices...
'[PriceService] Fetching prices from:', 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true'
[PriceContext] Started price refresh interval: 60000ms
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
Unrecognized font family 'Inter-Medium'
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
'AssetsListView layout:', { width: 361, height: 160, totalHeight: 160, assetsCount: 2 }
'[PriceService] Fetched prices:', { bitcoin: 
   { id: 'bitcoin',
     usd: 105956,
     usd_24h_change: -1.106615726247092,
     last_updated_at: 1751425927 },
  solana: 
   { id: 'solana',
     usd: 148.46,
     usd_24h_change: -3.216420274696215,
     last_updated_at: 1751425929 } }
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
[GraphCard] Updating portfolio change for timeframe: 1w
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] Prices updated:', { bitcoin: 
   { id: 'bitcoin',
     usd: 105956,
     usd_24h_change: -1.106615726247092,
     last_updated_at: 1751425927 },
  solana: 
   { id: 'solana',
     usd: 148.46,
     usd_24h_change: -3.216420274696215,
     last_updated_at: 1751425929 } }
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
[GraphCard] Updating portfolio change for timeframe: 1w
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] Getting 1w value change for bitcoin:', { amount: 8352060000, timeframe: '1w', magnitude: 8 }
'[PriceService] 1w change for bitcoin:', { amount: 83.5206,
  priceStart: 92000,
  priceEnd: 97000,
  startValue: 7683895.2,
  endValue: 8101498.2,
  valueChange: 417603,
  changePercent: 5.43 }
'[AssetRowLayout] Calculating 1w change for bitcoin:', { balance: 8352060000, timeframe: '1w' }
'[PriceContext] Getting 1w value change for bitcoin:', { amount: 8352060000, timeframe: '1w', magnitude: 8 }
'[PriceService] 1w change for bitcoin:', { amount: 83.5206,
  priceStart: 92000,
  priceEnd: 97000,
  startValue: 7683895.2,
  endValue: 8101498.2,
  valueChange: 417603,
  changePercent: 5.43 }
'[AssetRowLayout] Calculating 1w change for solana:', { balance: 6247570000000, timeframe: '1w' }
'[PriceContext] Getting 1w value change for solana:', { amount: 6247570000000, timeframe: '1w', magnitude: 9 }
'[PriceService] 1w change for solana:', { amount: 6247.57,
  priceStart: 220,
  priceEnd: 242,
  startValue: 1374465.4,
  endValue: 1511911.94,
  valueChange: 137446.54,
  changePercent: 10 }
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] 1w change for bitcoin:', { currentValue: 8849508.6936,
  valueChange: 417603,
  percentage: 0.054299999999999994 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceContext] Getting 1w value change for solana:', { amount: 6247570000000, timeframe: '1w', magnitude: 9 }
'[PriceService] 1w change for solana:', { amount: 6247.57,
  priceStart: 220,
  priceEnd: 242,
  startValue: 1374465.4,
  endValue: 1511911.94,
  valueChange: 137446.54,
  changePercent: 10 }
'[AssetRowLayout] 1w change result for bitcoin:', { value: 417603,
  percentage: 0.054299999999999994,
  absoluteValue: 417603,
  priceStart: 92000,
  priceEnd: 97000 }
'[AssetRowLayout] 1w change result for solana:', { value: 137446.54,
  percentage: 0.1,
  absoluteValue: 137446.54,
  priceStart: 220,
  priceEnd: 242 }
'[GraphCard] 1w change for solana:', { currentValue: 927514.2422,
  valueChange: 137446.54,
  percentage: 0.1 }
'[GraphCard] Portfolio 1w change:', { totalCurrentValue: 9777022.9358,
  totalChange: 555049.54,
  changePercentage: 0.056770812919708404 }
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
Unrecognized font family 'Inter-Medium'
Unrecognized font family 'Inter-Medium'
'[GraphCard] Time range clicked:', '1D', '1d'
[PriceContext] Timeframe changed from 1w to 1d
[generatePortfolioData] Generating portfolio data for range: 1d
[calculatePortfolioHistory] Generating data for range: 1d
[calculatePortfolioHistory] Found 24 points for bitcoin 1d
[calculatePortfolioHistory] Found 24 points for solana 1d
[calculatePortfolioHistory] Created 24 unified timeline points
[calculatePortfolioHistory] Generated 24 portfolio points
[calculatePortfolioHistory] Value range: 9542535.476406466 - 9821812.378680814
[calculatePortfolioDelta] Start: 9566571.191637725, End: 9630729.194842251, Change: 64158.00320452638 (0.67%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[AssetRow] Using 1d data for bitcoin:', { value: 152817.67, percentage: 0.0189 }
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[AssetRow] Using 1d data for solana:', { value: 24990.28, percentage: 0.0168 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
[GraphCard] Updating portfolio change for timeframe: 1d
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] Getting 1d value change for bitcoin:', { amount: 8352060000, timeframe: '1d', magnitude: 8 }
'[AssetRowLayout] Calculating 1d change for bitcoin:', { balance: 8352060000, timeframe: '1d' }
'[PriceContext] Getting 1d value change for bitcoin:', { amount: 8352060000, timeframe: '1d', magnitude: 8 }
'[AssetRowLayout] Calculating 1d change for solana:', { balance: 6247570000000, timeframe: '1d' }
'[PriceContext] Getting 1d value change for solana:', { amount: 6247570000000, timeframe: '1d', magnitude: 9 }
[generatePortfolioData] Generating portfolio data for range: 1d
[calculatePortfolioHistory] Generating data for range: 1d
[calculatePortfolioHistory] Found 24 points for bitcoin 1d
[calculatePortfolioHistory] Found 24 points for solana 1d
[calculatePortfolioHistory] Created 24 unified timeline points
[calculatePortfolioHistory] Generated 24 portfolio points
[calculatePortfolioHistory] Value range: 9542535.476406466 - 9821812.378680814
[calculatePortfolioDelta] Start: 9566571.191637725, End: 9630729.194842251, Change: 64158.00320452638 (0.67%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceService] 24h change for bitcoin:', { amount: 83.5206,
  currentPrice: 105956,
  previousPrice: 107141.6463073977,
  currentValue: 8849508.6936,
  previousValue: 8948534.58458164,
  valueChange: -99025.89098164035,
  changePercent: -1.106615726247092 }
'[PriceService] 24h change for bitcoin:', { amount: 83.5206,
  currentPrice: 105956,
  previousPrice: 107141.6463073977,
  currentValue: 8849508.6936,
  previousValue: 8948534.58458164,
  valueChange: -99025.89098164035,
  changePercent: -1.106615726247092 }
'[PriceService] 24h change for solana:', { amount: 6247.57,
  currentPrice: 148.46,
  previousPrice: 153.3937889271785,
  currentValue: 927514.2422,
  previousValue: 958338.4338877726,
  valueChange: -30824.19168777258,
  changePercent: -3.216420274696215 }
'[GraphCard] 1d change for bitcoin:', { currentValue: 8849508.6936,
  valueChange: -99025.89098164035,
  percentage: -0.01106615726247092 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceContext] Getting 1d value change for solana:', { amount: 6247570000000, timeframe: '1d', magnitude: 9 }
'[AssetRowLayout] 1d change result for bitcoin:', { value: -99025.89098164035,
  percentage: -0.01106615726247092,
  absoluteValue: 99025.89098164035,
  priceStart: 107141.6463073977,
  priceEnd: 105956 }
'[AssetRowLayout] 1d change result for solana:', { value: -30824.19168777258,
  percentage: -0.03216420274696215,
  absoluteValue: 30824.19168777258,
  priceStart: 153.3937889271785,
  priceEnd: 148.46 }
'[PriceService] 24h change for solana:', { amount: 6247.57,
  currentPrice: 148.46,
  previousPrice: 153.3937889271785,
  currentValue: 927514.2422,
  previousValue: 958338.4338877726,
  valueChange: -30824.19168777258,
  changePercent: -3.216420274696215 }
'[GraphCard] 1d change for solana:', { currentValue: 927514.2422,
  valueChange: -30824.19168777258,
  percentage: -0.03216420274696215 }
'[GraphCard] Portfolio 1d change:', { totalCurrentValue: 9777022.9358,
  totalChange: -129850.08266941294,
  changePercentage: -0.013281147392418181 }
[generatePortfolioData] Generating portfolio data for range: 1d
[calculatePortfolioHistory] Generating data for range: 1d
[calculatePortfolioHistory] Found 24 points for bitcoin 1d
[calculatePortfolioHistory] Found 24 points for solana 1d
[calculatePortfolioHistory] Created 24 unified timeline points
[calculatePortfolioHistory] Generated 24 portfolio points
[calculatePortfolioHistory] Value range: 9542535.476406466 - 9821812.378680814
[calculatePortfolioDelta] Start: 9566571.191637725, End: 9630729.194842251, Change: 64158.00320452638 (0.67%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] Time range clicked:', '1W', '1w'
[PriceContext] Timeframe changed from 1d to 1w
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[AssetRow] Using 1w data for bitcoin:', { value: 440502.58, percentage: 0.0543 }
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[AssetRow] Using 1w data for solana:', { value: 137447.54, percentage: 0.1 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
[GraphCard] Updating portfolio change for timeframe: 1w
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] Getting 1w value change for bitcoin:', { amount: 8352060000, timeframe: '1w', magnitude: 8 }
'[PriceService] 1w change for bitcoin:', { amount: 83.5206,
  priceStart: 92000,
  priceEnd: 97000,
  startValue: 7683895.2,
  endValue: 8101498.2,
  valueChange: 417603,
  changePercent: 5.43 }
'[AssetRowLayout] Calculating 1w change for bitcoin:', { balance: 8352060000, timeframe: '1w' }
'[PriceContext] Getting 1w value change for bitcoin:', { amount: 8352060000, timeframe: '1w', magnitude: 8 }
'[PriceService] 1w change for bitcoin:', { amount: 83.5206,
  priceStart: 92000,
  priceEnd: 97000,
  startValue: 7683895.2,
  endValue: 8101498.2,
  valueChange: 417603,
  changePercent: 5.43 }
'[AssetRowLayout] Calculating 1w change for solana:', { balance: 6247570000000, timeframe: '1w' }
'[PriceContext] Getting 1w value change for solana:', { amount: 6247570000000, timeframe: '1w', magnitude: 9 }
'[PriceService] 1w change for solana:', { amount: 6247.57,
  priceStart: 220,
  priceEnd: 242,
  startValue: 1374465.4,
  endValue: 1511911.94,
  valueChange: 137446.54,
  changePercent: 10 }
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] 1w change for bitcoin:', { currentValue: 8849508.6936,
  valueChange: 417603,
  percentage: 0.054299999999999994 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceContext] Getting 1w value change for solana:', { amount: 6247570000000, timeframe: '1w', magnitude: 9 }
'[PriceService] 1w change for solana:', { amount: 6247.57,
  priceStart: 220,
  priceEnd: 242,
  startValue: 1374465.4,
  endValue: 1511911.94,
  valueChange: 137446.54,
  changePercent: 10 }
'[AssetRowLayout] 1w change result for bitcoin:', { value: 417603,
  percentage: 0.054299999999999994,
  absoluteValue: 417603,
  priceStart: 92000,
  priceEnd: 97000 }
'[AssetRowLayout] 1w change result for solana:', { value: 137446.54,
  percentage: 0.1,
  absoluteValue: 137446.54,
  priceStart: 220,
  priceEnd: 242 }
'[GraphCard] 1w change for solana:', { currentValue: 927514.2422,
  valueChange: 137446.54,
  percentage: 0.1 }
'[GraphCard] Portfolio 1w change:', { totalCurrentValue: 9777022.9358,
  totalChange: 555049.54,
  changePercentage: 0.056770812919708404 }
[generatePortfolioData] Generating portfolio data for range: 1w
[calculatePortfolioHistory] Generating data for range: 1w
[calculatePortfolioHistory] Found 168 points for bitcoin 1w
[calculatePortfolioHistory] Found 168 points for solana 1w
[calculatePortfolioHistory] Created 168 unified timeline points
[calculatePortfolioHistory] Generated 168 portfolio points
[calculatePortfolioHistory] Value range: 9085568.652024796 - 9815396.431862535
[calculatePortfolioDelta] Start: 9313845.678851916, End: 9710711.563421505, Change: 396865.88456958905 (4.26%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] Time range clicked:', '1M', '1m'
[PriceContext] Timeframe changed from 1w to 1m
[generatePortfolioData] Generating portfolio data for range: 1m
[calculatePortfolioHistory] Generating data for range: 1m
[calculatePortfolioHistory] Found 30 points for bitcoin 1m
[calculatePortfolioHistory] Found 30 points for solana 1m
[calculatePortfolioHistory] Created 30 unified timeline points
[calculatePortfolioHistory] Generated 30 portfolio points
[calculatePortfolioHistory] Value range: 8192968.281582524 - 9522117.123781772
[calculatePortfolioDelta] Start: 8192968.281582524, End: 9522117.123781772, Change: 1329148.8421992483 (16.22%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[AssetRow] Using 1m data for bitcoin:', { value: 1002247.2, percentage: 0.1412 }
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[AssetRow] Using 1m data for solana:', { value: 387349.34, percentage: 0.3444 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
[GraphCard] Updating portfolio change for timeframe: 1m
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] Getting 1m value change for bitcoin:', { amount: 8352060000, timeframe: '1m', magnitude: 8 }
'[PriceService] 1m change for bitcoin:', { amount: 83.5206,
  priceStart: 85000,
  priceEnd: 97000,
  startValue: 7099251,
  endValue: 8101498.2,
  valueChange: 1002247.2,
  changePercent: 14.12 }
'[AssetRowLayout] Calculating 1m change for bitcoin:', { balance: 8352060000, timeframe: '1m' }
'[PriceContext] Getting 1m value change for bitcoin:', { amount: 8352060000, timeframe: '1m', magnitude: 8 }
'[PriceService] 1m change for bitcoin:', { amount: 83.5206,
  priceStart: 85000,
  priceEnd: 97000,
  startValue: 7099251,
  endValue: 8101498.2,
  valueChange: 1002247.2,
  changePercent: 14.12 }
'[AssetRowLayout] Calculating 1m change for solana:', { balance: 6247570000000, timeframe: '1m' }
'[PriceContext] Getting 1m value change for solana:', { amount: 6247570000000, timeframe: '1m', magnitude: 9 }
'[PriceService] 1m change for solana:', { amount: 6247.57,
  priceStart: 180,
  priceEnd: 242,
  startValue: 1124562.6,
  endValue: 1511911.94,
  valueChange: 387349.34,
  changePercent: 34.44 }
[generatePortfolioData] Generating portfolio data for range: 1m
[calculatePortfolioHistory] Generating data for range: 1m
[calculatePortfolioHistory] Found 30 points for bitcoin 1m
[calculatePortfolioHistory] Found 30 points for solana 1m
[calculatePortfolioHistory] Created 30 unified timeline points
[calculatePortfolioHistory] Generated 30 portfolio points
[calculatePortfolioHistory] Value range: 8192968.281582524 - 9522117.123781772
[calculatePortfolioDelta] Start: 8192968.281582524, End: 9522117.123781772, Change: 1329148.8421992483 (16.22%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] 1m change for bitcoin:', { currentValue: 8849508.6936,
  valueChange: 1002247.2,
  percentage: 0.1412 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceContext] Getting 1m value change for solana:', { amount: 6247570000000, timeframe: '1m', magnitude: 9 }
'[PriceService] 1m change for solana:', { amount: 6247.57,
  priceStart: 180,
  priceEnd: 242,
  startValue: 1124562.6,
  endValue: 1511911.94,
  valueChange: 387349.34,
  changePercent: 34.44 }
'[AssetRowLayout] 1m change result for bitcoin:', { value: 1002247.2,
  percentage: 0.1412,
  absoluteValue: 1002247.2,
  priceStart: 85000,
  priceEnd: 97000 }
'[AssetRowLayout] 1m change result for solana:', { value: 387349.34,
  percentage: 0.3444,
  absoluteValue: 387349.34,
  priceStart: 180,
  priceEnd: 242 }
'[GraphCard] 1m change for solana:', { currentValue: 927514.2422,
  valueChange: 387349.34,
  percentage: 0.3444 }
'[GraphCard] Portfolio 1m change:', { totalCurrentValue: 9777022.9358,
  totalChange: 1389596.54,
  changePercentage: 0.14212880026207048 }
[generatePortfolioData] Generating portfolio data for range: 1m
[calculatePortfolioHistory] Generating data for range: 1m
[calculatePortfolioHistory] Found 30 points for bitcoin 1m
[calculatePortfolioHistory] Found 30 points for solana 1m
[calculatePortfolioHistory] Created 30 unified timeline points
[calculatePortfolioHistory] Generated 30 portfolio points
[calculatePortfolioHistory] Value range: 8192968.281582524 - 9522117.123781772
[calculatePortfolioDelta] Start: 8192968.281582524, End: 9522117.123781772, Change: 1329148.8421992483 (16.22%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] Time range clicked:', '1Y', '1y'
[PriceContext] Timeframe changed from 1m to 1y
[generatePortfolioData] Generating portfolio data for range: 1y
[calculatePortfolioHistory] Generating data for range: 1y
[calculatePortfolioHistory] Found 52 points for bitcoin 1y
[calculatePortfolioHistory] Found 52 points for solana 1y
[calculatePortfolioHistory] Created 52 unified timeline points
[calculatePortfolioHistory] Generated 52 portfolio points
[calculatePortfolioHistory] Value range: 3064520.5335408915 - 8941525.006267555
[calculatePortfolioDelta] Start: 3064520.5335408915, End: 8941525.006267555, Change: 5877004.472726664 (191.78%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[AssetRow] Using 1y data for bitcoin:', { value: 5181771.2, percentage: 1.7714 }
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[AssetRow] Using 1y data for solana:', { value: 1355883.69, percentage: 8.68 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
[GraphCard] Updating portfolio change for timeframe: 1y
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] Getting 1y value change for bitcoin:', { amount: 8352060000, timeframe: '1y', magnitude: 8 }
'[PriceService] 1y change for bitcoin:', { amount: 83.5206,
  priceStart: 35000,
  priceEnd: 97000,
  startValue: 2923221,
  endValue: 8101498.2,
  valueChange: 5178277.2,
  changePercent: 177.14 }
'[AssetRowLayout] Calculating 1y change for bitcoin:', { balance: 8352060000, timeframe: '1y' }
'[PriceContext] Getting 1y value change for bitcoin:', { amount: 8352060000, timeframe: '1y', magnitude: 8 }
'[PriceService] 1y change for bitcoin:', { amount: 83.5206,
  priceStart: 35000,
  priceEnd: 97000,
  startValue: 2923221,
  endValue: 8101498.2,
  valueChange: 5178277.2,
  changePercent: 177.14 }
'[AssetRowLayout] Calculating 1y change for solana:', { balance: 6247570000000, timeframe: '1y' }
'[PriceContext] Getting 1y value change for solana:', { amount: 6247570000000, timeframe: '1y', magnitude: 9 }
'[PriceService] 1y change for solana:', { amount: 6247.57,
  priceStart: 25,
  priceEnd: 242,
  startValue: 156189.25,
  endValue: 1511911.94,
  valueChange: 1355722.69,
  changePercent: 868 }
[generatePortfolioData] Generating portfolio data for range: 1y
[calculatePortfolioHistory] Generating data for range: 1y
[calculatePortfolioHistory] Found 52 points for bitcoin 1y
[calculatePortfolioHistory] Found 52 points for solana 1y
[calculatePortfolioHistory] Created 52 unified timeline points
[calculatePortfolioHistory] Generated 52 portfolio points
[calculatePortfolioHistory] Value range: 3064520.5335408915 - 8941525.006267555
[calculatePortfolioDelta] Start: 3064520.5335408915, End: 8941525.006267555, Change: 5877004.472726664 (191.78%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[GraphCard] 1y change for bitcoin:', { currentValue: 8849508.6936,
  valueChange: 5178277.2,
  percentage: 1.7713999999999999 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }
'[PriceContext] Getting 1y value change for solana:', { amount: 6247570000000, timeframe: '1y', magnitude: 9 }
'[PriceService] 1y change for solana:', { amount: 6247.57,
  priceStart: 25,
  priceEnd: 242,
  startValue: 156189.25,
  endValue: 1511911.94,
  valueChange: 1355722.69,
  changePercent: 868 }
'[AssetRowLayout] 1y change result for bitcoin:', { value: 5178277.2,
  percentage: 1.7713999999999999,
  absoluteValue: 5178277.2,
  priceStart: 35000,
  priceEnd: 97000 }
'[AssetRowLayout] 1y change result for solana:', { value: 1355722.69,
  percentage: 8.68,
  absoluteValue: 1355722.69,
  priceStart: 25,
  priceEnd: 242 }
'[GraphCard] 1y change for solana:', { currentValue: 927514.2422,
  valueChange: 1355722.69,
  percentage: 8.68 }
'[GraphCard] Portfolio 1y change:', { totalCurrentValue: 9777022.9358,
  totalChange: 6533999.89,
  changePercentage: 0.6683015814634947 }
[generatePortfolioData] Generating portfolio data for range: 1y
[calculatePortfolioHistory] Generating data for range: 1y
[calculatePortfolioHistory] Found 52 points for bitcoin 1y
[calculatePortfolioHistory] Found 52 points for solana 1y
[calculatePortfolioHistory] Created 52 unified timeline points
[calculatePortfolioHistory] Generated 52 portfolio points
[calculatePortfolioHistory] Value range: 3064520.5335408915 - 8941525.006267555
[calculatePortfolioDelta] Start: 3064520.5335408915, End: 8941525.006267555, Change: 5877004.472726664 (191.78%)
'[PriceContext] bitcoin calculation:', { amount: 8352060000,
  adjustedAmount: 83.5206,
  price: 105956,
  fiatValue: 8849508.6936 }
'[PriceContext] solana calculation:', { amount: 6247570000000,
  adjustedAmount: 6247.57,
  price: 148.46,
  fiatValue: 927514.2422 }

---

_**Assistant**_

<think><details><summary>Thought Process</summary>Let me analyze the current state of the codebase and the log output to understand the issue:

1. **Current State Analysis:**
   - The logs show that for 1d timeframe, the app correctly uses live CoinGecko API data
   - For other timeframes (1w, 1m, 1y, all), it's using static historical data from `HISTORICAL_PRICES` in `PriceService.ts`
   - The app is successfully fetching live prices: Bitcoin: $105,956, Solana: $148.46
   - However, for non-1d timeframes, it's falling back to hardcoded static values

2. **Issues Identified:**
   -</details></think>

---

