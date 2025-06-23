# Portfolio Header Implementation Guide

## Problem Statement

### Original Issues
1. **Header positioned too high**: The header was approximately 44px too high compared to the official Ledger Live app
2. **Navigation error**: `TypeError: useLocale is not a function` caused by version mismatch in React Navigation dependencies

### Visual Comparison
- **Official Ledger Live**: Header positioned with proper safe area insets, exactly aligned with status bar
- **Our Implementation**: Header floating above its intended position, creating visual inconsistency

## Root Cause Analysis

### 1. Header Positioning Issue
- **Missing SafeAreaView**: No proper safe area handling for notched devices
- **Incorrect positioning**: Using relative positioning instead of absolute positioning with insets
- **No scroll integration**: Header not properly integrated with scroll animations

### 2. Navigation Dependency Conflict
```bash
# Version mismatch causing the error:
@react-navigation/material-top-tabs@7.3.1 requires @react-navigation/native@^7.1.14
Current project has @react-navigation/native@6.1.7
```
- `useLocale` hook was introduced in React Navigation v7 but doesn't exist in v6
- Peer dependency warnings indicated this incompatibility

## Solution Implementation

### 1. Header Positioning Fix

#### Before (Broken):
```tsx
// Relative positioning without safe area handling
<Flex 
  flexDirection="row" 
  alignItems="center" 
  justifyContent="space-between" 
  py={3}
  px={6}
>
```

#### After (Fixed):
```tsx
// Absolute positioning with safe area insets
<AnimatedFlex
  style={[
    {
      top: insets.top,           // Critical: Safe area top inset
      height: headerHeight,      // Fixed height (64px)
      width: "100%",
      position: "absolute",      // Critical: Absolute positioning
      opacity: headerOpacity,    // Scroll-based fade animation
      zIndex: 20,               // Above tab bar
    },
    { transform: [{ translateY: headerTranslateY }] }, // Scroll animation
  ]}
>
```

#### Key Components Added:
1. **SafeAreaView**: Proper safe area handling
2. **useSafeAreaInsets**: Access to device-specific insets
3. **Absolute positioning**: Header floats above content
4. **Scroll animations**: Header hides/shows based on scroll position

### 2. Navigation Error Resolution

#### Strategy: Custom Tab Implementation
Instead of upgrading all React Navigation dependencies (risky), implemented a custom tab solution that:
- Matches exact Ledger Live visual design
- Eliminates version conflicts
- Provides better control over positioning and animations

#### Critical Design Fix: Pill-Shaped Tabs vs Underline Indicators
**❌ Incorrect Implementation (Initially Fixed):**
- Used underline indicators below text
- Different text colors for active/inactive states
- Looked like web-style tabs instead of mobile pills

**✅ Correct Implementation (Final):**
- **Pill-shaped backgrounds** with rounded corners (2px border radius)
- **Layered backgrounds**: Inactive uses semi-transparent white, active uses purple
- **Consistent white text** for both active and inactive states
- **32px fixed height** creating proper pill proportions

#### Custom Tab Components:

```tsx
// Custom tab button with exact Ledger Live pill-shaped styling
const TabButton = ({ label, isActive, onPress }: TabButtonProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        height: 32,                    // Fixed height - official spec
        justifyContent: 'center',
        marginRight: 16,               // theme.space[4] = 16px spacing
      }}
    >
      {/* Inactive background - semi-transparent white pill */}
      <Box
        position="absolute"
        top={0}
        height="100%"
        width="100%"
        backgroundColor={isActive ? "transparent" : "rgba(255, 255, 255, 0.08)"}
        borderRadius={2}               // Creates pill shape
      />
      
      {/* Active background - primary purple pill */}
      <Box
        position="absolute"
        top={0}
        height="100%"
        width="100%"
        backgroundColor={isActive ? "primary.c70" : "transparent"}
        borderRadius={2}               // Creates pill shape
      />
      
      {/* Text content - always white */}
      <Box borderRadius={2} px={4}>
        <Text 
          fontWeight="semiBold" 
          variant="body" 
          color="neutral.c100"         // Always white text
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};
```

## Architecture Overview

### Component Hierarchy
```
PortfolioScreen
├── SafeAreaView (handles notch/safe areas)
├── WalletTabBackgroundGradient (scroll-responsive)
├── Box (main content container)
│   ├── Flex (custom tab bar - positioned below header)
│   │   ├── TabButton (Crypto)
│   │   └── TabButton (Market)
│   └── Content (PortfolioContent | MarketContent)
├── AnimatedFlex (absolutely positioned header)
│   └── PortfolioHeader (title + 4 icons)
└── BottomNavigation (placeholder)
```

### Positioning System
- **Header**: `top: insets.top` (absolute positioning)
- **Tab Bar**: `top: insets.top + headerHeight` (64px below header)
- **Content**: `paddingTop: headerHeight + 40` (space for header + tabs)

## Key Measurements (Pixel-Perfect)

### Header Specifications
- **Height**: 64px (standard header height)
- **Top Position**: `insets.top` (44px on iPhone with notch)
- **Horizontal Padding**: 24px (`px={6}`)
- **Icon Spacing**: 28px (`mr={7}`)

### Tab Specifications  
- **Height**: 32px (fixed pill height)
- **Tab Spacing**: 16px between tabs (theme.space[4])
- **Border Radius**: 2px (creates pill shape)
- **Active Background**: `primary.c70` (purple pill)
- **Inactive Background**: `rgba(255, 255, 255, 0.08)` (semi-transparent white pill)
- **Text**: `variant="body"` with `fontWeight="semiBold"`, always white (`neutral.c100`)

## Developer Modification Guide

### Adjusting Header Height
```tsx
// Change this value in PortfolioScreen component
const headerHeight = 64; // Modify this value

// Update content padding accordingly
contentContainerStyle={{
  paddingTop: headerHeight + 40, // header + tab height
}}
```

### Adding New Tabs
```tsx
// 1. Add to tab state type
const [activeTab, setActiveTab] = useState<'Crypto' | 'Market' | 'NewTab'>('Crypto');

// 2. Add TabButton component
<TabButton 
  label="New Tab" 
  isActive={activeTab === 'NewTab'} 
  onPress={() => setActiveTab('NewTab')} 
/>

// 3. Add content component
{activeTab === 'NewTab' && <NewTabContent scrollY={scrollY} />}
```

### Customizing Animations
```tsx
// Header fade animation (adjust input/output ranges)
const headerOpacity = scrollY.interpolate({
  inputRange: [0, headerHeight],     // Fade starts at 0, completes at 64px
  outputRange: [1, 0],               // From fully visible to hidden
  extrapolateRight: "clamp",
});

// Header slide animation
const headerTranslateY = scrollY.interpolate({
  inputRange: [0, headerHeight],
  outputRange: [0, -headerHeight],   // Slides up by its own height
  extrapolateRight: "clamp",
});
```

### Theme Integration
Colors are pulled from `useTheme()` hook:
- **Tab Active Background**: `primary.c70` (purple pill)
- **Tab Inactive Background**: `rgba(255, 255, 255, 0.08)` (semi-transparent white pill)
- **Tab Text**: `neutral.c100` (#FFFFFF) - always white for both states
- **Header Text**: `neutral.c100` (#FFFFFF) - primary white text
- **Header Icons**: `neutral.c100` (#FFFFFF) - white icons
- **Main Background**: `background.main` (#131214) - dark background

## Testing Checklist

### Visual Verification
- [ ] Header aligns perfectly with status bar (no gap/overlap)
- [ ] Header icons are properly spaced (28px between icons)
- [ ] Tabs are positioned directly below header
- [ ] Active tab shows purple pill background (`primary.c70`)
- [ ] Inactive tab shows semi-transparent white pill background
- [ ] Both tabs have proper pill shape with 2px border radius
- [ ] Tab spacing is correct (16px between tabs)
- [ ] Scroll animations work smoothly

### Functional Testing
- [ ] Tab switching works without errors
- [ ] Header hides/shows on scroll
- [ ] Safe area handling works on notched devices
- [ ] No React Navigation dependency errors
- [ ] TypeScript compilation passes

## Dependencies Required

```json
{
  "react-native-safe-area-context": "^4.7.1",
  "react-native-reanimated": "3.16.7",
  "styled-components": "^6.1.19",
  "@ledgerhq/native-ui": "^0.35.0"
}
```

## Troubleshooting

### Header Still Appears Too High
1. Check if `SafeAreaView` is properly imported and used
2. Verify `useSafeAreaInsets()` is called and `insets.top` is applied
3. Ensure `position: "absolute"` is set on header container

### Tab Switching Not Working
1. Verify `activeTab` state is properly managed
2. Check TouchableOpacity `onPress` handlers
3. Ensure conditional rendering logic is correct

### Animation Performance Issues
1. Verify `useNativeDriver: false` in scroll event handler
2. Check if `scrollEventThrottle={16}` is set
3. Ensure animated values are not recreated on each render

## Future Enhancements

### Potential Improvements
1. **Dynamic Tab Bar**: Support for variable number of tabs
2. **Tab Gestures**: Add swipe gestures for tab switching  
3. **Header Blur**: Add blur effect when scrolling (iOS style)
4. **Tab Badges**: Support for notification badges on tabs
5. **Smooth Transitions**: Add spring animations for tab switching

### Performance Optimizations
1. Use `React.memo` for tab buttons
2. Implement `useCallback` for event handlers
3. Consider `InteractionManager` for heavy operations
4. Add `shouldUpdateComponent` for scroll optimizations

---

**Created**: 2025-01-20  
**Last Updated**: 2025-01-20  
**Version**: 1.1.0  
**Status**: Production Ready ✅  
**Latest Change**: Fixed tab styling to use pill-shaped backgrounds (matching official Ledger Live design) 