# Ledger Live Mobile Bottom Navigation Menu - Technical Specification

## Overview
The bottom navigation menu in Ledger Live Mobile is a custom-designed tab bar with a distinctive curved cutout in the center to accommodate a floating action button (FAB). It uses React Navigation's bottom tab navigator with extensive customization through styled-components and SVG graphics.

## Core Dependencies & Imports

### Primary Navigation Imports
```typescript
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components/native";
import { IconsLegacy } from "@ledgerhq/native-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
```

### Custom Components Imports
```typescript
import Transfer, { TransferTabIcon } from "../TabBar/Transfer";
import customTabBar from "../TabBar/CustomTabBar";
import TabIcon from "../TabIcon";
import { PortfolioTabIcon } from "~/screens/Portfolio";
import MyLedgerNavigator, { ManagerTabIcon } from "./MyLedgerNavigator";
```

### Styling & Animation Imports
```typescript
import styled from "styled-components/native";
import Svg, { Path, Stop } from "react-native-svg";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import Lottie from "lottie-react-native";
```

## Exact Dimensions & Constants

### Critical Measurements (from shared.tsx)
```typescript
export const TAB_BAR_HEIGHT = 56;        // Tab bar main height
export const GRADIENT_HEIGHT = 103;      // Background gradient height  
export const MAIN_BUTTON_SIZE = 64;      // FAB button diameter
export const MAIN_BUTTON_BOTTOM = 16;    // FAB bottom offset from tab bar
export const TAB_BAR_SAFE_HEIGHT = Math.max(
  GRADIENT_HEIGHT,
  Math.max(TAB_BAR_HEIGHT, MAIN_BUTTON_SIZE + MAIN_BUTTON_BOTTOM)
); // = 103px (calculated safe height for layouts)
```

### Additional Layout Constants
- **Screen Width**: 375px (SVG viewBox assumption)
- **FAB Hit Slop**: `{ top: 10, left: 25, right: 25, bottom: 25 }`
- **Border Radius**: 32px (FAB - perfect circle)
- **Icon Size**: 24px (standard tab icons)
- **Animation Duration**: 400ms (drawer transitions)

## Component Architecture

### Main Navigator Structure (`MainNavigator.tsx`)

#### Tab Navigator Configuration
```typescript
const Tab = createBottomTabNavigator<MainNavigatorParamList>();

<Tab.Navigator
  tabBar={tabBar}
  screenOptions={{
    tabBarStyle: [{
      height: 300,                              // Large height for positioning
      borderTopColor: colors.neutral.c30,      // Light border
      borderTopWidth: 1,                       // 1px border
      elevation: 5,                            // Android shadow
      shadowColor: colors.neutral.c30,        // iOS shadow
      backgroundColor: colors.opacityDefault.c10, // Semi-transparent bg
    }],
    unmountOnBlur: true,                       // Performance optimization
    tabBarShowLabel: false,                    // Hide default labels
    tabBarActiveTintColor: colors.palette.primary.c80,   // Purple #7C3AED
    tabBarInactiveTintColor: colors.palette.neutral.c70, // Gray
    headerShown: false,
  }}
  sceneContainerStyle={[{ backgroundColor: colors.background.main }]}
>
```

#### Tab Definitions & Icons

**1. Portfolio Tab** (`NavigatorName.Portfolio`)
```typescript
<Tab.Screen
  name={NavigatorName.Portfolio}
  component={PortfolioNavigator}
  options={{
    tabBarIcon: props => <PortfolioTabIcon {...props} />,
  }}
/>
```
- Icon: `WalletMedium` from `@ledgerhq/native-ui/assets/icons`
- i18n Key: `"tabs.portfolio"`

**2. Earn Tab** (`NavigatorName.Earn`)
```typescript
<Tab.Screen
  name={NavigatorName.Earn}
  component={EarnLiveAppNavigator}
  options={{
    tabBarIcon: props => (
      <TabIcon
        Icon={IconsLegacy.LendMedium}
        i18nKey={earnYiedlLabel}
        testID="tab-bar-earn"
        {...props}
      />
    ),
  }}
/>
```
- Icon: `IconsLegacy.LendMedium` (24px)
- Test ID: `"tab-bar-earn"`
- Dynamic Label: Based on locale (`getStakeLabelLocaleBased()`)

**3. Transfer Tab (CENTER FAB)** (`ScreenName.Transfer`)
```typescript
<Tab.Screen
  name={ScreenName.Transfer}
  component={Transfer}
  options={{
    tabBarIcon: () => <TransferTabIcon />,
  }}
/>
```
- Position: Index 2 (center position)
- Test ID: `"transfer-button"`

**4. Discover/Web3Hub Tab**
```typescript
// Conditional based on feature flag
{web3hub?.enabled ? (
  <Tab.Screen
    name={NavigatorName.Web3HubTab}
    component={Web3HubTabNavigator}
    options={{
      tabBarIcon: props => (
        <TabIcon 
          Icon={IconsLegacy.PlanetMedium} 
          i18nKey="tabs.discover" 
          {...props} 
        />
      ),
    }}
  />
) : (
  <Tab.Screen
    name={NavigatorName.Discover}
    component={DiscoverNavigator}
    options={{
      tabBarIcon: props => (
        <TabIcon 
          Icon={IconsLegacy.PlanetMedium} 
          i18nKey="tabs.discover" 
          {...props} 
        />
      ),
    }}
  />
)}
```
- Icon: `IconsLegacy.PlanetMedium` (24px)

**5. My Ledger Tab** (`NavigatorName.MyLedger`)
```typescript
<Tab.Screen
  name={NavigatorName.MyLedger}
  component={MyLedgerNavigator}
  options={{
    tabBarIcon: props => <ManagerTabIcon {...props} />,
    tabBarTestID: "TabBarManager",
  }}
/>
```
- Dynamic Icon: Device-specific (Nano S, Nano X, Stax, Europa)
- Badge: Update indicator with purple dot
- Test ID: `"TabBarManager"`

## Custom Tab Bar Implementation (`CustomTabBar.tsx`)

### SVG Shape Definition
The distinctive curved cutout is created using a precise SVG path:

```typescript
function TabBarShape({ color }: SvgProps) {
  return (
    <Svg width={375} height={TAB_BAR_HEIGHT} viewBox={`0 0 375 ${TAB_BAR_HEIGHT}`} fill="none">
      <Path d="M0 0H80V56H0V0Z" fill={color} />
      <Path
        d="M80 0H130.836C140.091 0 148.208 6.17679 150.676 15.097L151.848 19.3368C156.369 35.6819 171.243 47 188.202 47C205.439 47 220.484 35.3142 224.748 18.6125L225.645 15.097C227.913 6.21473 235.914 0 245.081 0H295V56H80V0Z"
        fill={color}
      />
      <Path d="M295 0H375V56H295V0Z" fill={color} />
    </Svg>
  );
}
```

**Shape Breakdown**:
- **Left Section**: 0-80px (straight rectangle)
- **Center Section**: 80-295px (curved cutout for FAB) 
- **Right Section**: 295-375px (straight rectangle)
- **Cutout Depth**: 47px (maximum curve depth)

### Background Color Logic
```typescript
const getBgColor = (colors: ColorPalette) =>
  colors.type === "light" ? colors.neutral.c00 : colors.neutral.c20;
```

### Gradient System

**Dark Theme Gradients**:
```typescript
const darkGradients = [
  {
    height: GRADIENT_HEIGHT, // 103px
    opacity: 0.8,
    stops: [
      <Stop key="0%" offset="0%" stopOpacity={0} stopColor="#131214" />,
      <Stop key="100%" offset="100%" stopOpacity={1} stopColor="#131214" />,
    ],
  },
  {
    height: 85, // Secondary gradient
    opacity: 0.8,
    stops: [
      <Stop key="0%" offset="0%" stopOpacity={0} stopColor="#131214" />,
      <Stop key="100%" offset="100%" stopOpacity={1} stopColor="#131214" />,
    ],
  },
];
```

**Light Theme Gradients**:
```typescript
const lightGradients = [
  {
    height: GRADIENT_HEIGHT, // 103px
    opacity: 1,
    stops: [
      <Stop key="0%" offset="0" stopOpacity={0} stopColor="#ffffff" />,
      <Stop key="100%" offset="100%" stopOpacity={0.8} stopColor="#ffffff" />,
    ],
  },
  {
    height: 85, // Shadow gradient
    opacity: 0.8,
    stops: [
      <Stop key="0%" offset="0" stopOpacity={0} stopColor="#ffffff" />,
      <Stop key="57%" offset="57%" stopOpacity={0.15} stopColor="#000000" />,
      <Stop key="100%" offset="100%" stopOpacity={0.15} stopColor="#000000" />,
    ],
  },
];
```

### Tab Positioning Logic
```typescript
{state.routes.map((route, index) => {
  const { options } = descriptors[route.key];
  const Icon = options.tabBarIcon as React.ElementType<{ color: string }>;
  const isFocused = state.index === index;

  // Special handling for center FAB (index 2)
  if (index === 2) {
    return (
      <React.Fragment key={index}>
        <Flex flex={1} />
        <MiddleIconContainer
          pointerEvents="box-none" 
          style={{
            height: Dimensions.get("screen").height,
            bottom: bottomInset ? -bottomInset : bottomInset,
          }}
        >
          <Icon color={isFocused ? colors.primary.c80 : colors.neutral.c80} />
        </MiddleIconContainer>
      </React.Fragment>
    );
  }

  // Standard tab handling
  return (
    <Touchable
      key={index}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Icon color={isFocused ? colors.primary.c80 : colors.neutral.c80} />
    </Touchable>
  );
})}
```

## Center FAB Button (`Transfer.tsx`)

### Button Styling
```typescript
const MainButton = proxyStyled(Touchable).attrs({
  backgroundColor: "primary.c80",           // Purple #7C3AED
  height: MAIN_BUTTON_SIZE,                // 64px
  width: MAIN_BUTTON_SIZE,                 // 64px  
  borderRadius: MAIN_BUTTON_SIZE / 2,      // 32px (perfect circle)
  overflow: "hidden",
})<BaseStyledProps>`
  border-radius: 40px;                     // Redundant but explicit
  align-items: center;
  justify-content: center;
`;
```

### Positioning
```typescript
<MainButton
  activeOpacity={1}
  disabled={lockSubject.getValue()}
  hitSlop={hitSlop}                        // Expanded touch area
  onPress={onPressButton}
  bottom={MAIN_BUTTON_BOTTOM + bottomInset} // 16px + safe area
  testID="transfer-button"
>
```

### Lottie Animation
```typescript
const ButtonAnimation = Animated.createAnimatedComponent(
  proxyStyled(Lottie).attrs({
    height: MAIN_BUTTON_SIZE,              // 64px
    width: MAIN_BUTTON_SIZE,               // 64px
  })``,
);

// Theme-specific animations
<ButtonAnimation
  source={themeType === "light" ? lightAnimSource : darkAnimSource}
  animatedProps={lottieProps}
  loop={false}
/>
```

**Animation States**:
- `progress: 0` → Transfer arrows icon (default state)
- `progress: 0.5` → Close X icon (drawer open)  
- `progress: 1` → Transfer arrows icon (closing)

**Animation Sources**:
- **Dark**: `~/animations/mainButton/dark.json`
- **Light**: `~/animations/mainButton/light.json`

### Animation Timing
```typescript
const DURATION_MS = Config.DETOX ? 50 : 400;  // Test vs. production
const Y_AMPLITUDE = 90;                        // Drawer slide distance

const animParams = { duration: DURATION_MS };
```

## Standard Tab Icon Implementation

### TabIcon Component Structure
```typescript
function TabIcon({ Icon, i18nKey, color, testID }: Props) {
  return (
    <TabIconContainer testID={testID}>
      <Icon size={24} color={color} />
      <Text
        numberOfLines={1}
        fontWeight="semiBold"
        variant="tiny"
        textAlign="center"
        pt={2}                             // 8px top padding
        color={color}
      >
        {t(i18nKey)}
      </Text>
    </TabIconContainer>
  );
}
```

### Typography Specifications
- **Font Family**: Inter (custom loaded)
- **Text Variant**: `"tiny"` (smallest size in design system)
- **Font Weight**: `"semiBold"`
- **Line Height**: Single line (`numberOfLines={1}`)
- **Alignment**: Center aligned
- **Padding**: 8px top spacing (`pt={2}`)

### Container Styling
```typescript
const TabIconContainer = styled(Flex).attrs({
  flex: 1,
  alignItems: "center",
  pt: 2,                                   // 8px top padding
})``;
```

## Color System

### Active/Inactive States
```typescript
// Tab Navigator Options
tabBarActiveTintColor: colors.palette.primary.c80,    // #7C3AED (Purple)
tabBarInactiveTintColor: colors.palette.neutral.c70,  // Gray
```

### Background Colors
```typescript
// Light Theme
colors.neutral.c00                         // White background
colors.neutral.c30                         // Border color

// Dark Theme  
colors.neutral.c20                         // Dark background (#1C1D1F)
colors.background.main                     // Primary dark (#131214)
```

### Accent Colors
```typescript
colors.primary.c80                         // Purple FAB (#7C3AED)
colors.constant.purple                     // Badge color
colors.opacityDefault.c10                 // Semi-transparent overlay
```

## Manager Tab Icon - Device-Specific Icons

### Device Icon Mapping
```typescript
switch (lastSeenDevice?.modelId) {
  case DeviceModelId.nanoS:
  case DeviceModelId.nanoSP:
    return <IconsLegacy.NanoSFoldedMedium size={size} color={color} />;
  case DeviceModelId.stax:
    return <IconsLegacy.StaxMedium size={size} color={color} />;
  case DeviceModelId.europa:
    return <Icons.Flex color={color} />;
  case DeviceModelId.nanoX:
  default:
    return <IconsLegacy.NanoXFoldedMedium size={size} color={color} />;
}
```

### Update Badge Styling
```typescript
const BadgeContainer = styled(Flex).attrs({
  position: "absolute",
  top: -1,                                 // Slight overlap
  right: -1,                               // Top-right corner
  width: 14,                               // 14px diameter
  height: 14,
  borderRadius: 7,                         // Perfect circle
  borderWidth: 3,                          // 3px border
})``;
```

**Badge Properties**:
- **Size**: 14px diameter
- **Position**: Absolute top-right (-1px offset)
- **Background**: `colors.constant.purple`
- **Border**: 3px of `colors.background.main`

## Layout & Positioning System

### Container Structure
```typescript
<Flex
  width="100%"
  flexDirection="row"
  height={TAB_BAR_HEIGHT}                  // 56px
  bottom={bottomInset}                     // Safe area compensation
  position="absolute"
  overflow="visible"                       // Allow FAB overflow
>
  <BackgroundGradient {...gradients[0]} />
  <BackgroundGradient {...gradients[1]} />
  <BottomFiller />                         // Extends below safe area
  <BackgroundFiller left={0} />            // Left side filler
  <BackgroundFiller right={0} />           // Right side filler
  <TabBarShape />                          // SVG cutout shape
  {/* Tab icons rendered here */}
</Flex>
```

### Safe Area Handling
```typescript
const { bottom: bottomInset } = useSafeAreaInsets();

// Applied to:
// - Tab bar positioning: bottom={bottomInset}
// - FAB positioning: bottom={MAIN_BUTTON_BOTTOM + bottomInset}
// - Background fillers: height={bottomInset}
```

## Animation System

### Show/Hide Animation
```typescript
<Animated.View>
  {!hideTabBar && (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
      <TabBar {...props} />
    </Animated.View>
  )}
</Animated.View>
```

### FAB Drawer Animation
```typescript
// Open/Close progress (0 → 1 → 2)
const openAnimValue = useSharedValue(initialIsModalOpened ? 1 : 0);

// Translate Y animation
const translateYStyle = useAnimatedStyle(() => ({
  transform: [{
    translateY: interpolate(openAnimValue.value, [0, 1, 2], [Y_AMPLITUDE, 0, Y_AMPLITUDE]),
  }],
}));

// Lottie progress animation  
const lottieProps = useAnimatedProps(() => ({
  progress: interpolate(openAnimValue.value, [0, 1, 2], [0, 0.5, 1]),
}));
```

## Performance Optimizations

### Component Memoization
- All tab icons use `React.memo` for re-render prevention
- Lottie animations cached per theme
- SVG paths optimized for hardware acceleration

### Navigation Optimizations
```typescript
screenOptions={{
  unmountOnBlur: true,                     // Prevents ghost interactions
  // ... other options
}}
```

### Touch Handling
```typescript
const hitSlop = {
  top: 10,
  left: 25, 
  right: 25,
  bottom: 25,
};
// Expanded touch area for better UX without visual changes
```

## Accessibility Features

### ARIA Properties
```typescript
<Touchable
  accessibilityRole="button"
  accessibilityState={isFocused ? { selected: true } : {}}
  accessibilityLabel={options.tabBarAccessibilityLabel}
  testID={options.tabBarTestID}
>
```

### Test IDs for Automation
- Portfolio: Default tab behavior
- Earn: `"tab-bar-earn"`
- Transfer: `"transfer-button"`
- Discover: Default tab behavior  
- Manager: `"TabBarManager"`

## Implementation Notes

### Critical Dependencies
1. **React Navigation**: `@react-navigation/bottom-tabs`
2. **Native UI**: `@ledgerhq/native-ui` (Icons, Typography, Spacing)
3. **Styled Components**: `styled-components/native` (Theming, Styling)
4. **SVG**: `react-native-svg` (Custom shapes)
5. **Animation**: `react-native-reanimated` (Transitions)
6. **Lottie**: `lottie-react-native` (FAB icon animations)

### Theme Integration
- Colors are semantic tokens from the design system
- Light/dark theme switching handled automatically
- Typography follows Inter font family with design system weights
- Spacing uses 4px base unit system (multiplied by theme tokens)

### Responsive Considerations
- Fixed 375px width assumption for SVG (iPhone X baseline)
- Dynamic height based on safe area insets
- Scales with system font size settings
- Hardware acceleration for smooth 60fps performance

This specification provides complete technical details for pixel-perfect replication of the Ledger Live Mobile bottom navigation menu system.