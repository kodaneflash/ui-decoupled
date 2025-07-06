# ACTUAL Ledger Live Assets/Accounts Toggle Components

## Overview
This document identifies the REAL Ledger Live Mobile UI components that create the Assets/Accounts toggle bar and asset list functionality visible in the portfolio screen. These are the actual components from the Ledger Live codebase that need to be replicated.

---

## **1. TabSection.tsx - Main Assets/Accounts Container**

**File Path**: `ledger-live/apps/ledger-live-mobile/src/screens/Portfolio/TabSection.tsx`

This is the primary component that orchestrates the entire Assets/Accounts toggle functionality in the real Ledger Live app.

### **Component Structure**:
```typescript
import { TabSelector } from "@ledgerhq/native-ui";
import AssetsListView from "LLM/features/Assets/components/AssetsListView";
import AccountsListView from "LLM/features/Accounts/components/AccountsListView";

export const TAB_OPTIONS = {
  Assets: "Assets",
  Accounts: "Accounts",
} as const;

const TabSection: React.FC<TabSectionProps> = ({
  t,
  handleToggle,
  initialTab,
  showAssets,
  showAccounts,
  assetsAnimatedStyle,
  accountsAnimatedStyle,
  // ... other props
}) => (
  <>
    <Box height={40} mb={16}>
      <TabSelector
        labels={[
          { id: TAB_OPTIONS.Assets, value: t("assets.title") },
          { id: TAB_OPTIONS.Accounts, value: t("accounts.title") },
        ]}
        onToggle={handleToggle}
        initialTab={initialTab}
      />
    </Box>
    <Flex
      flexDirection="row"
      overflow="hidden"
      width="200%" 
      height={containerHeight}
    >
      <Animated.View style={[{ flex: 1 }, assetsAnimatedStyle]}>
        <AssetsListView />
      </Animated.View>
      <Animated.View style={[{ flex: 1 }, accountsAnimatedStyle]}>
        <AccountsListView />
      </Animated.View>
    </Flex>
  </>
);
```

### **Key Features**:
- Uses `TabSelector` from @ledgerhq/native-ui for the toggle
- Creates 200% width container with side-by-side asset/account lists  
- Animated transitions between tabs using `react-native-reanimated`
- Height: 40px for tab selector with 16px margin bottom

---

## **2. TabSelector - The Actual Toggle Component**

**File Path**: `ledger-live/libs/ui/packages/native/src/components/Form/TabSelector/index.tsx`

This is the real toggle component from Ledger Live's UI library that creates the #1E1E20 outline effect.

### **Component Structure**:
```typescript
import { Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const Container = styled(Flex)`
  height: 100%;
  justify-content: space-between;
  flex-direction: row;
  position: relative;
`;

const AnimatedBackground = styled(Animated.View)<{ $radius: number }>`
  position: absolute;
  height: 100%;
  border-radius: ${({ $radius }) => $radius}px;
  background-color: ${({ theme }) => theme.colors.opacityDefault.c05};
`;

export default function TabSelector<T extends string>({
  labels,
  initialTab,
  onToggle,
  filledVariant = false,
}: TabSelectorProps<T>) {
  // Animated background slides between tabs
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(translateX.value, { duration: 250 }) }],
      width: containerWidth / labels.length,
    };
  });

  const boxStyles = filledVariant
    ? { bg: "neutral.c30" }
    : { p: 2, border: 1, borderColor: "opacityDefault.c10" };

  return (
    <Box
      height="100%"
      width="100%"
      borderRadius={12}
      bg={boxStyles.bg}
      p={boxStyles.p}
      border={boxStyles.border}
      borderColor={boxStyles.borderColor}
    >
      <Container>
        <AnimatedBackground style={animatedStyle} $radius={tabRadius} />
        {labels.map((label, index) => (
          <Pressable onPress={() => handlePress(label.id, index)}>
            <Tab $radius={tabRadius}>
              <Text fontSize={14} fontWeight="semiBold">
                {label.value}
              </Text>
            </Tab>
          </Pressable>
        ))}
      </Container>
    </Box>
  );
}
```

### **Visual Specifications**:
```typescript
const visualSpecs = {
  // Container styling (creates #1E1E20 outline effect)
  containerBorder: 1,                   // 1px border
  containerBorderColor: "opacityDefault.c10", // Creates outline
  containerPadding: 2,                  // 2px internal padding
  containerRadius: 12,                  // 12px border radius
  
  // Active tab styling
  activeBackground: "opacityDefault.c05", // Animated background
  activeRadius: 8,                      // Internal tab radius
  
  // Typography
  fontSize: 14,
  fontWeight: "semiBold",
  textAlign: "center",
  
  // Animation
  animationDuration: 250,               // 250ms slide transition
};
```

---

## **3. PortfolioAssets.tsx - Container Component**

**File Path**: `ledger-live/apps/ledger-live-mobile/src/screens/Portfolio/PortfolioAssets.tsx`

This component orchestrates the quick actions bar and tab section together.

### **Component Structure**:
```typescript
import PortfolioQuickActionsBar from "./PortfolioQuickActionsBar";
import TabSection, { TAB_OPTIONS } from "./TabSection";
import useListsAnimation from "./useListsAnimation";

const PortfolioAssets = ({ hideEmptyTokenAccount, openAddModal }: Props) => {
  const initialSelectedTab = useSelector(selectedTabPortfolioAssetsSelector);
  
  const {
    handleToggle,
    selectedTab,
    assetsAnimatedStyle,
    accountsAnimatedStyle,
    containerHeight,
  } = useListsAnimation(initialSelectedTab);

  const showAssets = selectedTab === TAB_OPTIONS.Assets;
  const showAccounts = selectedTab === TAB_OPTIONS.Accounts;

  return (
    <>
      <Box my={24}>
        <PortfolioQuickActionsBar />
      </Box>
      {isAccountListUIEnabled ? (
        <TabSection
          handleToggle={handleToggle}
          initialTab={initialSelectedTab}
          showAssets={showAssets}
          showAccounts={showAccounts}
          assetsAnimatedStyle={assetsAnimatedStyle}
          accountsAnimatedStyle={accountsAnimatedStyle}
          containerHeight={containerHeight}
        />
      ) : (
        <Assets assets={assetsToDisplay} />
      )}
    </>
  );
};
```

### **Key Integration Points**:
- 24px margin (`my={24}`) between quick actions and tab section
- Feature flag `isAccountListUIEnabled` controls which UI is shown
- Uses Redux selector for initial tab state
- Connects animation hooks to tab section

---

## **4. Animation System - useListsAnimation**

**File Path**: `ledger-live/apps/ledger-live-mobile/src/screens/Portfolio/useListsAnimation.ts`

This hook manages the sliding animations between Assets and Accounts lists.

### **Animation Logic**:
```typescript
const useListsAnimation = (initialTab: TabListType) => {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const translateX = useSharedValue(selectedTab === TAB_OPTIONS.Assets ? 0 : -100);

  const handleToggle = useCallback((value: TabListType) => {
    setSelectedTab(value);
    translateX.value = withTiming(
      value === TAB_OPTIONS.Assets ? 0 : -100,
      { duration: 300 }
    );
  }, [translateX]);

  const assetsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
    opacity: selectedTab === TAB_OPTIONS.Assets ? 1 : 0.3,
  }));

  const accountsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
    opacity: selectedTab === TAB_OPTIONS.Accounts ? 1 : 0.3,
  }));

  return {
    handleToggle,
    selectedTab,
    assetsAnimatedStyle,
    accountsAnimatedStyle,
  };
};
```

### **Animation Specifications**:
- **Duration**: 300ms for list sliding transition
- **Transform**: translateX 0% for Assets, -100% for Accounts  
- **Opacity**: Active list at 1.0, inactive at 0.3
- **Layout**: 200% width container with side-by-side lists

---

## **5. List Components - AssetsListView & AccountsListView**

### **AssetsListView**
**File Path**: `ledger-live/apps/ledger-live-mobile/src/newArch/features/Assets/components/AssetsListView`

### **AccountsListView** 
**File Path**: `ledger-live/apps/ledger-live-mobile/src/newArch/features/Accounts/components/AccountsListView`

These components render the actual lists that appear when each tab is selected.

### **Usage in TabSection**:
```typescript
<AssetsListView
  sourceScreenName={ScreenName.Portfolio}
  limitNumberOfAssets={maxItemsToDysplay}
  onContentChange={handleAssetsContentSizeChange}
/>

<AccountsListView
  sourceScreenName={ScreenName.Portfolio}
  limitNumberOfAccounts={maxItemsToDysplay}
  onContentChange={handleAccountsContentSizeChange}
/>
```

---

## **6. Color Specifications from TabSelector**

### **Theme Colors Used**:
```typescript
const tabSelectorColors = {
  // Container outline (creates the #1E1E20 effect user mentioned)
  borderColor: "opacityDefault.c10",    // Semi-transparent outline
  
  // Active tab background
  activeBackground: "opacityDefault.c05", // Semi-transparent overlay
  
  // Container background (filled variant)
  filledBackground: "neutral.c30",      // Dark gray background
  
  // Text colors (inherited from theme)
  primaryText: "neutral.c100",          // White text
  secondaryText: "neutral.c70",         // Gray text
};
```

### **Visual Effect**:
- **Border**: `borderColor: "opacityDefault.c10"` creates the outline effect
- **Padding**: `p: 2` (8px) creates internal spacing for outline appearance
- **Active State**: Animated background slides behind selected tab
- **Border Radius**: 12px container, 8px internal tabs

---

## **7. Exact Component Hierarchy for Replication**

### **Component Tree**:
```
PortfolioAssets.tsx
├── Box (my={24})
│   └── PortfolioQuickActionsBar
└── TabSection (conditional on feature flag)
    ├── Box (height={40} mb={16})
    │   └── TabSelector
    │       ├── AnimatedBackground (sliding indicator)
    │       └── Pressable[] (tab buttons)
    └── Flex (flexDirection="row" width="200%")
        ├── Animated.View (assetsAnimatedStyle)
        │   └── AssetsListView
        └── Animated.View (accountsAnimatedStyle)
            └── AccountsListView
```

### **Required Imports for Replication**:
```typescript
// Core components
import { Box, Flex } from "@ledgerhq/native-ui";
import { TabSelector } from "@ledgerhq/native-ui";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from "react-native-reanimated";

// Hooks
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";

// Custom hooks
import useListsAnimation from "./useListsAnimation";
```

---

## **8. Implementation Priority for Static Replica**

### **Step 1: Core TabSelector Implementation**
- Replicate TabSelector with outline styling (`borderColor: "opacityDefault.c10"`)
- Add animated background that slides between tabs
- 40px height container with 16px bottom margin

### **Step 2: Layout Container** 
- 200% width flex container with `flexDirection="row"`
- Two animated views side-by-side for assets/accounts
- Transform animations: 0% and -100% translateX values

### **Step 3: Static List Content**
- Simple asset list for Assets tab (Bitcoin, XRP from image)
- Simple account list for Accounts tab
- No need for full AssetsListView/AccountsListView complexity

### **Step 4: Animation Integration**
- 300ms slide transition between tabs
- Opacity changes for inactive lists
- Touch handling for tab switching

This provides all the real Ledger Live components needed to recreate the Assets/Accounts toggle functionality with 100% visual fidelity.
