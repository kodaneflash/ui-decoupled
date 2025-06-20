# Comprehensive Component Analysis for Wallet Screen Replication

Based on the wallet screen image, here are all the visible components that need to be studied and replicated for accurate visual fidelity:

## **1. STATUS BAR COMPONENTS**
- **System Status Bar** (iOS/Android native)
  - Time display: "9:39"
  - Signal strength indicators
  - WiFi indicator
  - Battery indicator with charging symbol

## **2. HEADER NAVIGATION COMPONENTS**
- **Portfolio Header** (`~/screens/Portfolio/Header.tsx`)
  - "Wallet" title text
  - Discreet mode eye icon (optional)
- **Header Action Icons** (right side)
  - **Card Icon** (`CardMedium` from `@ledgerhq/native-ui/assets/icons`)
  - **WalletConnect Icon** (`WalletConnectMedium`)  
  - **Notifications Icon** (`NotificationsMedium` or custom `~/icons/Notifications`)
  - **Settings Icon** (`SettingsMedium`)

## **3. TAB NAVIGATION COMPONENTS**
- **WalletTabNavigatorTabBar** (`~/components/WalletTab/WalletTabNavigatorTabBar.tsx`)
  - **Crypto Tab** (active state with purple background)
  - **NFTs Tab** (inactive state)
  - **Market Tab** (inactive state)
- **Tab Styling Components**
  - Active tab background color: `primary.c70` (#7C3AED)
  - Inactive tab background: `rgba(colors.constant.white, 0.08)`
  - Tab text styling: `fontWeight="semiBold"`, `variant="body"`

## **4. BALANCE DISPLAY COMPONENTS**
- **PortfolioGraphCard** (`~/screens/Portfolio/PortfolioGraphCard.tsx`)
  - **GraphCard** (`~/components/GraphCard.tsx`)
    - Balance amount: "$0.00"
    - Typography: Large, white, centered
    - Background: Dark theme background

## **5. CHART/GRAPH COMPONENTS**
- **Portfolio Balance Chart**
  - Wavy line graph (SVG or Canvas-based)
  - Gray/muted color scheme
  - Responsive to touch/gestures
  - Time period controls (implied but not visible)

## **6. ASSET LIST COMPONENTS**
- **PortfolioAssets** (`~/screens/Portfolio/PortfolioAssets.tsx`)
  - **Assets List Container** (`~/screens/Portfolio/Assets.tsx`)
  - **FlatList** component for efficient rendering

### **Individual Asset Row Components**
Each crypto asset row contains:

#### **6a. Bitcoin Row**
- **AccountRowLayout** (`~/components/AccountRowLayout.tsx`)
- **CurrencyIcon/ParentCurrencyIcon** (`~/components/CurrencyIcon.tsx`, `~/components/ParentCurrencyIcon.tsx`)
  - Bitcoin orange background (#F7931A)
  - Bitcoin symbol (₿) or icon from `@ledgerhq/crypto-icons-ui`
- **Asset Name**: "Bitcoin"
- **Asset Ticker**: "BTC" 
- **Balance Display**: "0 BTC"
- **Chevron Right Icon** (`IconsLegacy.ChevronRightMedium`)

#### **6b. Ethereum Row**
- Same structure as Bitcoin with:
  - Ethereum blue background (#627EEA)
  - Ethereum symbol (♦) or ETH icon
  - "Ethereum" / "0 ETH"

#### **6c. Tether USD Row**
- Same structure with:
  - Tether green background (#26A17B)
  - Tether symbol (₮) or USDT icon
  - "Tether USD" / "0 USDT"

#### **6d. XRP Row**
- Same structure with:
  - XRP blue background (#0085C3)
  - XRP symbol (✕) or XRP icon
  - "XRP" / "0 XRP"

#### **6e. Binance Smart Chain Row**
- Same structure with:
  - BNB yellow/gold background (#F3BA2F)
  - BNB symbol (◆) or BNB icon
  - "Binance Smart Chain" / "0 BNB"

## **7. BOTTOM NAVIGATION COMPONENTS**
- **MainNavigator** (`~/components/RootNavigator/MainNavigator.tsx`)
- **CustomTabBar** (`~/components/TabBar/CustomTabBar.tsx`)

### **Bottom Tab Items:**
#### **7a. Wallet Tab** (active)
- **PortfolioTabIcon** (`~/screens/Portfolio/TabIcon.tsx`)
- Wallet icon (briefcase/portfolio symbol)
- "Wallet" label in active color (`primary.c80`)

#### **7b. Earn Tab**
- **TabIcon** with `IconsLegacy.LendMedium`
- Chart/growth icon
- "Earn" label in inactive color (`neutral.c70`)

#### **7c. Transfer Button** (center, circular)
- **TransferTabIcon** (`~/components/TabBar/Transfer.tsx`)
- Large circular purple button
- Bidirectional arrow icon (↔️)
- Elevated/prominent styling

#### **7d. Discover Tab**
- **TabIcon** with `IconsLegacy.PlanetMedium`  
- Globe/planet icon
- "Discover" label in inactive color

#### **7e. My Ledger Tab**
- **ManagerTabIcon** (`~/components/RootNavigator/MyLedgerNavigator.tsx`)
- Device/hardware icon
- "My Ledger" label in inactive color

## **8. LAYOUT & STYLING COMPONENTS**
- **WalletTabSafeAreaView** (`~/components/WalletTab/WalletTabSafeAreaView.tsx`)
- **CollapsibleHeaderFlatList** (`~/components/WalletTab/CollapsibleHeaderFlatList.tsx`)
- **ScrollView** with proper safe area handling
- **Theme Provider** (`~/components/StyleProvider.tsx`)

## **9. TYPOGRAPHY COMPONENTS**
- **LText** (`~/components/LText/index.tsx`) - Custom text wrapper
- **Text** from `@ledgerhq/native-ui`
- Font variants used:
  - `variant="h4"` for main titles
  - `variant="large"` for asset names and balances
  - `variant="body"` for secondary text
  - `variant="small"` for tab labels

## **10. SPACING & LAYOUT TOKENS**
- Padding values: `px={6}`, `py={4}`, `py={3}`, `py={8}`
- Margin values: `mr={3}`, `mr={6}`, `mr={7}`, `ml={4}`
- Border radius: `borderRadius={6}` for tabs, `borderRadius={28}` for circular button

## **11. COLOR SYSTEM COMPONENTS**
- **Theme Colors** (`~/styles/colors.ts`)
  - `neutral.c100` - Primary white text
  - `neutral.c70` - Secondary gray text  
  - `neutral.c30` - Border/divider colors
  - `primary.c80` - Active purple color
  - `background.main` - Dark background
  - Currency-specific colors for asset icons

## **12. INTERACTIVE COMPONENTS**
- **TouchableOpacity** wrappers for all clickable elements
- **Touchable** (`~/components/Touchable.tsx`) with analytics tracking
- **GestureResponderEvent** handlers for navigation
- **Navigation** integration with React Navigation

## **13. ACCESSIBILITY COMPONENTS**
- **testID** props for testing
- **accessibilityLabel** for screen readers
- **accessibilityRole** for proper semantic markup

## **14. ANIMATION COMPONENTS** (if applicable)
- **Animated.View** from `react-native-reanimated`
- **useSharedValue** for scroll animations
- **interpolate** for header collapse animations

## **15. MOCK DATA STRUCTURES**
For static replication, these data structures are needed:
- **Portfolio balance**: String ("$0.00")
- **Asset list**: Array of objects with:
  - `name`: string
  - `ticker`: string  
  - `balance`: string
  - `iconBg`: string (hex color)
  - `iconLetter`: string (symbol)

This comprehensive list covers every visible UI element in the wallet screen image and maps them to their corresponding components in the Ledger Live Mobile codebase, providing a complete reference for accurate visual replication. 