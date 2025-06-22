# Background Gradient Components Analysis

## Overview

The Ledger Live mobile app uses two distinct gradient components to create its signature visual design. This document explains the purpose, implementation, and usage of each gradient component in the codebase.

## **WalletTabBackgroundGradient.tsx** - The Main Purple Background Gradient

### **Purpose:**
This component creates the beautiful **purple-to-black gradient background** that you see throughout the Ledger Live mobile app. It's the primary visual element that gives the app its signature dark theme with purple accents, creating the flowing gradient effect from purple at the top transitioning to the dark background.

### **Technical Implementation:**

The component uses a complex SVG-based approach with multiple layered gradients:

```typescript
<Svg width={850} height={480} viewBox="0 0 850 480">
  <Path fill="url(#paint0_linear_9_2)" d="M0 0H850V480H0z" />      // Base linear gradient
  <Path fill="url(#paint1_radial_9_2)" d="M0 0H850V480H0z" />      // First radial overlay  
  <Path fill="url(#paint2_radial_9_2)" d="M0 0H850V480H0z" />      // Second radial overlay
  <Path fill="url(#paint3_linear_9_2)" d="M0 0H850V480H0z" />      // Blend to background
</Svg>
```

### **Gradient Layers Breakdown:**

1. **Primary Linear Gradient (`paint0_linear_9_2`)**:
   - Colors: `#BE96FF` to `#BE97FF`
   - Direction: Vertical (top to bottom)
   - Purpose: Base purple foundation

2. **First Radial Gradient (`paint1_radial_9_2`)**:
   - Colors: `#B7A6F5` → `#B09BF1` (77% opacity) → `#9678E3` (transparent)
   - Transform: `matrix(131.49984 186.99987 -218.94593 153.96457 172 252.5)`
   - Purpose: Light purple glow effect

3. **Second Radial Gradient (`paint2_radial_9_2`)**:
   - Colors: `#8069D5` → `#AC91F8` → `#BE9BFD` (transparent)
   - Transform: `matrix(-138.50157 186.49933 -184.81339 -137.24953 361.5 250)`
   - Purpose: Deeper purple accent with different positioning

4. **Background Blend (`paint3_linear_9_2`)**:
   - Colors: Background color (`#131214`) with 60% opacity → 100% background color
   - Purpose: Smooth transition to app background

### **Positioning & Layout:**
```typescript
const backgroundStyle = {
  position: 'absolute',
  width: Math.max(850, screenWidth + 100),  // Responsive width
  height: 480,
  top: -130,        // Extends above visible area
  left: -50,        // Extends beyond screen edges
  opacity: 1,
}
```

### **Where It's Used:**

#### **1. Portfolio Screen** (`src/screens/Portfolio/index.tsx`):
```typescript
<Flex flex={1} backgroundColor="background.main">
  {/* Background Gradient - Always visible for beautiful purple effect */}
  <WalletTabBackgroundGradient />
  
  {/* Rest of screen content */}
</Flex>
```

#### **2. Tab Navigator** (`WalletTabNavigatorTabBar.tsx`):
```typescript
<WalletTabBackgroundGradient
  scrollX={position}
  color={readOnlyModeEnabled && hasNoAccounts ? colors.neutral.c30 : undefined}
/>
```

### **Animation Features (Original Ledger Live):**

In the real Ledger Live implementation, this component includes:

- **Scroll-based opacity changes**: Fades as user scrolls
- **Position animations**: Moves with scroll interactions  
- **Conditional color variations**: Changes based on app state
- **Material Top Tab integration**: Responds to tab navigation

---

## **Scroll-Responsive Gradient Behavior**

### **Critical Missing Feature: Vertical Scroll Animation**

In real Ledger Live, the purple gradient **fades out when you scroll down** through the portfolio assets list. This is a key behavioral difference that affects the user experience.

#### **Current Implementation (Static)**
```typescript
// Portfolio/index.tsx - No scroll tracking
<ScrollView showsVerticalScrollIndicator={false}>
  {/* Assets list */}
</ScrollView>

// WalletTabBackgroundGradient - Static opacity
<WalletTabBackgroundGradient />  // Always visible, never fades
```

#### **Real Ledger Live Behavior**
When scrolling down through assets:
1. **Purple gradient fades out** (becomes transparent)
2. **Tab bar becomes more prominent** 
3. **Smooth transition** between gradient visible → hidden states
4. **Scroll up** brings gradient back

### **How Real Ledger Live Implements Scroll Response**

#### **Dual-Axis Animation System**
```typescript
// In WalletTabBackgroundGradient.tsx (original)
const opacity = multiply(
  scrollY.interpolate({        // ← Vertical scroll on portfolio page
    inputRange: [0, headerHeight],
    outputRange: [1, 0],       // Fade out as you scroll down
    extrapolate: "clamp",
  }),
  scrollX.interpolate({        // ← Horizontal tab switching  
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: "clamp",
  }),
);
```

#### **Scroll Context Integration**
```typescript
const { scrollY, headerHeight } = useContext(WalletTabNavigatorScrollContext);

// Applied to gradient container
<Animated.View style={[{ opacity }, backgroundStyle]}>
  <Svg>...</Svg>
</Animated.View>
```

### **Implementation for 100% Fidelity**

To achieve the authentic scroll-responsive gradient behavior:

#### **1. Scroll Tracking Setup**
```typescript
// Portfolio/index.tsx
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation 
} from 'react-native-reanimated';

const PortfolioScreen = () => {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Flex flex={1} backgroundColor="background.main">
      <WalletTabBackgroundGradient scrollY={scrollY} />
      
      {/* Replace ScrollView with Animated.ScrollView */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <GraphCard areAccountsEmpty={false} />
        {/* Assets list */}
      </Animated.ScrollView>
    </Flex>
  );
};
```

#### **2. Update Gradient Component Props**
```typescript
// WalletTabBackgroundGradient.tsx
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

type Props = {
  scrollY?: Animated.SharedValue<number>;
  scrollX?: Animated.SharedValue<number>;
  color?: string;
};

function WalletTabBackgroundGradient({ scrollY, scrollX, color }: Props) {
  const { colors } = useTheme();

  const gradientOpacity = useAnimatedStyle(() => {
    let opacity = 1;

    // Fade out on vertical scroll
    if (scrollY) {
      opacity *= interpolate(
        scrollY.value,
        [0, 200],        // Start fading after 200px scroll
        [1, 0],          // From 100% to 0% opacity
        Extrapolation.CLAMP
      );
    }

    // Fade out on horizontal tab switch
    if (scrollX) {
      opacity *= interpolate(
        scrollX.value,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP
      );
    }

    return { opacity };
  }, [scrollY, scrollX]);

  return (
    <Animated.View 
      style={[
        {
          backgroundColor: colors.background?.main || '#131214',
          position: 'absolute',
          width: Math.max(850, screenWidth + 100),
          height: 480,
          top: -130,
          left: -50,
        },
        gradientOpacity  // Apply animated opacity
      ]}
    >
      {/* SVG gradient content */}
    </Animated.View>
  );
}
```

#### **3. Scroll Thresholds**
```typescript
// Typical scroll animation values
const HEADER_HEIGHT = 200;    // Start fading after header area
const FADE_DISTANCE = 100;    // Distance over which to fade

const scrollAnimation = scrollY.interpolate({
  inputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT + FADE_DISTANCE],
  outputRange: [1, 1, 0],     // Stay visible, then fade
  extrapolate: 'clamp',
});
```

### **Visual Behavior Comparison**

#### **Current Static Implementation:**
- ✅ **Shows gradient**: Beautiful purple background
- ❌ **No scroll response**: Gradient stays visible always
- ❌ **Missing interaction**: Doesn't feel like real Ledger Live

#### **Real Ledger Live Behavior:**
- ✅ **Shows gradient**: Same beautiful purple background
- ✅ **Scroll response**: Fades out when scrolling down
- ✅ **Interactive feel**: Natural scrolling experience
- ✅ **Performance**: Smooth 60fps animations

### **Implementation Complexity Trade-offs**

#### **Static Approach (Current):**
- **Pros**: Simple, lightweight, shows visual design
- **Cons**: Missing authentic scroll behavior
- **Use case**: Static UI replication, demos

#### **Scroll-Responsive Approach:**
- **Pros**: 100% authentic behavior, better UX
- **Cons**: Requires react-native-reanimated, more complex
- **Use case**: Full app replication, production apps

### **Decision Framework**

**Choose Static** if:
- Focus is on visual design replication
- Simplicity is preferred
- No interactive behavior needed

**Choose Scroll-Responsive** if:
- Goal is 100% behavioral fidelity
- Building a production app
- Want authentic Ledger Live experience

---

## **DefGrad.tsx** (DefGraph) - The Simple Chart Gradient

### **Purpose:**
This is a **much simpler gradient component** specifically designed for chart areas and graph fills. It creates a subtle fade effect under line charts in portfolio balance displays.

### **Technical Implementation:**

```typescript
const DefGraph = ({height, color}: Props) => {
  return (
    <LinearGradient
      id="grad"
      x1="0"
      y1="0"
      x2="0"
      y2={height}
      gradientUnits="userSpaceOnUse">
      <Stop offset="0" stopColor={color} stopOpacity="0.3" />    // 30% opacity at top
      <Stop offset="1" stopColor={color} stopOpacity="0" />      // Fade to transparent
    </LinearGradient>
  );
};
```

### **Props Interface:**
```typescript
type Props = {
  height: number;  // Chart height for gradient scaling
  color: string;   // Primary color (usually purple #7C3AED)
};
```

### **Where It's Used:**

#### **GraphCard Component** (`src/components/GraphCard.tsx`):
```typescript
// Import
import DefGraph from "./Graph/DefGrad";

// Usage in SVG
<Svg height={110} width={width + 1}>
  <Defs>
    <DefGraph height={height} color={color} />
  </Defs>
  <Path d={generateAreaPath()} fill="url(#grad)" />    // Applies the gradient
  <Path d={generatePath()} stroke={color} strokeWidth={2} fill="none" />
</Svg>
```

### **Visual Effect:**
- **Top**: 30% opacity of the chart line color
- **Bottom**: Completely transparent
- **Result**: Subtle fill under portfolio balance line charts

---

## **Component Import Hierarchy**

### **Background Gradient Flow:**
```
PortfolioScreen.tsx
├── import WalletTabBackgroundGradient from '../../components/WalletTabBackgroundGradient'
└── <WalletTabBackgroundGradient /> 
    ├── Renders as absolute positioned background layer
    ├── Covers entire screen with purple gradient
    └── Positioned behind all other content
```

### **Chart Gradient Flow:**
```
GraphCard.tsx
├── import DefGraph from "./Graph/DefGrad"
├── <Defs><DefGraph height={height} color={color} /></Defs>
└── <Path fill="url(#grad)" />
    ├── Applied to chart area paths only
    ├── Creates fill under line graphs
    └── Subtle visual enhancement for portfolio charts
```

### **Complete Component Tree:**
```
src/
├── screens/Portfolio/index.tsx
│   └── imports WalletTabBackgroundGradient (main background)
├── components/
│   ├── WalletTabBackgroundGradient.tsx (complex SVG background)
│   ├── GraphCard.tsx
│   │   └── imports DefGraph (chart fill)
│   └── Graph/
│       └── DefGrad.tsx (simple linear gradient)
```

---

## **Integration in Real Ledger Live**

### **Original Implementation Features:**

#### **WalletTabBackgroundGradient:**
1. **Advanced Animation System**:
   ```typescript
   const opacity = multiply(
     scrollY.interpolate({
       inputRange: [0, headerHeight],
       outputRange: [1, 0],
       extrapolate: "clamp",
     }),
     scrollX.interpolate({
       inputRange: [0, 1],
       outputRange: [1, 0],
       extrapolate: "clamp",
     }),
   );
   ```

2. **Scroll Context Integration**:
   ```typescript
   const { scrollY, headerHeight } = useContext(WalletTabNavigatorScrollContext);
   ```

3. **State-Based Color Variations**:
   ```typescript
   color={readOnlyModeEnabled && hasNoAccounts ? colors.neutral.c30 : undefined}
   ```

4. **Material Top Tab Bar Integration**:
   - Responds to tab navigation animations
   - Fades during tab transitions
   - Maintains visual continuity across tab switches

#### **Usage Patterns in Navigation:**
- **WalletTabNavigatorTabBar.tsx**: Primary usage with scroll animations
- **Tab Navigation**: Integrated with React Navigation Material Top Tabs
- **Safe Area**: Respects device safe areas and notches
- **Performance**: Optimized with `memo()` for efficient re-renders

---

## **Visual Differences Summary**

### **WalletTabBackgroundGradient:**
- **Complexity**: 4 layered gradients (1 linear + 2 radial + 1 blend)
- **Size**: Large format (850x480px) covering entire screen area
- **Colors**: Multiple purple shades (`#BE96FF`, `#B7A6F5`, `#8069D5`, etc.)
- **Opacity**: Complex opacity variations and animations
- **Purpose**: Main app background aesthetic and brand identity
- **Animation**: Scroll-responsive with position and opacity changes
- **Performance**: Heavy SVG rendering but cached effectively

### **DefGrad:**
- **Complexity**: Single linear gradient
- **Size**: Small, matches chart height (typically 110px)
- **Colors**: Single color parameter with opacity fade (0.3 → 0)
- **Opacity**: Simple top-to-bottom fade
- **Purpose**: Chart area fill enhancement only
- **Animation**: Static, no animations
- **Performance**: Lightweight, minimal rendering cost

---

## **Implementation Notes**

### **Responsive Design:**
- **WalletTabBackgroundGradient**: Uses `Math.max(850, screenWidth + 100)` for width
- **DefGrad**: Scales with provided height parameter

### **Theme Integration:**
Both components integrate with the styled-components theme system:
```typescript
const { colors } = useTheme();
// Access: colors.background.main, colors.primary.c80, etc.
```

### **Color Specifications:**
- **Primary Purple**: `#7C3AED` (colors.primary.c80)
- **Background Dark**: `#131214` (colors.background.main)
- **Gradient Purples**: `#BE96FF`, `#B7A6F5`, `#8069D5`, `#AC91F8`

### **File Locations:**
- **WalletTabBackgroundGradient**: `src/components/WalletTabBackgroundGradient.tsx`
- **DefGrad**: `src/components/Graph/DefGrad.tsx`
- **Usage**: `src/screens/Portfolio/index.tsx`, `src/components/GraphCard.tsx`

### **Dependencies for Full Implementation:**
```typescript
// Required packages for scroll-responsive behavior
"react-native-reanimated": "^3.x.x"    // For scroll animations
"react-native-gesture-handler": "^2.x.x" // For gesture handling
```

This documentation provides a complete understanding of how Ledger Live creates its signature gradient visual effects through these two specialized components, including both static and scroll-responsive implementations.
