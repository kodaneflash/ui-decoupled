# Portfolio Screen Implementation Plan (100% Visual Fidelity)

## Overview
This implementation plan provides comprehensive specifications to recreate the Ledger Live Mobile Portfolio screen with **100% visual fidelity**. Every color, spacing, typography, layout, and component styling detail is documented to ensure pixel-perfect replication.

## Theme Architecture & Integration (Critical for 100% Fidelity)

### Core Theme Files & Integration

#### 1. **StyleProvider.tsx** - Theme Integration Layer
**Location:** `apps/ledger-live-mobile/src/StyleProvider.tsx`

**Purpose:** This is the main theme provider component that acts as a bridge between the `@ledgerhq/native-ui` design system and `styled-components/native` theming system.

**Key Functions:**
- Merges the local color themes (light/dark) with the native-ui design tokens
- Provides a unified theme object to all child components via React Context  
- Combines `defaultTheme` from native-ui with custom color palettes

**How it works in Portfolio:**
- The Portfolio screen and its child components access theme colors via `useTheme()` hook
- Components can use both `colors.background.main` and `colors.primary.c80` syntax
- Enables consistent styling across all portfolio components

```typescript
// Example usage in Portfolio
import StyleProvider from "./StyleProvider";

// In App.tsx or index.tsx
<StyleProvider selectedPalette="dark">
  <PortfolioScreen />
</StyleProvider>
```

#### 2. **colors.tsx** - Color Theme Definitions
**Location:** `apps/ledger-live-mobile/src/colors.tsx`

**Purpose:** Defines the complete light and dark color palettes specific to the Ledger Live Mobile app.

**Key Features:**
- **Light Theme:** White backgrounds, dark text, bright accent colors
- **Dark Theme:** Dark backgrounds (#131214), white text, same accent colors
- **Color Utilities:** `rgba()`, `darken()`, `lighten()` helper functions
- **Theme-aware HOC:** `withTheme()` for legacy class components

**Critical Colors for Portfolio:**
```typescript
darkTheme = {
  colors: {
    background: "#131214",    // Main background
    card: "#1C1D1F",         // Card backgrounds  
    primary: "hsla(247, 56%, 68%, 1)", // Purple accent
    text: "#FFFFFF",         // Primary text
    // ... many more specific colors
  }
}
```

**Usage in Portfolio Components:**
- GraphCard uses `colors.card` for background
- Header uses `colors.text` for title color
- Tabs use `colors.primary` for active state

#### 3. **theme.ts** - Design System Foundation
**Location:** `libs/ui/packages/react/src/styles/theme.ts`

**Purpose:** Provides the foundational design system tokens shared across the entire Ledger ecosystem.

**Core Design Tokens:**
- **Spacing System:** `space = [0, 2, 4, 8, 10, 12, 16, 20, 24, ...]` (4px base unit)
- **Typography Scale:** Font sizes, weights, and variants
- **Border Radius:** `radii = [0, 4, 8, 12, 16, 20]`
- **Breakpoints:** Responsive design breakpoints
- **Animation Utilities:** Transitions, easings, keyframes

**How Portfolio Uses It:**
```typescript
// Spacing examples in Portfolio
<Box px={6} py={4}>  // px=24px, py=16px
<Flex mt={7} mb={3}>  // mt=20px, mb=8px

// Typography examples
<Text variant="h4" fontWeight="semiBold">
```

### Theme Integration Requirements for Replica

**CRITICAL:** To achieve 100% visual fidelity, the replica must:

1. **Implement StyleProvider Integration:**
   - Create `src/components/StyleProvider.tsx` that merges themes
   - Wrap entire app in `<StyleProvider selectedPalette="dark">`
   - Ensure all components access theme via `useTheme()` hook

2. **Exact Color Matching:**
   - Use precise color values from `colors.tsx`
   - Implement both direct color access and semantic color tokens
   - Support `colors.background.main` and `colors.primary.c80` syntax

3. **Design Token Consistency:**
   - Implement exact spacing system with 4px base unit
   - Use `px={6}` (24px), `py={4}` (16px) spacing syntax
   - Match typography scales and font weights exactly

4. **Component Theme Usage Pattern:**
```typescript
// Correct theming pattern for Portfolio components
import { useTheme } from "styled-components/native";
import { Box, Flex, Text } from "@ledgerhq/native-ui";

function PortfolioComponent() {
  const { colors } = useTheme(); // Access merged theme
  
  return (
    <Flex flex={1} backgroundColor="background.main"> {/* Semantic token */}
      <Box px={6} py={4} backgroundColor={colors.card}> {/* Direct + semantic */}
        <Text variant="h4" color="neutral.c100"> {/* Typography token */}
          Portfolio
        </Text>
      </Box>
    </Flex>
  );
}
```

**Implementation Priority:** Theme integration must be completed FIRST before any component development to ensure consistent styling foundation.

## UI Specifications (Pixel-Perfect Details)

### Color Palette (Dark Theme)
```typescript
export const darkTheme = {
  colors: {
    background: {
      main: '#131214',        // Main background
      card: '#1C1D1F',        // Card backgrounds
    },
    text: '#FFFFFF',          // Primary text
    neutral: {
      c100: '#FFFFFF',        // White text
      c70: '#999999',         // Secondary text
      c30: '#404040',         // Border/separator
    },
    primary: {
      c80: '#7C3AED',         // Purple accent (tabs, FAB)
    },
    // Crypto currency colors
    bitcoin: '#F7931A',       // Bitcoin orange
    ethereum: '#627EEA',      // Ethereum blue
    tether: '#26A17B',        // Tether green
    xrp: '#0085C3',          // XRP blue
    bnb: '#F3BA2F',          // BNB yellow
  }
};
```

### Typography Specifications
```typescript
const typography = {
  header: {
    fontSize: 22,
    fontWeight: '600',        // semiBold
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
  },
  balance: {
    fontSize: 48,
    fontWeight: '600',        // semiBold
    lineHeight: 56,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',        // semiBold
    lineHeight: 20,
    fontFamily: 'Inter-SemiBold',
  },
  assetTicker: {
    fontSize: 14,
    fontWeight: '400',        // regular
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  tabButton: {
    fontSize: 14,
    fontWeight: '600',        // semiBold
    lineHeight: 18,
    fontFamily: 'Inter-SemiBold',
  },
  bottomNav: {
    fontSize: 12,
    fontWeight: '400',        // regular
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
  },
};
```

### Layout & Spacing System (4px Base Unit)
```typescript
const spacing = {
  xs: 4,   // 1 unit
  sm: 8,   // 2 units
  md: 12,  // 3 units
  lg: 16,  // 4 units
  xl: 20,  // 5 units
  xxl: 24, // 6 units
  xxxl: 32, // 8 units
};
```

## Portfolio Component Architecture (Static UI Replication Focus)

### **Portfolio Screen Component (`apps/ledger-live-mobile/src/screens/Portfolio/index.tsx`)**

#### **Component Overview & Purpose**
The `PortfolioScreen` serves as the **main container orchestrator** for the entire portfolio interface. For our static replica, this component's role is to:
- **Layout Management**: Coordinate the visual arrangement of all child components
- **UI State Management**: Handle simple UI interactions like modal visibility
- **Static Data Distribution**: Pass hardcoded data to child components
- **Theme Integration**: Ensure consistent styling across all portfolio elements

#### **What TO INCLUDE (Essential for Visual Replication):**

**1. Container Layout Structure:**
```typescript
// Main container using CollapsibleHeaderFlatList pattern
<RefreshableCollapsibleHeaderFlatList
  data={data}
  renderItem={({ item }) => item as JSX.Element}
  showsVerticalScrollIndicator={false}
/>
```

**2. Modal State Management:**
```typescript
// Essential UI state for Add Account modal
const [isAddModalOpened, setAddModalOpened] = useState(false);
const openAddModal = useCallback(() => setAddModalOpened(true), []);
const closeAddModal = useCallback(() => setAddModalOpened(false), []);
```

**3. Static Data Composition Pattern:**
```typescript
const data = useMemo(() => [
  // Header elements section
  <WalletTabSafeAreaView key="portfolioHeaderElements">
    <PortfolioGraphCard />
  </WalletTabSafeAreaView>,
  
  // Assets section  
  <Box background={colors.background.main} px={6}>
    <PortfolioAssets openAddModal={openAddModal} />
  </Box>,
  
  // Additional sections...
], [dependencies]);
```

**4. Theme Integration:**
```typescript
const { colors } = useTheme();
// Used for background colors and component styling
```

#### **What TO EXCLUDE (Not Needed for Static Replica):**
- ❌ **Redux State Selection**: `useSelector` calls for dynamic data
- ❌ **Feature Flag Integration**: `useFeature` conditionals  
- ❌ **Environment Configuration**: `useEnv` calls
- ❌ **Analytics Tracking**: `track()` function calls
- ❌ **Performance Monitoring**: `ReactNavigationPerformanceView`
- ❌ **Dynamic Content**: `useDynamicContent` hook
- ❌ **Account Refresh Logic**: `useRefreshAccountsOrdering`
- ❌ **Animation Height Management**: `useSharedValue` for dynamic animations

#### **Key Integrations & Relationships (Static UI Focus):**

**Child Component Relationships:**
1. **PortfolioGraphCard**: Portfolio balance visualization with "$0.00" display
2. **PortfolioAssets**: Asset/account list management with hardcoded crypto list
3. **FirmwareUpdateBanner**: System notifications (can be empty/hidden in replica)
4. **AllocationsSection**: Portfolio distribution charts (static pie chart)
5. **PortfolioOperationsHistorySection**: Transaction history (empty state)

**Component Flow for Static Replica:**
```typescript
PortfolioScreen (Container)
├── WalletTabSafeAreaView
│   ├── PortfolioGraphCard (Balance: $0.00 + Chart)
│   └── FirmwareUpdateBanner (Hidden/Empty)
├── Box (Assets Container)
│   └── PortfolioAssets
│       ├── TabSection (Crypto/NFTs tabs)
│       └── Assets (Crypto list)
└── AddAccountDrawer (Modal)
```

---

### **Portfolio Header Component (`apps/ledger-live-mobile/src/screens/Portfolio/Header.tsx`)**

#### **Component Overview & Purpose** 
The `PortfolioHeader` implements the **top navigation bar** with title and action icons. For static replication, it provides:
- **Visual Header Layout**: Left-right split design pattern
- **Icon Placement**: Four action icons in precise positions
- **Typography**: "Wallet" title with exact styling
- **Spacing**: Consistent padding and margins

#### **Component Composition**
The header follows a **left-right split layout pattern** that must be replicated exactly:

```typescript
<Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={3}>
  {/* LEFT SECTION: Title + Discreet Mode Button */}
  <Flex flexDirection="row" alignItems="center" mr={3} flexShrink={1} flexGrow={1}>
    <Text variant="h4" fontWeight="semiBold" color="neutral.c100" mr={3}>
      {t("tabs.portfolio")} {/* "Wallet" */}
    </Text>
    <DiscreetModeButton size={20} /> {/* Eye icon */}
  </Flex>
  
  {/* RIGHT SECTION: Four Action Icons */}
  <Flex flexDirection="row">
    <Flex mr={7}><CardMedium size={24} color="neutral.c100" /></Flex>
    <Flex mr={7}><WalletConnectMedium size={24} color="neutral.c100" /></Flex>  
    <Flex mr={7}><Notifications size={24} color="neutral.c100" /></Flex>
    <Flex><SettingsMedium size={24} color="neutral.c100" /></Flex>
  </Flex>
</Flex>
```

#### **What TO INCLUDE (Visual Elements Only):**

**1. Icon Button Layout (No Functionality):**
```typescript
// Import exact same icons
import { CardMedium, SettingsMedium, WalletConnectMedium } from "@ledgerhq/native-ui/assets/icons";
import Notifications from "~/icons/Notifications";

// Static icon placement (no onPress handlers needed)
const HeaderIcons = () => (
  <Flex flexDirection="row">
    <Flex mr={7}><CardMedium size={24} color="neutral.c100" /></Flex>
    <Flex mr={7}><WalletConnectMedium size={24} color="neutral.c100" /></Flex>
    <Flex mr={7}><Notifications size={24} color="neutral.c100" /></Flex>
    <Flex><SettingsMedium size={24} color="neutral.c100" /></Flex>
  </Flex>
);
```

**2. Icon Button Purposes (Visual Reference Only):**
- **Card Button**: Ledger Card integration (credit card icon)
- **WalletConnect Button**: DApp connection interface (connect icon)  
- **Notifications Button**: System notifications center (bell icon)
- **Settings Button**: App configuration (gear icon)

**3. Typography & Spacing:**
```typescript
// Exact text styling
<Text
  variant="h4"           // 22px font size
  fontWeight="semiBold"  // 600 weight
  color="neutral.c100"   // White text
  mr={3}                 // 12px margin right
>
  Wallet
</Text>
```

**4. DiscreetModeButton Integration:**
```typescript
// Eye icon for privacy mode (static, no toggle functionality)
<DiscreetModeButton size={20} />
```

#### **What TO EXCLUDE (Not Needed for Static Replica):**
- ❌ **Navigation Logic**: All `navigation.navigate()` calls
- ❌ **Event Handlers**: `onPress` callbacks for buttons
- ❌ **Analytics Tracking**: `track()` function calls
- ❌ **Feature Flag Logic**: Dynamic button behavior
- ❌ **Notification Count Logic**: Dynamic badge numbers
- ❌ **HOC Integration**: `withDiscreetMode` wrapper (can be simplified)

#### **Layout Specifications (Exact Measurements):**
```typescript
const headerLayoutStyle = {
  flexDirection: 'row',
  alignItems: 'center', 
  justifyContent: 'space-between',
  paddingVertical: 12,     // py={3} = 12px
  paddingHorizontal: 24,   // Should match screen padding
  
  // Left section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,       // mr={3}
    flexShrink: 1,
    flexGrow: 1,
  },
  
  // Right section  
  rightSection: {
    flexDirection: 'row',
    iconSpacing: 28,       // mr={7} = 28px between icons
    iconSize: 24,          // All icons 24px
  }
};
```

#### **Static Implementation Pattern:**
```typescript
// Simplified static header component
function PortfolioHeader() {
  const { colors } = useTheme();
  
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={3}>
      <Flex flexDirection="row" alignItems="center" mr={3} flexShrink={1} flexGrow={1}>
        <Text variant="h4" fontWeight="semiBold" color="neutral.c100" mr={3}>
          Wallet
        </Text>
        <DiscreetModeButton size={20} />
      </Flex>
      <Flex flexDirection="row">
        <Flex mr={7}><CardMedium size={24} color="neutral.c100" /></Flex>
        <Flex mr={7}><WalletConnectMedium size={24} color="neutral.c100" /></Flex>
        <Flex mr={7}><Notifications size={24} color="neutral.c100" /></Flex>
        <Flex><SettingsMedium size={24} color="neutral.c100" /></Flex>
      </Flex>
    </Flex>
  );
}
```

---

## Component Specifications

### 1. Header Section
```typescript
// Header Layout
const headerStyle = {
  paddingHorizontal: 24,     // px={6}
  paddingVertical: 12,       // py={3}
  marginTop: 8,              // mt={2}
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

// Header Icons
const headerIconStyle = {
  size: 24,                  // M size
  color: '#FFFFFF',          // neutral.c100
  marginRight: 24,           // mr={6}
};

// Header Title
const headerTitleStyle = {
  fontSize: 22,
  fontWeight: '600',
  color: '#FFFFFF',
  fontFamily: 'Inter-SemiBold',
};
```

### 2. Tab Section (Crypto/NFTs/Market)
```typescript
// Tab Container
const tabContainerStyle = {
  flexDirection: 'row',
  paddingHorizontal: 24,     // px={6}
  paddingVertical: 16,       // py={4}
};

// Tab Button (Active)
const activeTabStyle = {
  backgroundColor: '#7C3AED', // primary.c80
  paddingHorizontal: 16,      // px={4}
  paddingVertical: 8,         // py={2}
  borderRadius: 6,
  marginRight: 12,            // mr={3}
  alignItems: 'center',
  justifyContent: 'center',
};

// Tab Button (Inactive)
const inactiveTabStyle = {
  backgroundColor: '#2A2A2A',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
  marginRight: 12,
  alignItems: 'center',
  justifyContent: 'center',
};

// Tab Text (Active)
const activeTabTextStyle = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '600',
  fontFamily: 'Inter-SemiBold',
};

// Tab Text (Inactive)
const inactiveTabTextStyle = {
  color: '#999999',          // neutral.c70
  fontSize: 14,
  fontWeight: '600',
  fontFamily: 'Inter-SemiBold',
};
```

### 3. Graph Card Section
```typescript
// Graph Card Container
const graphCardStyle = {
  backgroundColor: '#1C1D1F',  // background.card
  marginHorizontal: 24,        // mx={6}
  marginVertical: 16,          // my={4}
  borderRadius: 12,
  padding: 24,                 // p={6}
  alignItems: 'center',
};

// Balance Display
const balanceStyle = {
  fontSize: 48,
  fontWeight: '600',
  color: '#FFFFFF',
  fontFamily: 'Inter-SemiBold',
  textAlign: 'center',
  marginBottom: 24,            // mb={6}
};

// Chart Container
const chartStyle = {
  width: '100%',
  height: 200,
  marginTop: 16,               // mt={4}
};

// Chart Line
const chartLineStyle = {
  stroke: '#999999',           // neutral.c70
  strokeWidth: 2,
  fill: 'none',
};
```

### 4. Asset Row Specifications
```typescript
// Asset Row Container
const assetRowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 24,       // px={6}
  paddingVertical: 16,         // py={4}
  height: 72,                  // Fixed height
  borderBottomWidth: 1,
  borderBottomColor: '#404040', // neutral.c30
};

// Currency Icon
const currencyIconStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 16,             // mr={4}
};

// Currency Info Container
const currencyInfoStyle = {
  flex: 1,
  justifyContent: 'center',
};

// Currency Name
const currencyNameStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#FFFFFF',
  fontFamily: 'Inter-SemiBold',
  marginBottom: 2,
};

// Currency Ticker
const currencyTickerStyle = {
  fontSize: 14,
  fontWeight: '400',
  color: '#999999',            // neutral.c70
  fontFamily: 'Inter-Regular',
};

// Balance Container
const balanceContainerStyle = {
  alignItems: 'flex-end',
};

// Balance Amount
const balanceAmountStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#FFFFFF',
  fontFamily: 'Inter-SemiBold',
  textAlign: 'right',
};

// Fiat Value
const fiatValueStyle = {
  fontSize: 14,
  fontWeight: '400',
  color: '#999999',            // neutral.c70
  fontFamily: 'Inter-Regular',
  textAlign: 'right',
  marginTop: 2,
};
```

### 5. Bottom Navigation
```typescript
// Bottom Navigation Container
const bottomNavStyle = {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 16,         // py={4}
  borderTopWidth: 1,
  borderTopColor: '#404040',   // neutral.c30
  backgroundColor: '#131214',  // background.main
  paddingBottom: 34,           // Safe area padding
};

// Navigation Item
const navItemStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 60,
};

// Navigation Icon
const navIconStyle = {
  fontSize: 20,
  marginBottom: 4,             // mb={1}
};

// Navigation Label (Active)
const activeNavLabelStyle = {
  fontSize: 12,
  fontWeight: '400',
  color: '#7C3AED',            // primary.c80
  fontFamily: 'Inter-Regular',
};

// Navigation Label (Inactive)
const inactiveNavLabelStyle = {
  fontSize: 12,
  fontWeight: '400',
  color: '#999999',            // neutral.c70
  fontFamily: 'Inter-Regular',
};

// FAB Button
const fabStyle = {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#7C3AED',  // primary.c80
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 16,
  alignSelf: 'center',
};

// FAB Icon
const fabIconStyle = {
  fontSize: 24,
  color: '#FFFFFF',
};
```

## Static Data Specifications

### Portfolio Data
```typescript
export const PORTFOLIO_DATA = {
  balance: 0.00,
  currency: 'USD',
  change: 0,
  changePercent: 0,
  chartData: [
    { x: 0, y: 50 },
    { x: 1, y: 75 },
    { x: 2, y: 25 },
    { x: 3, y: 100 },
    { x: 4, y: 60 },
    { x: 5, y: 80 },
  ],
};
```

### Crypto Assets Data
```typescript
export const CRYPTO_ASSETS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    ticker: 'BTC',
    amount: 0,
    fiatValue: 0,
    balance: '0 BTC',
    icon: {
      backgroundColor: '#F7931A',
      symbol: '₿',
    },
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    ticker: 'ETH',
    amount: 0,
    fiatValue: 0,
    balance: '0 ETH',
    icon: {
      backgroundColor: '#627EEA',
      symbol: '♦',
    },
  },
  {
    id: 'tether',
    name: 'Tether USD',
    ticker: 'USDT',
    amount: 0,
    fiatValue: 0,
    balance: '0 USDT',
    icon: {
      backgroundColor: '#26A17B',
      symbol: '₮',
    },
  },
  {
    id: 'xrp',
    name: 'XRP',
    ticker: 'XRP',
    amount: 0,
    fiatValue: 0,
    balance: '0 XRP',
    icon: {
      backgroundColor: '#0085C3',
      symbol: '✕',
    },
  },
  {
    id: 'bnb',
    name: 'Binance Smart Chain',
    ticker: 'BNB',
    amount: 0,
    fiatValue: 0,
    balance: '0 BNB',
    icon: {
      backgroundColor: '#F3BA2F',
      symbol: '◆',
    },
  },
];
```

## Implementation Tasks (Detailed)

### Phase 1: Foundation Setup

#### Task 1.1: Theme Configuration
- **File**: `src/styles/theme.ts`
- **Implementation**: Complete dark theme with exact color values
- **Requirements**: Match ledger-live-mobile colors exactly

#### Task 1.2: Static Data
- **File**: `src/constants/portfolioData.ts`
- **Implementation**: Hardcoded portfolio and asset data
- **Requirements**: Match reference image content exactly

### Phase 2: Component Implementation

#### Task 2.1: PortfolioScreen (Main Container)
- **File**: `src/screens/Portfolio/index.tsx`
- **Layout**: ScrollView with proper spacing
- **Styling**: Apply exact header, tab, and navigation styling
- **Requirements**: 
  - Header height: 64px
  - Tab section height: 56px
  - Bottom navigation height: 80px (including safe area)

#### Task 2.2: GraphCard Component
- **File**: `src/components/GraphCard.tsx`
- **Styling**: Card background, padding, border radius
- **Content**: Balance display, static chart
- **Requirements**:
  - Card margin: 24px horizontal
  - Card padding: 24px all sides
  - Balance font size: 48px
  - Chart height: 200px

#### Task 2.3: AccountRowLayout Component
- **File**: `src/components/AccountRowLayout.tsx`
- **Styling**: Row layout with precise spacing
- **Content**: Icon, name, ticker, balance
- **Requirements**:
  - Row height: 72px
  - Icon size: 40px
  - Horizontal padding: 24px
  - Vertical padding: 16px

#### Task 2.4: Tab Buttons
- **Implementation**: Styled components with active/inactive states
- **Styling**: Exact padding, margin, border radius
- **Requirements**:
  - Button padding: 16px horizontal, 8px vertical
  - Border radius: 6px
  - Margin right: 12px

#### Task 2.5: Bottom Navigation
- **Implementation**: Fixed bottom navigation with FAB
- **Styling**: Border, spacing, icon sizes
- **Requirements**:
  - FAB size: 56px diameter
  - Border top: 1px solid #404040
  - Padding: 16px vertical

### Phase 3: Integration & Styling

#### Task 3.1: @ledgerhq/native-ui Integration
```typescript
// Required imports
import { Box, Flex, Text } from '@ledgerhq/native-ui';
import { ThemeProvider } from 'styled-components/native';

// Usage patterns
<Box backgroundColor="background.main" px={6} py={4}>
<Flex flexDirection="row" alignItems="center" justifyContent="space-between">
<Text variant="h4" fontWeight="semiBold" color="neutral.c100">
```

#### Task 3.2: Font Integration
- **Fonts**: Inter-Regular, Inter-SemiBold, Inter-Bold
- **Installation**: Link fonts in iOS project
- **Usage**: Apply exact font weights and sizes

#### Task 3.3: Icon Integration
- **Source**: @ledgerhq/icons-ui/native
- **Usage**: Exact sizes and colors
- **Requirements**: Match original icon styles

## Verification Checklist

### Visual Fidelity Requirements
- [ ] Header layout matches exactly (height, padding, icon spacing)
- [ ] Tab buttons match (colors, padding, border radius, typography)
- [ ] Balance display matches (font size, weight, color, spacing)
- [ ] Chart section matches (height, background, padding)
- [ ] Asset rows match (height, icon size, typography, spacing)
- [ ] Bottom navigation matches (height, spacing, FAB size)
- [ ] Colors match dark theme exactly
- [ ] Typography matches (font family, sizes, weights)
- [ ] Spacing matches (margins, padding using 4px base unit)
- [ ] Safe area handling matches original

### Technical Requirements
- [ ] Uses @ledgerhq/native-ui components
- [ ] Implements ThemeProvider with darkTheme
- [ ] Uses Inter font family
- [ ] Implements proper TypeScript interfaces
- [ ] Uses React.memo for performance
- [ ] No business logic or dynamic data
- [ ] Static data matches reference image
- [ ] ScrollView behavior matches original

## Final Architecture (Complete)

```typescript
// App.tsx - Theme Provider Setup
import { ThemeProvider } from 'styled-components/native';
import { darkTheme } from './src/styles/theme';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <PortfolioScreen />
    </ThemeProvider>
  );
}

// PortfolioScreen - Main Container
import { PORTFOLIO_DATA, CRYPTO_ASSETS } from './constants/portfolioData';

function PortfolioScreen() {
  return (
    <Flex flex={1} backgroundColor="background.main">
      <Header />
      <TabSection />
      <ScrollView>
        <GraphCard data={PORTFOLIO_DATA} />
        <AssetsList assets={CRYPTO_ASSETS} />
      </ScrollView>
      <BottomNavigation />
    </Flex>
  );
}
```

This implementation plan ensures **100% visual fidelity** by specifying every UI detail down to the pixel level, including exact colors, typography, spacing, and component styling to match the ledger-live-mobile portfolio screen perfectly.

## Complete File Implementation Breakdown

### **Essential Files for 100% Visual Fidelity (8 Core Files)**

### **Phase 1: Core Visual Components (4 files)**

#### 1. **Main Portfolio Screen Container**
- **File**: `src/screens/Portfolio/index.tsx`
- **Status**: ✅ Exists - Needs updates
- **Purpose**: Main orchestrator that assembles all visual elements
- **Implementation**: ScrollView with proper spacing and component integration
- **Requirements**: 
  - Header height: 64px
  - Tab section height: 56px  
  - Bottom navigation height: 80px (including safe area)
  - Exact component ordering and spacing

#### 2. **Portfolio Header Component**
- **File**: `src/components/PortfolioHeader.tsx`
- **Status**: ❌ Must create
- **Purpose**: Header with "Wallet" title + eye icon + 4 header icons
- **Implementation**: Exact replica of ledger-live header layout
- **Requirements**:
  - "Wallet" title (left side)
  - Eye icon (discreet mode toggle)
  - 4 header icons: Card, Wallet, Bell notification, Settings (right side)
  - Icon size: 24px, spacing: 24px between icons
  - Typography: Inter-SemiBold, 22px

#### 3. **Tab Section Component**  
- **File**: `src/components/TabSection.tsx`
- **Status**: ❌ Must create
- **Purpose**: "Crypto/NFTs/Market" segmented control
- **Implementation**: Active/inactive tab states with exact styling
- **Requirements**:
  - "Crypto" (active - purple #7C3AED background)
  - "NFTs" & "Market" (inactive - gray #2A2A2A background)
  - Button padding: 16px horizontal, 8px vertical
  - Border radius: 6px, margin right: 12px
  - Typography: Inter-SemiBold, 14px

#### 4. **Bottom Navigation Component**
- **File**: `src/components/BottomNavigation.tsx`
- **Status**: ❌ Must create  
- **Purpose**: Bottom tabs + purple FAB button
- **Implementation**: 5 navigation items with active/inactive states + centered FAB
- **Requirements**:
  - 5 items: Wallet (active), Earn, Discover, My Ledger
  - Purple FAB: 56px diameter, centered, swap arrows icon
  - Border top: 1px solid #404040
  - Active text color: #7C3AED, inactive: #999999
  - Typography: Inter-Regular, 12px

### **Phase 2: Content Components (2 files)**

#### 5. **Graph Card Component**
- **File**: `src/components/GraphCard.tsx`
- **Status**: ✅ Exists - Needs updates
- **Purpose**: "$0.00" balance display + line chart
- **Implementation**: Card background with balance and static chart
- **Requirements**:
  - Card background: #1C1D1F
  - Card margin: 24px horizontal, 16px vertical
  - Card padding: 24px all sides
  - Balance font size: 48px, Inter-SemiBold
  - Chart height: 200px, gray stroke

#### 6. **Account Row Layout Component**
- **File**: `src/components/AccountRowLayout.tsx`
- **Status**: ✅ Exists - Needs updates
- **Purpose**: Individual crypto rows (Bitcoin, Ethereum, etc.)
- **Implementation**: Row layout with icon, name, ticker, and balance
- **Requirements**:
  - Row height: 72px fixed
  - Currency icon: 40px diameter, colored background
  - Horizontal padding: 24px, vertical: 16px
  - Name typography: Inter-SemiBold, 16px
  - Ticker typography: Inter-Regular, 14px, #999999

### **Phase 3: Data & Styling (2 files)**

#### 7. **Dark Theme Configuration**
- **File**: `src/styles/theme.ts`
- **Status**: ✅ Exists - Needs exact colors
- **Purpose**: Complete dark theme matching ledger-live-mobile
- **Implementation**: Exact color palette and spacing tokens
- **Requirements**:
  - Background main: #131214
  - Background card: #1C1D1F
  - Text colors: #FFFFFF, #999999, #404040
  - Primary purple: #7C3AED
  - Crypto colors: Bitcoin #F7931A, Ethereum #627EEA, etc.

#### 8. **Static Portfolio Data**
- **File**: `src/constants/portfolioData.ts`
- **Status**: ❌ Must create
- **Purpose**: Hardcoded data matching reference image
- **Implementation**: Portfolio balance and crypto assets array
- **Requirements**:
  - Portfolio balance: $0.00
  - 5 crypto assets: Bitcoin, Ethereum, Tether USD, XRP, Binance Smart Chain
  - All balances showing "0" as per reference image
  - Correct currency symbols and colors

### **Phase 4: Supporting Components (Optional Enhancement)**

#### 9. **Chart Component** (Optional)
- **File**: `src/components/Graph/index.tsx`
- **Status**: ❌ Optional - Can use simple SVG in GraphCard
- **Purpose**: Static SVG line chart for portfolio graph
- **Implementation**: Simple SVG path with mock data points

#### 10. **Currency Icon Component** (Optional)
- **File**: `src/components/CurrencyIcon.tsx`
- **Status**: ❌ Optional - Can use simple styled View
- **Purpose**: Circular currency icons with background colors
- **Implementation**: Styled component with currency symbols

### **Summary of Required Files**

**New Files to Create (4):**
1. `src/components/PortfolioHeader.tsx` - Header with icons  
2. `src/components/TabSection.tsx` - Segmented control
3. `src/components/BottomNavigation.tsx` - Bottom nav + FAB
4. `src/constants/portfolioData.ts` - Static data

**Existing Files to Update (4):**
5. `src/screens/Portfolio/index.tsx` - Main container
6. `src/components/GraphCard.tsx` - Balance + chart
7. `src/components/AccountRowLayout.tsx` - Crypto rows
8. `src/styles/theme.ts` - Exact colors

**Total: 8 files for complete 100% visual fidelity**

**Optional Enhancement Files (2):**
9. `src/components/Graph/index.tsx` - Detailed chart
10. `src/components/CurrencyIcon.tsx` - Custom icons

This comprehensive file breakdown ensures that every visual element from the reference image is replicated with pixel-perfect accuracy through a focused, minimal set of essential components.

---

## **Component Architecture Rules & Patterns** 
*Based on Real ledger-live-mobile Implementation*

After analyzing the actual `ledger-live/apps/ledger-live-mobile/src/screens/Portfolio/` components, the following architectural rules and patterns must be strictly followed for 100% visual fidelity:

### **Core Architectural Principles**

#### **1. Component Composition Pattern**
**Rule**: Use **flat component composition** in the main screen with `useMemo` data array pattern.

```typescript
// ✅ CORRECT - Main Portfolio Screen Pattern
function PortfolioScreen() {
  const data = useMemo(() => [
    <WalletTabSafeAreaView key="portfolioHeaderElements">
      <PortfolioGraphCard />
    </WalletTabSafeAreaView>,
    
    <Box background={colors.background.main} px={6} key="PortfolioAssets">
      <PortfolioAssets openAddModal={openAddModal} />
    </Box>,
    
    // Additional sections...
  ], [dependencies]);

  return (
    <RefreshableCollapsibleHeaderFlatList
      data={data}
      renderItem={({ item }) => item as JSX.Element}
      keyExtractor={(_, index) => String(index)}
    />
  );
}
```

**Key Requirements**:
- Use `useMemo` for data array with proper dependencies
- Each section wrapped in `WalletTabSafeAreaView` or `Box` containers
- Use `RefreshableCollapsibleHeaderFlatList` as main scroll container
- Render JSX elements directly (not component references)

#### **2. @ledgerhq/native-ui Integration Patterns**
**Rule**: All components MUST use **@ledgerhq/native-ui primitives** with exact prop-based styling.

```typescript
// ✅ CORRECT - Native UI Usage Pattern
import { Box, Flex, Text, Button } from "@ledgerhq/native-ui";
import { CardMedium, SettingsMedium } from "@ledgerhq/native-ui/assets/icons";

function Component() {
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={3}>
      <Text variant="h4" fontWeight="semiBold" color="neutral.c100">
        {title}
      </Text>
      <Flex flexDirection="row">
        <Flex mr={7}>
          <CardMedium size={24} color="neutral.c100" />
        </Flex>
      </Flex>
    </Flex>
  );
}
```

**Required Components**:
- `Box` - Basic container with background/padding props
- `Flex` - Flexbox layout with direction/alignment props  
- `Text` - Typography with variant/fontWeight/color props
- `Button` - Actions with type/size/outline props
- Icons from `@ledgerhq/native-ui/assets/icons`

#### **3. Theme Integration Requirements**
**Rule**: Components MUST access theme via `useTheme()` hook for colors and use semantic color tokens.

```typescript
// ✅ CORRECT - Theme Usage Pattern
import { useTheme } from "styled-components/native";

function Component() {
  const { colors } = useTheme();
  
  return (
    <Box 
      backgroundColor="background.main"          // Semantic token
      style={{ backgroundColor: colors.card }}   // Direct theme access
    >
      <Text color="neutral.c100">               {/* Semantic token */}
        Content
      </Text>
    </Box>
  );
}
```

**Theme Access Patterns**:
- Semantic tokens: `color="neutral.c100"`, `backgroundColor="background.main"`
- Direct access: `colors.card`, `colors.primary.c80`
- Mixed usage: Semantic tokens for native-ui props, direct access for custom styles

#### **4. Performance Optimization Requirements**
**Rule**: ALL list items and stateful components MUST use `React.memo`.

```typescript
// ✅ REQUIRED - Performance Pattern
function GraphCard({ portfolio, counterValueCurrency }: Props) {
  // Component implementation
}

export default React.memo(GraphCard);

// ✅ REQUIRED - Complex components with callback optimization  
function PortfolioAssets({ openAddModal }: Props) {
  const onButtonPress = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  // Component implementation
}

export default React.memo(PortfolioAssets);
```

**Performance Requirements**:
- `React.memo` for ALL Portfolio child components
- `useCallback` for event handlers with proper dependencies
- `useMemo` for computed values and data arrays

#### **5. Static Data Integration Pattern**
**Rule**: Replace ALL Redux selectors and live hooks with simple static data hooks.

```typescript
// ❌ ORIGINAL - Live Data (DO NOT USE)
const portfolio = usePortfolioAllAccounts();
const accounts = useSelector(flattenAccountsSelector);

// ✅ REPLICA - Static Data Pattern
const portfolio = {
  balance: 0,
  countervalueChange: { value: 0, percentage: 0 },
  balanceHistory: MOCK_CHART_DATA,
};

const accounts = MOCK_CRYPTO_ASSETS;
```

**Static Data Requirements**:
- No Redux `useSelector` calls
- No live-common hooks (`usePortfolioAllAccounts`, etc.)
- Hardcoded objects matching exact data structure
- Mock data in separate `constants/` files

### **Component-Specific Implementation Rules**

#### **Portfolio Header Component**
**File**: `src/components/PortfolioHeader.tsx`

**Structure Requirements**:
```typescript
// ✅ REQUIRED - Header Layout Pattern
<Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={3}>
  {/* LEFT SECTION */}
  <Flex flexDirection="row" alignItems="center" mr={3} flexShrink={1} flexGrow={1}>
    <Text variant="h4" fontWeight="semiBold" color="neutral.c100" mr={3}>
      {t("tabs.portfolio")} {/* "Wallet" */}
    </Text>
    <DiscreetModeButton size={20} />
  </Flex>
  
  {/* RIGHT SECTION - 4 Icons */}
  <Flex flexDirection="row">
    <Flex mr={7}><CardMedium size={24} color="neutral.c100" /></Flex>
    <Flex mr={7}><WalletConnectMedium size={24} color="neutral.c100" /></Flex>
    <Flex mr={7}><Notifications size={24} color="neutral.c100" /></Flex>
    <Flex><SettingsMedium size={24} color="neutral.c100" /></Flex>
  </Flex>
</Flex>
```

**Critical Specifications**:
- **Icon Spacing**: `mr={7}` (28px) between each icon
- **Icon Size**: Exactly `24px` for all icons
- **Typography**: `variant="h4"` + `fontWeight="semiBold"`
- **Colors**: `color="neutral.c100"` for all elements

#### **Graph Card Component**
**File**: `src/components/GraphCard.tsx`

**Structure Requirements**:
```typescript
// ✅ REQUIRED - GraphCard Layout Pattern
<Flex>
  <Flex flexDirection="row" justifyContent="center" alignItems="center" marginTop={40} marginBottom={40}>
    <Flex alignItems="center">
      <Text fontFamily="Inter" fontWeight="semiBold" fontSize="42px" color="neutral.c100">
        <CurrencyUnitValue unit={unit} value={0} />
      </Text>
      <Flex flexDirection="row" alignItems="center">
        <Delta percent show0Delta valueChange={countervalueChange} />
      </Flex>
    </Flex>
  </Flex>
  
  <Graph height={110} width={width + 1} color={colors.primary.c80} />
  <GraphTabs activeIndex={0} onChange={updateTimeRange} labels={rangeLabels} />
</Flex>
```

**Critical Specifications**:
- **Balance Font**: `fontSize="42px"` + `fontWeight="semiBold"`
- **Graph Height**: Exactly `110px`
- **Graph Color**: `colors.primary.c80` (purple)
- **Margins**: `marginTop={40}` + `marginBottom={40}`

#### **Tab Section Component**
**File**: `src/components/TabSection.tsx`

**Structure Requirements**:
```typescript
// ✅ REQUIRED - TabSection Pattern
<Box height={40} mb={16}>
  <TabSelector
    labels={[
      { id: "Assets", value: "Crypto" },
      { id: "Accounts", value: "NFTs" },
    ]}
    onToggle={handleToggle}
    initialTab="Assets"
  />
</Box>
```

**Critical Specifications**:
- **Container Height**: Exactly `40px`
- **Margin Bottom**: `mb={16}` (64px)
- **Use TabSelector**: From `@ledgerhq/native-ui`
- **Tab Labels**: "Crypto", "NFTs", "Market"

#### **Bottom Navigation Component**
**File**: `src/components/BottomNavigation.tsx`

**Structure Requirements**:
```typescript
// ✅ REQUIRED - Bottom Navigation Pattern
<Flex flexDirection="row" justifyContent="space-around" alignItems="center" py={4}>
  {/* 5 Navigation Items */}
  <Flex alignItems="center">
    <WalletIcon color={isActive ? "primary.c80" : "neutral.c70"} />
    <Text variant="small" color={isActive ? "primary.c80" : "neutral.c70"}>
      Wallet
    </Text>
  </Flex>
  
  {/* Purple FAB Button - Centered */}
  <Box 
    width={56} 
    height={56} 
    borderRadius={28} 
    backgroundColor="primary.c80"
    alignItems="center" 
    justifyContent="center"
  >
    <SwapIcon size={24} color="neutral.c100" />
  </Box>
</Flex>
```

**Critical Specifications**:
- **FAB Size**: `56x56px` with `borderRadius={28}`
- **FAB Color**: `backgroundColor="primary.c80"`
- **Active Color**: `primary.c80`, Inactive: `neutral.c70`
- **Typography**: `variant="small"` for labels

### **Styling & Layout Rules**

#### **Spacing System (4px Base Unit)**
**Rule**: ALL spacing MUST use the 4px base unit system with native-ui props.

```typescript
// ✅ CORRECT - Native UI Spacing Props
px={6}    // 24px horizontal padding
py={4}    // 16px vertical padding  
mt={7}    // 28px top margin
mb={3}    // 12px bottom margin
mr={7}    // 28px right margin (icon spacing)
```

**Standard Spacing Values**:
- `px={6}` = 24px (standard container padding)
- `py={3}` = 12px (header/button padding)
- `mr={7}` = 28px (icon spacing)
- `mb={6}` = 24px (section spacing)

#### **Typography Hierarchy**
**Rule**: Use exact `@ledgerhq/native-ui` typography variants with semantic tokens.

```typescript
// ✅ REQUIRED - Typography Patterns
<Text variant="h4" fontWeight="semiBold" color="neutral.c100">     {/* Headers */}
<Text variant="large" fontWeight="semiBold" color="neutral.c100">  {/* Balance amounts */}
<Text variant="large" color="neutral.c70">                        {/* Secondary text */}
<Text variant="small" color="neutral.c70">                        {/* Navigation labels */}
```

#### **Color Usage Rules**
**Rule**: Use ONLY semantic color tokens for consistency.

```typescript
// ✅ REQUIRED - Semantic Color Tokens
color="neutral.c100"        // Primary white text
color="neutral.c70"         // Secondary gray text  
color="primary.c80"         // Purple accent (tabs, FAB)
backgroundColor="background.main"  // Dark background
backgroundColor="card"             // Card backgrounds
```

### **File Organization Requirements**

#### **Import Statement Order**
**Rule**: Follow exact import order pattern from original components.

```typescript
// ✅ REQUIRED - Import Order Pattern
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex, Text, Button } from "@ledgerhq/native-ui";
import { CardMedium, SettingsMedium } from "@ledgerhq/native-ui/assets/icons";
import { useTheme } from "styled-components/native";
import { PORTFOLIO_DATA } from "~/constants/portfolioData";
```

**Import Categories**:
1. React imports
2. Third-party hooks (i18next, navigation)
3. @ledgerhq/native-ui components
4. @ledgerhq/native-ui icons
5. styled-components
6. Local constants/utils

#### **Component Export Pattern**
**Rule**: Use consistent export pattern with React.memo.

```typescript
// ✅ REQUIRED - Export Pattern
function ComponentName(props: Props) {
  // Component implementation
}

export default React.memo(ComponentName);
```

### **TypeScript Interface Requirements**

#### **Props Interface Pattern**
**Rule**: Define explicit interfaces for all component props.

```typescript
// ✅ REQUIRED - Props Interface Pattern
interface Props {
  // Static UI props only
  showAssets: boolean;
  openAddModal: () => void;
  // No live data props
}

interface PortfolioData {
  balance: number;
  countervalueChange: {
    value: number;
    percentage: number;
  };
  balanceHistory: Array<{ x: number; y: number }>;
}
```

### **Testing & Validation Requirements**

#### **Component Testing Pattern**
**Rule**: Add `testID` props for critical UI elements.

```typescript
// ✅ REQUIRED - TestID Pattern
<Button testID="add-account-cta" onPress={openAddModal}>
<Text testID="graphCard-balance">
<Flex testID="portfolio-assets-layout">
```

These architectural rules ensure that our static replica components will have **100% visual fidelity** with the original ledger-live-mobile Portfolio screen while maintaining the exact same component patterns, styling approaches, and performance optimizations. 