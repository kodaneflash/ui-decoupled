# Portfolio UI Replication - Development Changelog

## Project Overview
Static UI replica of Ledger Live Mobile Portfolio screen with 100% visual fidelity. All components are presentational-only with hardcoded data, no business logic.

## ✅ Completed Components

### 1. Theme Foundation (COMPLETE)
- **`src/components/StyleProvider.tsx`** - Theme integration layer
- **`src/styles/colors.ts`** - Dark/light theme definitions with exact color palette

### 2. Static Data Layer (COMPLETE)
- **`src/constants/portfolioData.ts`** - Foundation data for all components

### 3. GraphCard Integration (COMPLETE) 
- **`src/components/GraphCard.tsx`** - Balance display with proper theme integration
- **`src/components/GraphCardContainer.tsx`** - Simplified container with internal static data

### Recent Updates (Latest)
**CSS Parsing Error Fix (Critical):**
- ❌ **Error**: `CssSyntaxError: <css input>:4:39: Unclosed string` in `@ledgerhq/native-ui` GraphTabs component
- ✅ **Root Cause**: CSS template literal parsing bug in `TemplateTabsGroup` → `GraphTabs` 
- ✅ **Fix Applied**: Replaced `GraphTabs` with manual tab implementation using `Flex` + `Text`
- ✅ **Dependencies**: Upgraded `react-native-reanimated: 3.7.0 → 3.16.7` (to match ledger-live)

**How to Revert (If Needed):**
```typescript
// 1. Revert react-native-reanimated version
pnpm add react-native-reanimated@3.7.0

// 2. Replace manual tabs with original GraphTabs in GraphCard.tsx:
<Flex paddingTop={6} background={colors.background.main}>
  <GraphTabs
    activeIndex={activeRangeIndex}
    onChange={updateTimeRange}
    labels={rangesLabels}
  />
</Flex>

// 3. Add back import: import { GraphTabs } from "@ledgerhq/native-ui";
// 4. Clean: cd ios && pod install && npx react-native start --reset-cache
```

**Previous Updates:**
- ✅ **GraphCard.tsx**: Fixed theme integration (removed fallbacks), added optional portfolio/currency props with static fallbacks
- ✅ **GraphCardContainer.tsx**: Simplified Props interface, creates static data internally instead of requiring external injection  
- ✅ **portfolioData.ts**: Reduced `MockPortfolioData` to `SimplePortfolioData` with only essential properties, removed unused mock hooks



---

## 📋 Static Data Structure Guide (`portfolioData.ts`)

### Simplified Architecture (v2 - Cleaned Up)
```typescript
// ✅ MINIMAL: Only essential types for static UI replica
export interface SimplePortfolioData {
  totalBalance: number;
  countervalueChange: { value: number; percentage: number };
  balanceHistory: Array<{ date: Date; value: number }>;
}
```

### Key Data Exports

#### 1. **Portfolio Balance Data**
```typescript
export const PORTFOLIO_DATA = {
  totalBalance: 0,                    // Main balance: $0.00
  countervalueChange: {               // Change indicators (all zero)
    value: 0,
    percentage: 0
  },
  balanceHistory: [...],              // 7 data points for chart
  chartData: [...]                    // SVG path coordinates
};
```

#### 2. **Currency Unit (USD)**
```typescript
export const MOCK_CURRENCY_UNIT = {
  code: "USD",
  symbol: "$",
  magnitude: 2,
  name: "US Dollar"
};
```

#### 3. **Crypto Assets Array (5 Assets)**
```typescript
export const CRYPTO_ASSETS = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    balance: 0,                       // All balances are 0
    balanceFormatted: "0 BTC",        // Pre-formatted display strings
    fiatBalanceFormatted: "$0.00",
    icon: {                           // Exact colors from reference
      backgroundColor: "#F7931A",      // Bitcoin orange
      symbol: "₿",
      color: "#FFFFFF"
    }
  },
  // ... Ethereum, Tether USD, XRP, BNB
];
```

### Usage Pattern in Components (Simplified)
```typescript
// ✅ Import static data directly - no complex hooks needed
import { PORTFOLIO_DATA, MOCK_CURRENCY_UNIT } from "~/constants/portfolioData";

function GraphCardContainer() {
  // Create simple static objects internally
  const portfolio = {
    ...PORTFOLIO_DATA,
    range: "1w",
    balanceAvailable: true,
    balanceHistory: PORTFOLIO_DATA.balanceHistory.map(item => ({
      date: item.date,
      value: item.value || 0,
    })),
  };
  
  const counterValueCurrency = { units: [MOCK_CURRENCY_UNIT] };
  
  return <GraphCard portfolio={portfolio} counterValueCurrency={counterValueCurrency} />;
}
```

### Component Props Pattern
```typescript
// ✅ GraphCard accepts optional props with fallbacks
interface Props {
  areAccountsEmpty: boolean;
  portfolio?: Portfolio;              // Optional - falls back to internal static data
  counterValueCurrency?: Currency;    // Optional - falls back to internal static data
  currentPositionY?: Animated.SharedValue<number>;
  graphCardEndPosition?: number;
  onTouchEndGraph?: () => void;
}

// ✅ GraphCardContainer keeps it simple
interface Props {
  showGraphCard: boolean;
  areAccountsEmpty: boolean;
  currentPositionY: Animated.SharedValue<number>;
  graphCardEndPosition: number;
}
```

### Color Specifications
- **Bitcoin**: `#F7931A` (Orange)
- **Ethereum**: `#627EEA` (Blue) 
- **Tether USD**: `#26A17B` (Green)
- **XRP**: `#0085C3` (Blue)
- **BNB**: `#F3BA2F` (Yellow with black symbol)

---

## 🚧 Remaining Components to Implement

### Phase 1: Essential UI Components
- **`src/components/PortfolioHeader.tsx`** - Header with "Wallet" title + 4 icons
- **`src/components/DiscreetModeButton.tsx`** - Eye icon for privacy mode
- **`src/components/TabSection.tsx`** - Crypto/NFTs/Market segmented control
- **`src/components/GraphCard.tsx`** - $0.00 balance display + line chart
- **`src/components/AccountRowLayout.tsx`** - Individual crypto asset rows
- **`src/components/BottomNavigation.tsx`** - Bottom tabs + purple FAB button

### Phase 2: Screen Assembly
- **`src/screens/Portfolio/index.tsx`** - Main container with ScrollView layout

### Phase 3: Supporting Components (Optional)
- **`src/components/Graph/index.tsx`** - SVG line chart component
- **`src/components/CurrencyIcon.tsx`** - Circular currency icons
- **`src/components/Delta.tsx`** - Change percentage display
- **`src/components/CurrencyUnitValue.tsx`** - Formatted currency values

---

## 🎯 Implementation Rules

### Component Structure Requirements

**⚠️ Known Issues:**
- **GraphTabs Component**: CSS parsing bug in `@ledgerhq/native-ui@0.35.0` causes "Unclosed string" errors
- **Workaround**: Use manual tab implementation with `Flex` + `Text` components instead
- **Alternative**: Upgrade to newer native-ui version when available
```typescript
// ✅ REQUIRED: All components must follow this pattern
import React from "react";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";

interface Props {
  // Static UI props only
}

function ComponentName(props: Props) {
  const theme = useTheme() as any; // Theme integration
  const colors = theme.colors || theme;
  
  return (
    <Flex flexDirection="row" alignItems="center" py={3}> {/* Native-UI props */}
      <Text color="neutral.c100" variant="h4" fontWeight="semiBold"> {/* Semantic tokens */}
        Content
      </Text>
    </Flex>
  );
}

export default React.memo(ComponentName); // Performance optimization
```

### Styling Requirements
- **Theme Integration**: `useTheme()` hook with `theme.colors` access
- **Native UI Components**: `Box`, `Flex`, `Text` from `@ledgerhq/native-ui`
- **Semantic Tokens**: `color="neutral.c100"`, `backgroundColor="background.main"`
- **Spacing System**: `px={6}` (24px), `py={3}` (12px), `mr={7}` (28px)
- **Typography**: `variant="h4"`, `fontWeight="semiBold"`

### Data Integration Rules (Updated)
```typescript
// ✅ DO: Use static data directly - simple and clean
import { PORTFOLIO_DATA, MOCK_CURRENCY_UNIT, CRYPTO_ASSETS } from "~/constants/portfolioData";

// ✅ DO: Create static objects internally in components
const portfolio = { ...PORTFOLIO_DATA, range: "1w", balanceAvailable: true };
const counterValueCurrency = { units: [MOCK_CURRENCY_UNIT] };

// ❌ DON'T: Use Redux selectors or live hooks  
const accounts = useSelector(accountsSelector); // Never use this
const portfolio = usePortfolioAllAccounts(); // Never use this

// ❌ DON'T: Over-engineer with complex type definitions
interface OverlyComplexPortfolio { /* 50+ properties */ } // Removed - too complex
```

---

## 📏 Visual Specifications

### Exact Measurements
- **Header Height**: 64px with `py={3}` (12px padding)
- **Icon Spacing**: `mr={7}` (28px between header icons)
- **Icon Size**: 24px for all header icons, 20px for eye icon
- **Tab Height**: 40px with `mb={16}` (16px margin bottom)
- **Asset Row Height**: 72px fixed height
- **Currency Icon**: 40px diameter
- **FAB Button**: 56px diameter, centered

### Typography Scale
- **Header Title**: `variant="h4"` (22px) + `fontWeight="semiBold"`
- **Balance Display**: 48px + `fontWeight="semiBold"`
- **Asset Name**: 16px + `fontWeight="semiBold"`
- **Asset Ticker**: 14px + `fontWeight="regular"` + `color="neutral.c70"`

### Color Tokens
- **Primary Text**: `color="neutral.c100"` (#FFFFFF)
- **Secondary Text**: `color="neutral.c70"` (#999999)
- **Background**: `backgroundColor="background.main"` (#131214)
- **Card Background**: `backgroundColor="card"` (#1C1D1F)
- **Purple Accent**: `color="primary.c80"` (#7C3AED)

---

## 🔄 Next Steps

1. **Create PortfolioHeader.tsx** - Header with exact icon spacing
2. **Create TabSection.tsx** - Segmented control with purple active state
3. **Update GraphCard.tsx** - Balance display with static chart
4. **Update AccountRowLayout.tsx** - Crypto rows with currency icons
5. **Create BottomNavigation.tsx** - Bottom nav with FAB
6. **Assemble Portfolio/index.tsx** - Main screen container

Each component must achieve **100% visual fidelity** with the reference image while maintaining static/presentational behavior only.
