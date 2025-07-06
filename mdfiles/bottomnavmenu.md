# Ledger Live Mobile Bottom Navigation Menu - Component Analysis

## Overview
The bottom navigation menu in Ledger Live Mobile is a custom-designed tab bar with a distinctive curved cutout in the center to accommodate a floating action button (FAB). It uses React Navigation's bottom tab navigator with extensive customization through styled-components and SVG graphics.

## Key Dimensions & Constants
- **Tab Bar Height**: 56px (`TAB_BAR_HEIGHT`)
- **FAB Button Size**: 64px diameter (`MAIN_BUTTON_SIZE`) 
- **FAB Bottom Offset**: 16px (`MAIN_BUTTON_BOTTOM`)
- **Gradient Height**: 103px (`GRADIENT_HEIGHT`)
- **Safe Height**: 103px (calculated max of all heights)

## Component Architecture

### Main Navigation Structure (`MainNavigator.tsx`)
The bottom navigation is implemented using `@react-navigation/bottom-tabs` with five main screens:

```typescript
<Tab.Navigator
  tabBar={tabBar}
  screenOptions={{
    tabBarStyle: {
      height: 300,
      borderTopColor: colors.neutral.c30,
      borderTopWidth: 1,
      elevation: 5,
      shadowColor: colors.neutral.c30,
      backgroundColor: colors.opacityDefault.c10,
    },
    tabBarShowLabel: false,
    tabBarActiveTintColor: colors.palette.primary.c80,
    tabBarInactiveTintColor: colors.palette.neutral.c70,
  }}
>
```

### Tab Configuration
1. **Portfolio Tab** (`NavigatorName.Portfolio`)
   - Icon: `WalletMedium` from `@ledgerhq/native-ui/assets/icons`
   - Component: `PortfolioTabIcon`
   - i18n Key: `"tabs.portfolio"`

2. **Earn Tab** (`NavigatorName.Earn`) 
   - Icon: `IconsLegacy.LendMedium`
   - i18n Key: Dynamic based on locale (`earnYiedlLabel`)
   - Test ID: `"tab-bar-earn"`

3. **Transfer Tab** (`ScreenName.Transfer`) - **CENTER FAB**
   - Component: `TransferTabIcon` (special FAB button)
   - Position: Index 2 (middle position)
   - Test ID: `"transfer-button"`

4. **Discover/Web3Hub Tab**
   - Icon: `IconsLegacy.PlanetMedium`
   - i18n Key: `"tabs.discover"`
   - Conditional: Shows Web3HubTab if feature flag enabled, otherwise Discover

5. **My Ledger Tab** (`NavigatorName.MyLedger`)
   - Component: `ManagerTabIcon` (dynamic device icon with badge)
   - Test ID: `"TabBarManager"`
   - Shows device-specific icons (Nano S, Nano X, Stax, Europa)

## Custom Tab Bar Implementation (`CustomTabBar.tsx`)

### Background Shape & SVG
The distinctive curved shape is created using SVG path definitions:

```typescript
function TabBarShape({ color }: SvgProps) {
  return (
    <Svg width={375} height={56} viewBox="0 0 375 56">
      <Path d="M0 0H80V56H0V0Z" fill={color} />
      <Path d="M80 0H130.836C140.091 0 148.208 6.17679 150.676 15.097L151.848 19.3368C156.369 35.6819 171.243 47 188.202 47C205.439 47 220.484 35.3142 224.748 18.6125L225.645 15.097C227.913 6.21473 235.914 0 245.081 0H295V56H80V0Z" fill={color} />
      <Path d="M295 0H375V56H295V0Z" fill={color} />
    </Svg>
  );
}
```

This creates three sections:
- Left section (0-80px): Straight rectangle
- Center section (80-295px): Curved cutout for FAB button
- Right section (295-375px): Straight rectangle

### Background Color Logic
```typescript
const getBgColor = (colors: ColorPalette) =>
  colors.type === "light" ? colors.neutral.c00 : colors.neutral.c20;
```

### Gradient System
Two different gradient configurations for light/dark themes:

**Dark Theme Gradients:**
```typescript
const darkGradients = [
  {
    height: 103,
    opacity: 0.8,
    stops: [
      <Stop offset="0%" stopOpacity={0} stopColor="#131214" />,
      <Stop offset="100%" stopOpacity={1} stopColor="#131214" />,
    ],
  },
  // Additional 85px gradient...
];
```

**Light Theme Gradients:**
```typescript
const lightGradients = [
  {
    height: 103,
    opacity: 1,
    stops: [
      <Stop offset="0" stopOpacity={0} stopColor="#ffffff" />,
      <Stop offset="100%" stopOpacity={0.8} stopColor="#ffffff" />,
    ],
  },
  // Additional shadow gradient...
];
```

## Individual Tab Icons

### Standard Tab Icon Component (`TabIcon.tsx`)
Each regular tab follows this structure:

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
        pt={2}
        color={color}
      >
        {t(i18nKey)}
      </Text>
    </TabIconContainer>
  );
}
```

**Styling Details:**
- Icon Size: 24px
- Text Variant: `"tiny"` 
- Font Weight: `"semiBold"`
- Padding Top: 8px (`pt={2}` = theme.space[2])
- Container: Flex 1, centered alignment, 8px top padding

### Active/Inactive States
- **Active Color**: `colors.palette.primary.c80` (Purple #7C3AED)
- **Inactive Color**: `colors.palette.neutral.c70` (Gray)

### Portfolio Tab Icon (`PortfolioTabIcon`)
```typescript
export default function PortfolioTabIcon(props: { color: string }) {
  return <TabIcon Icon={WalletMedium} i18nKey="tabs.portfolio" {...props} />;
}
```

### Manager Tab Icon (`ManagerTabIcon`)
Dynamic icon based on last seen device with update badge:

```typescript
const DeviceIcon = ({ color, size = 16 }) => {
  const hasAvailableUpdate = useSelector(hasAvailableUpdateSelector);
  const lastSeenDevice = useSelector(lastSeenDeviceSelector);

  // Device-specific icons:
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
};
```

**Update Badge Styling:**
```typescript
const BadgeContainer = styled(Flex).attrs({
  position: "absolute",
  top: -1,
  right: -1,
  width: 14,
  height: 14,
  borderRadius: 7,
  borderWidth: 3,
})``;
```
- Size: 14px diameter
- Color: `colors.constant.purple`
- Border: 3px of `colors.background.main`
- Position: Top-right corner of icon

## Center FAB Button (`TransferTabIcon`)

### Button Styling
```typescript
const MainButton = proxyStyled(Touchable).attrs({
  backgroundColor: "primary.c80",
  height: 64,
  width: 64,
  borderRadius: 32,
  overflow: "hidden",
})`
  align-items: center;
  justify-content: center;
`;
```

**Key Properties:**
- Size: 64px diameter 
- Background: `primary.c80` (Purple #7C3AED)
- Border Radius: 32px (perfect circle)
- Position: Absolute, centered in cutout
- Bottom Offset: 16px + safe area inset

### Lottie Animation
The FAB uses Lottie animations for state transitions:
- **Light Theme**: `~/animations/mainButton/light.json`
- **Dark Theme**: `~/animations/mainButton/dark.json`

Animation States:
- `progress: 0` - Transfer arrows icon (closed state)
- `progress: 0.5` - Close X icon (open state) 
- `progress: 1` - Transfer arrows icon (closing)

### Hit Area
```typescript
const hitSlop = {
  top: 10,
  left: 25,
  right: 25,
  bottom: 25,
};
```

### Transfer Drawer
When pressed, opens a modal drawer (`TransferDrawer`) with actions:
- **Send** - Transfer crypto to another address
- **Receive** - Generate receiving address
- **Buy** - Purchase crypto
- **Sell** - Sell crypto 
- **Swap** - Exchange between currencies
- **Stake** - Earn rewards
- **Recover** - Account recovery services

## Layout & Positioning

### Container Structure
```typescript
<Flex
  width="100%"
  flexDirection="row"
  height={56}
  bottom={bottomInset}
  position="absolute"
  overflow="visible"
>
  <BackgroundGradient {...gradients[0]} />
  <BackgroundGradient {...gradients[1]} />
  <BottomFiller />
  <BackgroundFiller left={0} />
  <BackgroundFiller right={0} />
  <TabBarShape />
  {/* Tab icons */}
</Flex>
```

### Center FAB Positioning
Special handling for index 2 (Transfer tab):
```typescript
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
```

### Safe Area Handling
- Uses `useSafeAreaInsets()` for device-specific spacing
- Bottom inset compensation for home indicator
- Background fillers extend beyond safe area

## Animation & Interactions

### Tab Press Handling
- Standard tabs: Navigate with merge params
- Transfer tab: Toggle drawer with Lottie animation
- Manager tab: Conditional locking behavior
- Analytics tracking on all interactions

### Show/Hide Animation
Uses `react-native-reanimated` for enter/exit:
```typescript
<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
  <TabBar {...props} />
</Animated.View>
```

## Theme Integration

### Color Tokens
- Background: `colors.neutral.c00` (light) / `colors.neutral.c20` (dark)
- Border: `colors.neutral.c30`
- Active Tint: `colors.palette.primary.c80` 
- Inactive Tint: `colors.palette.neutral.c70`
- Shadow: `colors.neutral.c30`

### Typography
- Font Family: Inter (custom loaded)
- Tab Labels: `variant="tiny"`, `fontWeight="semiBold"`
- Color: Inherits from active/inactive tint

## Accessibility

### Touch Targets
- Standard tabs: Full flex area
- FAB: 64px + 25px hit slop expansion
- Accessibility labels from navigation options
- Screen reader support via `accessibilityRole="button"`

### Test IDs
- Portfolio: Default tab behavior
- Earn: `"tab-bar-earn"`
- Transfer: `"transfer-button"`  
- Discover: Default tab behavior
- Manager: `"TabBarManager"`

## Implementation Notes

### Performance
- Uses `React.memo` for tab icons
- Lottie animations cached per theme
- SVG paths optimized for 60fps
- Gradient backgrounds use hardware acceleration

### Responsive Design
- Fixed 375px width assumption for SVG
- Dynamic height based on safe areas
- Scales with system font size settings

### Error Handling
- Graceful fallback for missing device icons
- Default Nano X icon when device unknown
- Drawer handles navigation locks during firmware updates

This bottom navigation system provides a polished, branded experience with smooth animations, device-aware iconography, and comprehensive accessibility support while maintaining high performance across different device sizes and themes.
