# Asset List UI Analysis - Ledger Live Portfolio Screen (Bottom Half)

## Overview
This document provides a detailed analysis of the UI elements in the bottom half of the Ledger Live portfolio screen, specifically focusing on the assets list and individual asset layout when the "Assets" tab is selected.

## Component Architecture & Flow

### 1. Main Container Structure
```
Portfolio Screen (index.tsx)
└── PortfolioAssets.tsx
    ├── PortfolioQuickActionsBar (margin: 24px top/bottom)
    └── TabSection.tsx (when accountListFF enabled)
        ├── TabSelector (40px height, 16px margin bottom)
        └── Animated Container (200% width for sliding)
            ├── AssetsListView (new architecture)
            └── AccountsListView (accounts tab)
```

### 2. Data Flow & Props (these will be static for ours)
- **Data Source**: `useSelector(flattenAccountsSelector)` - Gets flattened accounts from Redux
- **Asset Processing**: `useDistribution()` hook filters and processes assets
- **Filtering**: `blacklistedTokenIdsSet` removes blacklisted tokens
- **Limit**: `maxItemsToDysplay = 5` assets shown in portfolio view


### 3. Tab Management (TabSection.tsx)

#### Tab Selector
```typescript
<Box height={40} mb={16}>
  <TabSelector
    labels={[
      { id: "Assets", value: t("assets.title") },
      { id: "Accounts", value: t("accounts.title") }
    ]}
    onToggle={handleToggle}
    initialTab={initialTab}
  />
</Box>
```

#### Animated Layout Container
```typescript
<Flex
  flexDirection="row"
  overflow="hidden" 
  width="200%"                    // Double width for side-by-side lists
  height={containerHeight}        // Dynamic height based on content
  maxHeight={containerHeight}
  overflowY="hidden"
>
  <Animated.View style={assetsAnimatedStyle}>   // translateX animation
    <AssetsListView />
  </Animated.View>
  <Animated.View style={accountsAnimatedStyle}>
    <AccountsListView />
  </Animated.View>
</Flex>
```

## Asset List Implementation

### 4. Two Architecture Approaches

#### Legacy Implementation (Assets.tsx)
```typescript
<FlatList<Asset>
  data={assets}
  renderItem={({ item }) => (
    <AssetRow 
      asset={item} 
      navigation={navigation} 
      sourceScreenName={ScreenName.Portfolio} 
    />
  )}
  keyExtractor={item => item.currency.id}
  contentContainerStyle={{ flex: 1 }}
/>
```

#### New Architecture (AssetsListView/index.tsx)
```typescript
<FlashList
  estimatedItemSize={150}
  renderItem={({ item }) => (
    <Pressable
      style={{ opacity: pressed ? 0.5 : 1.0, marginVertical: 12 }}
      onPress={onItemPress.bind(null, item)}
    >
      <Flex height={40} flexDirection="row" columnGap={12}>
        <AssetItem asset={item} balance={BigNumber(item.amount)} />
      </Flex>
    </Pressable>
  )}
  data={assetsToDisplay}
/>
```

### 5. Individual Asset Row Layout

#### AssetRow Container (WalletCentricAsset/AssetRow.tsx)
- **Purpose**: Data processing and navigation logic
- **Key Props**: `asset`, `navigation`, `hideDelta`, `sourceScreenName`
- **Data Processing**: 
  - `usePortfolioForAccounts()` for countervalue changes
  - `BigNumber(asset.amount)` for balance conversion
  - Currency and unit extraction from asset

#### AssetRowLayout (components/AssetRowLayout.tsx)
**Main Visual Component for Individual Assets**

##### Layout Structure
```typescript
<TouchableOpacity onPress={onPress}>
  <Flex flexDirection="row" pt={6} pb={6} alignItems="center">
    
    {/* Currency Icon - 40px */}
    <ParentCurrencyIcon currency={currency} size={40} />
    
    {/* Content Area - Flex:1 */}
    <Flex flex={1} justifyContent="center" ml={4}>
      
      {/* Top Row: Name + Fiat Value */}
      <Flex mb={1} flexDirection="row" justifyContent="space-between">
        <Text variant="large" fontWeight="semiBold" color="neutral.c100">
          {name}
        </Text>
        <Text variant="large" fontWeight="semiBold" color="neutral.c100">
          <CounterValue currency={currency} value={balance} />
        </Text>
      </Flex>
      
      {/* Bottom Row: Crypto Amount + Delta */}
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="body" fontWeight="medium" color="neutral.c70">
          <CurrencyUnitValue showCode unit={currencyUnit} value={balance} />
        </Text>
        <Delta
          percent
          show0Delta={balance.toNumber() !== 0}
          fallbackToPercentPlaceholder
          valueChange={countervalueChange}
        />
      </Flex>
    </Flex>
  </Flex>
</TouchableOpacity>
```

##### Spacing & Sizing
- **Row Height**: Variable based on padding (`pt={6} pb={6}` = 24px top/bottom)
- **Icon Size**: 40px diameter circular currency icon
- **Icon Margin**: `ml={4}` = 16px left margin from icon to text
- **Internal Spacing**: `mb={1}` = 4px between top and bottom text rows

## Key UI Components Analysis

### 6. ParentCurrencyIcon (components/ParentCurrencyIcon.tsx)

#### Visual Structure
- **Size**: 40px diameter circle
- **Background**: Dynamic color from `getCurrencyColor(currency)` with contrast adjustment
- **Icon**: White currency icon at 62.5% of container size (25px)
- **Token Support**: Shows parent currency icon for tokens (overlay positioning)

#### Implementation
```typescript
<Flex
  bg={color}                    // Dynamic currency color
  width={size}                  // 40px
  height={size}                 // 40px  
  alignItems="center"
  justifyContent="center"
  borderRadius={size}           // Perfect circle
>
  <CurrencyIcon
    size={iconSize}             // 25px (40 * 0.625)
    currency={currency}
    color={colors.constant.white}
  />
</Flex>
```

### 7. Text Typography & Colors

#### Asset Name (Primary Text)
```typescript
<Text
  variant="large"              // 16px font size
  fontWeight="semiBold"        // Font weight
  color="neutral.c100"         // White text (#FFFFFF)
  numberOfLines={1}            // Single line with ellipsis
>
  {name}
</Text>
```

#### Crypto Amount (Secondary Text)
```typescript
<Text
  variant="body"               // 14px font size  
  fontWeight="medium"          // Medium font weight
  color="neutral.c70"          // Gray text (#70757E)
>
  <CurrencyUnitValue showCode unit={currencyUnit} value={balance} />
</Text>
```

#### Fiat Value (Primary Text)
```typescript
<Text
  variant="large"              // 16px font size
  fontWeight="semiBold"        // Font weight
  color="neutral.c100"         // White text
>
  <CounterValue currency={currency} value={balance} />
</Text>
```

### 8. CurrencyUnitValue Component (components/CurrencyUnitValue.tsx)

#### Purpose
- Formats cryptocurrency amounts with proper units and localization
- Handles decimal places, unit codes, and currency symbols
- Integrates with DiscreetMode for privacy

#### Key Features
- **Format Options**: `showCode`, `alwaysShowValue`, `before`, `after`
- **Localization**: Uses `useLocale()` hook for number formatting
- **Privacy**: Respects discreet mode to hide values
- **Unit Display**: Shows currency code (BTC, ETH, etc.)

### 9. CounterValue Component (components/CounterValue.tsx)

#### Purpose
- Converts cryptocurrency values to fiat currency (USD, EUR, etc.)
- Uses real-time exchange rates from countervalues service
- Handles loading states and errors gracefully

#### Implementation Flow
1. **Currency Conversion**: `useCalculate()` hook for real-time rates
2. **Tracking**: Adds currency pairs to tracking for rate updates
3. **Fallback**: Shows placeholder "-" when rates unavailable
4. **Formatting**: Uses CurrencyUnitValue for final display

### 10. Delta Component (components/Delta.tsx)

#### Purpose
- Shows percentage and absolute value changes
- Color-coded indicators for gains/losses
- Arrow icons for visual direction indicators

#### Visual States
```typescript
// Positive Change (Green)
color: "success.c50"           // Green (#4ADE80)
ArrowIcon: ArrowEvolutionUpMedium
sign: "+"

// Negative Change (Red)  
color: "error.c50"             // Red (#EF4444)
ArrowIcon: ArrowEvolutionDownMedium
sign: "-"

// No Change (Gray)
color: "neutral.c70"           // Gray
ArrowIcon: null
sign: "-"
```

#### Layout Structure
```typescript
<View style={styles.root}>                    // flexDirection: row
  <ArrowIcon size={20} color={color} />       // Direction arrow
  <View style={styles.content}>              // marginLeft: 5
    <Text variant="large" color={color} fontWeight="semiBold">
      {absDelta.toFixed(0)}%
    </Text>
  </View>
</View>
```

## Performance Optimizations

### 11. Memory & Rendering Optimizations

#### Component Memoization
- **AssetRowLayout**: `React.memo` with `isEqual` deep comparison
- **AssetRow**: `React.memo` with custom props comparison 
- **AssetsList**: `React.memo` with `isEqual` comparison

#### List Performance
- **Legacy**: `FlatList` with `keyExtractor` optimization
- **New**: `FlashList` with `estimatedItemSize={150}` for better performance
- **Refresh Control**: `globalSyncRefreshControl` for pull-to-refresh

#### Data Processing
- **Filtering**: `useMemo` for blacklisted token filtering  
- **Distribution**: Cached asset distribution calculations
- **Balance Conversion**: Memoized BigNumber conversions

## Styling Guidelines

### 12. Design System Integration

#### @ledgerhq/native-ui Components
- **Layout**: `Flex`, `Box` components with props-based styling
- **Typography**: `Text` component with semantic variants
- **Spacing**: Consistent 4px base unit system (`px={6}` = 24px)
- **Colors**: Semantic color tokens (`neutral.c100`, `success.c50`)

#### Theme Integration
```typescript
const { colors, space } = useTheme();

// Semantic color usage
colors.neutral.c100        // White text
colors.neutral.c70         // Gray secondary text  
colors.success.c50         // Green positive values
colors.error.c50           // Red negative values
colors.background.main     // Dark background
```

#### Spacing System
```typescript
px={6}    // 24px horizontal padding
py={6}    // 24px vertical padding  
ml={4}    // 16px left margin
mb={1}    // 4px bottom margin
mt={7}    // 28px top margin
```

## Accessibility & Interaction

### 13. Touch Targets & Navigation

#### Touch Areas
- **Full Row**: TouchableOpacity wraps entire asset row
- **Press States**: 50% opacity when pressed (new architecture)
- **Hit Slop**: 6px hit slop for better touch targets
- **Minimum Size**: Meets 44px minimum touch target guidelines

#### Navigation Flow
```typescript
onAssetPress = (uiEvent) => {
  track("asset_clicked", { asset: currency.name });
  startNavigationTTITimer({ source: sourceScreenName, uiEvent });
  navigation.navigate(NavigatorName.Accounts, {
    screen: ScreenName.Asset,
    params: { currency }
  });
}
```

#### Analytics Integration
- **Asset Clicks**: Tracks which assets are tapped
- **Performance**: TTI (Time To Interactive) measurement
- **Source Tracking**: Records navigation source screen

## Summary

The asset list in the bottom half of the Ledger Live portfolio screen is a sophisticated component system that balances visual design, performance, and user experience:

1. **Dual Architecture**: Supports both legacy FlatList and modern FlashList implementations
2. **Smooth Animations**: Horizontal sliding between Assets/Accounts tabs
3. **Rich Visual Hierarchy**: Clear typography, color-coded changes, currency icons  
4. **Performance Optimized**: Memoization, efficient list rendering, minimal re-renders
5. **Accessibility Compliant**: Proper touch targets, screen reader support
6. **Design System Consistent**: Uses @ledgerhq/native-ui components and tokens
7. **Data-Driven**: Real-time currency conversion and portfolio calculations

The implementation demonstrates enterprise-level React Native development with careful attention to performance, maintainability, and user experience.
