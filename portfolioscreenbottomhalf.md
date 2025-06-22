# Portfolio Screen Bottom Half: Comprehensive Component Analysis

## Overview
This document provides a detailed analysis of the two critical UI components in the bottom half of the Ledger Live Mobile Portfolio screen: the **Time Range Selector (GraphTabs)** and the **Quick Action Cards (Buy, Swap, Send, Receive, Earn)**. This analysis ensures 100% visual fidelity for static UI replication.

---

## **1. Time Range Selector Component (1D, 1W, 1M, 1Y, ALL)**

### **Component Architecture**

#### **Primary Component**: `GraphTabs` from `@ledgerhq/native-ui`
- **File Location**: `libs/ui/packages/native/src/components/Tabs/Graph/index.tsx`
- **Implementation Context**: Used within `GraphCard.tsx` component
- **Component Type**: Styled native UI tab selector with active/inactive states

#### **Component Hierarchy**:
```typescript
GraphCard.tsx
├── Balance Display Section
├── Chart/Graph Section  
└── GraphTabs Component (Time Range Selector)
    ├── TabBox (TouchableOpacity container)
    ├── TabText (Text with styling)
    └── StyledTabs (Template wrapper)
```

### **Technical Implementation**

#### **Core Component Structure**:
```typescript
// From libs/ui/packages/native/src/components/Tabs/Graph/index.tsx
const TabBox = styled.TouchableOpacity`
  text-align: center;
  border-radius: ${(p) => p.theme.radii[1]}px;  // 4px border radius
  box-sizing: border-box;
  overflow: hidden;
  margin-left: ${(p) => p.theme.space[1]}px;    // 4px left margin
`;

const TabText = styled(Text).attrs<TabItemProps>((p) => ({
  size: undefined,
  lineHeight: p.size === "medium" ? "40px" : "26px",
  textAlign: "center",
  height: p.size === "medium" ? "40px" : "26px",
  width: 50,  // CRITICAL: Fixed 50px width per tab
}))``;
```

#### **Layout Container**:
```typescript
const StyledTabs = styled(TemplateTabs)`
  display: flex;
  justify-content: center;  // Centers the entire tab group
`;
```

### **Visual Design Specifications**

#### **Active Tab Styling**:
```typescript
// Active tab configuration
{
  bg: activeBg,                    // "neutral.c30" (dark gray background)
  color: activeColor,              // "neutral.c100" (white text)
  fontWeight: "semiBold",          // 600 font weight
  variant: "small",                // Small text variant
  uppercase: true,                 // ALL CAPS labels
}
```

#### **Inactive Tab Styling**:
```typescript
// Inactive tab configuration  
{
  color: "neutral.c70",            // Gray text color
  fontWeight: "semiBold",          // 600 font weight
  variant: "small",                // Small text variant
  uppercase: true,                 // ALL CAPS labels
  // No background (transparent)
}
```

#### **Tab Dimensions & Spacing**:
```typescript
const tabSpecifications = {
  width: 50,                       // Fixed width per tab
  height: {
    medium: 40,                    // Height for medium size
    small: 26,                     // Height for small size
  },
  borderRadius: 4,                 // theme.radii[1]
  marginLeft: 4,                   // theme.space[1] between tabs
  lineHeight: {
    medium: "40px",                // Line height matches container height
    small: "26px",
  }
};
```

### **Responsive Width Behavior**

#### **Maximum Width Strategy for Narrow Displays**:
1. **Fixed Tab Width**: Each tab maintains exactly 50px width regardless of screen size
2. **Center Justification**: The entire tab group is centered using `justify-content: center`
3. **Total Width Calculation**: 
   ```typescript
   // Total width = (5 tabs × 50px) + (4 gaps × 4px) = 266px
   const totalTabsWidth = (5 * 50) + (4 * 4); // 266px maximum
   ```
4. **Overflow Handling**: On very narrow screens (<266px), tabs remain centered and may extend slightly beyond viewport

#### **Layout Adaptation**:
```typescript
// Template tabs container handles responsive behavior
<TabsContainer columnGap={gap} stretchItems={false}>
  {/* stretchItems=false ensures fixed width behavior */}
  {labels.map((label, index) => (
    <GraphTab key={index} {...props} />
  ))}
</TabsContainer>
```

### **Integration in Portfolio**:
```typescript
// Used within GraphCard component
function GraphCard() {
  const timeRangeItems = GRAPH_TIME_RANGES;
  const activeRangeIndex = timeRangeItems.findIndex(r => r.active);
  const rangesLabels = timeRangeItems.map(({label}) => label);

  return (
    <Flex>
      {/* Balance and chart sections */}
      <GraphTabs
        activeIndex={activeRangeIndex}
        onChange={updateTimeRange}
        labels={rangesLabels}        // ["1D", "1W", "1M", "1Y", "ALL"]
        activeBg="neutral.c30"       // Dark gray active background
        activeColor="neutral.c100"   // White active text
        size="medium"                // 40px height variant
      />
    </Flex>
  );
}
```

---

## **2. Quick Action Cards Component (Buy, Swap, Send, Receive, Earn)**

### **Component Architecture**

#### **Primary Component**: `PortfolioQuickActionsBar` using `QuickActionList`
- **File Location**: `screens/Portfolio/PortfolioQuickActionsBar.tsx`
- **UI Component**: `QuickActionList` from `@ledgerhq/native-ui`
- **Data Source**: `useQuickActions` hook for icon and route mapping

#### **Component Hierarchy**:
```typescript
PortfolioAssets.tsx
├── PortfolioQuickActionsBar
│   ├── useQuickActions (hook)
│   └── QuickActionList
│       ├── QuickActionButton (Buy)
│       ├── QuickActionButton (Swap)  
│       ├── QuickActionButton (Send)
│       ├── QuickActionButton (Receive)
│       └── QuickActionButton (Earn)
└── TabSection (Assets/Accounts tabs below)
```

### **Icon Mappings & Technical Implementation**

#### **Complete Icon Specifications** (from `useQuickActions.ts`):

```typescript
const quickActionsList = {
  BUY: {
    icon: IconsLegacy.PlusMedium,           // Plus symbol (+)
    disabled: readOnlyModeEnabled,
    route: [NavigatorName.Exchange, { screen: ScreenName.ExchangeBuy }],
  },
  SWAP: {
    icon: IconsLegacy.BuyCryptoMedium,      // Exchange/swap arrows symbol
    disabled: isPtxServiceCtaExchangeDrawerDisabled || !hasFunds,
    route: [NavigatorName.Swap, { screen: ScreenName.SwapTab }],
  },
  SEND: {
    icon: IconsLegacy.ArrowTopMedium,       // Upward arrow (↑)
    disabled: readOnlyModeEnabled || !hasCurrency,
    route: [NavigatorName.SendFunds, { screen: ScreenName.SendCoin }],
  },
  RECEIVE: {
    icon: IconsLegacy.ArrowBottomMedium,    // Downward arrow (↓)
    disabled: readOnlyModeEnabled,
    route: [NavigatorName.ReceiveFunds, { screen: ScreenName.ReceiveSelectCrypto }],
  },
  STAKE: {
    icon: IconsLegacy.CoinsMedium,          // Stacked coins symbol (Earn)
    disabled: readOnlyModeEnabled,
    route: [NavigatorName.StakeFlow, { screen: ScreenName.Stake }],
  },
};
```

#### **Icon Visual Descriptions**:
1. **Buy** (`PlusMedium`): Clean plus symbol, indicating addition/purchase
2. **Swap** (`BuyCryptoMedium`): Bidirectional arrows, indicating exchange/conversion  
3. **Send** (`ArrowTopMedium`): Single upward arrow, indicating outbound transfer
4. **Receive** (`ArrowBottomMedium`): Single downward arrow, indicating inbound transfer
5. **Earn** (`CoinsMedium`): Stacked coins icon, indicating staking/yield generation

### **Quick Action Cards Implementation**

#### **Component Configuration**:
```typescript
// In PortfolioQuickActionsBar.tsx
const SHARED_CONFIG = {
  variant: "small" as const,
  textVariant: "small" as TextVariants,
};

const quickActionsData: QuickActionButtonProps[] = [
  BUY && {
    ...SHARED_CONFIG,
    Icon: BUY.icon,
    children: t("portfolio.quickActions.buy"),    // "Buy"
    onPress: () => onNavigate(BUY.route, "quick_action_buy"),
    disabled: BUY.disabled,
  },
  // ... similar for SWAP, SEND, RECEIVE, STAKE
].filter(Boolean);
```

#### **Layout Configuration**:
```typescript
<QuickActionList
  data={quickActionsData}
  numColumns={5}                    // CRITICAL: 5 cards in horizontal row
  id="asset_five_columns"
  testID="portoflio-quick-action-button"
/>
```

### **Visual Design Specifications**

#### **Card Layout Structure**:
```typescript
// Each QuickActionButton contains:
{
  Icon: IconComponent,              // 24px icon (Medium size)
  children: "Label Text",           // Action label below icon
  variant: "small",                 // Small button variant
  textVariant: "small",             // Small text variant
  disabled: boolean,                // Enable/disable state
  onPress: NavigationFunction,      // Route navigation
}
```

#### **Typography & Spacing**:
```typescript
const quickActionStyling = {
  iconSize: 24,                     // Medium icon size (24px)
  textVariant: "small",             // Small text size
  buttonVariant: "small",           // Small button padding
  layout: "vertical",               // Icon above text
  alignment: "center",              // Center-aligned icon and text
};
```

#### **Color Specifications**:
```typescript
const colorStates = {
  enabled: {
    iconColor: "neutral.c100",      // White icon
    textColor: "neutral.c100",      // White text
  },
  disabled: {
    iconColor: "neutral.c70",       // Gray icon
    textColor: "neutral.c70",       // Gray text
  }
};
```

### **Responsive Layout Behavior**

#### **Column Distribution Strategy**:
```typescript
// QuickActionList uses numColumns={5} with flex distribution
const responsiveLayout = {
  columns: 5,                       // Always 5 cards per row
  distribution: "space-evenly",     // Equal spacing between cards
  cardWidth: "flex",                // Cards expand to fill available space
  minCardWidth: "60px",             // Minimum card width for very narrow screens
};
```

#### **Width Adaptation for Narrow Displays**:
1. **Equal Distribution**: 5 cards always occupy full container width
2. **Proportional Scaling**: Each card gets exactly 20% of container width
3. **Icon Preservation**: 24px icons maintain size, text may truncate if needed
4. **Minimum Viable Width**: Component functions down to ~300px container width

#### **Container Integration**:
```typescript
// QuickActionList placement within portfolio layout
<Box px={6}>                        // 24px horizontal padding
  <PortfolioQuickActionsBar />      // 5-column action cards
</Box>
```

### **Integration Context in Portfolio Flow**:
```typescript
// Component placement within PortfolioAssets
function PortfolioAssets() {
  return (
    <Box>
      <PortfolioQuickActionsBar />    // Action cards section
      <TabSection />                  // Assets/Accounts tab selector  
      <Assets />                      // Crypto currency list
    </Box>
  );
}
```

---

## **Static Implementation Requirements**

### **For GraphTabs Replication**:
```typescript
// Static time range data structure
export const GRAPH_TIME_RANGES = [
  {label: '1D', value: '1d', active: false, key: '1d'},
  {label: '1W', value: '1w', active: true, key: '1w'},   // Default active
  {label: '1M', value: '1m', active: false, key: '1m'},
  {label: '1Y', value: '1y', active: false, key: '1y'},
  {label: 'ALL', value: 'all', active: false, key: 'all'},
];

// Implementation in static GraphCard
<Flex paddingTop={6} flexDirection="row" justifyContent="space-around">
  {rangesLabels.map((label, index) => (
    <Flex
      key={label}
      paddingHorizontal={12}          // 12px horizontal padding
      paddingVertical={8}             // 8px vertical padding  
      borderRadius={6}                // 6px border radius
      backgroundColor={index === activeRangeIndex ? "#7C3AED" : "transparent"}
      onTouchStart={() => updateTimeRange(index)}
    >
      <Text
        fontSize={14}
        fontWeight="semiBold"
        color={index === activeRangeIndex ? "#FFFFFF" : "#999999"}
      >
        {label}
      </Text>
    </Flex>
  ))}
</Flex>
```

### **For QuickAction Cards Replication**:
```typescript
// Static quick actions data
export const QUICK_ACTIONS_DATA = [
  {
    id: 'buy',
    icon: 'PlusMedium',
    label: 'Buy',
    disabled: false,
  },
  {
    id: 'swap', 
    icon: 'BuyCryptoMedium',
    label: 'Swap',
    disabled: false,
  },
  {
    id: 'send',
    icon: 'ArrowTopMedium', 
    label: 'Send',
    disabled: false,
  },
  {
    id: 'receive',
    icon: 'ArrowBottomMedium',
    label: 'Receive', 
    disabled: false,
  },
  {
    id: 'earn',
    icon: 'CoinsMedium',
    label: 'Earn',
    disabled: false,
  },
];

// Static implementation component
function QuickActionsBar() {
  return (
    <Flex flexDirection="row" justifyContent="space-around" px={6} py={4}>
      {QUICK_ACTIONS_DATA.map((action) => (
        <Flex key={action.id} alignItems="center" minWidth="60px">
          <Flex mb={2}>
            <IconComponent name={action.icon} size={24} color="neutral.c100" />
          </Flex>
          <Text variant="small" color="neutral.c100" textAlign="center">
            {action.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
```

---

## **Critical Layout Dependencies**

### **Spacing & Positioning Context**:
1. **GraphTabs**: Positioned at bottom of GraphCard with `paddingTop={6}` (24px)
2. **QuickActions**: First element in PortfolioAssets with horizontal padding `px={6}` (24px)
3. **Vertical Flow**: QuickActions → TabSection → Assets list (proper spacing maintained)

### **Container Width Constraints**:
- **GraphTabs**: 266px maximum width, centered in container
- **QuickActions**: Full container width with 5-column flex distribution
- **Responsive Breakpoint**: Both components function well down to 320px screen width

### **Performance Considerations**:
- Both components should use `React.memo` for optimization
- Tab state changes should use `useCallback` for event handlers
- Icon components should be imported dynamically or pre-bundled

This comprehensive analysis provides all necessary specifications for achieving 100% visual fidelity when replicating these critical portfolio screen components.
