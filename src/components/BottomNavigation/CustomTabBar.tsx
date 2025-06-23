import React from "react";
import { Flex } from "@ledgerhq/native-ui";
import { Dimensions, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Stop } from "react-native-svg";
import BackgroundGradient from "./BackgroundGradient";
import TransferFAB from "./TransferFAB";
import { 
  PortfolioTabIcon, 
  EarnTabIcon, 
  DiscoverTabIcon, 
  ManagerTabIcon 
} from "./TabIcons";
import { 
  TAB_BAR_HEIGHT, 
  ACTIVE_COLOR, 
  INACTIVE_COLOR 
} from "../../constants/tabBarConstants";
import { TabState } from "../../types/navigation";

const GRADIENT_HEIGHT = 103;

type SvgProps = {
  color: string;
};

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

const darkGradients = [
  {
    height: GRADIENT_HEIGHT,
    opacity: 0.8,
    stops: [
      <Stop key="0%" offset="0%" stopOpacity={0} stopColor="#131214" />,
      <Stop key="100%" offset="100%" stopOpacity={1} stopColor="#131214" />,
    ],
  },
  {
    height: 85,
    opacity: 0.8,
    stops: [
      <Stop key="0%" offset="0%" stopOpacity={0} stopColor="#131214" />,
      <Stop key="100%" offset="100%" stopOpacity={1} stopColor="#131214" />,
    ],
  },
];

const lightGradients = [
  {
    height: GRADIENT_HEIGHT,
    opacity: 1,
    stops: [
      <Stop key="0%" offset="0" stopOpacity={0} stopColor="#ffffff" />,
      <Stop key="100%" offset="100%" stopOpacity={0.8} stopColor="#ffffff" />,
    ],
  },
  {
    height: 85,
    opacity: 0.8,
    stops: [
      <Stop key="0%" offset="0" stopOpacity={0} stopColor="#ffffff" />,
      <Stop key="57%" offset="57%" stopOpacity={0.15} stopColor="#000000" />,
      <Stop key="100%" offset="100%" stopOpacity={0.15} stopColor="#000000" />,
    ],
  },
];

interface CustomTabBarProps {
  state: TabState;
  onTabPress?: (index: number) => void;
  hideTabBar?: boolean;
}

// Background color logic from Ledger Live Mobile
const getBgColor = (colors: any) =>
  colors.type === "light" ? colors.neutral?.c00 : colors.neutral?.c20;

// Background fillers for seamless integration
const BackgroundFiller = styled(Flex).attrs<{ bgColor: string }>((props) => ({
  position: "absolute",
  height: TAB_BAR_HEIGHT,
  width: "30%",
  backgroundColor: props.bgColor,
}))``;

const BottomFiller = styled(Flex).attrs<{ bgColor: string }>((props) => ({
  position: "absolute",
  width: "100%",
  backgroundColor: props.bgColor,
}))``;

// EXACT REPLICATION of official MiddleIconContainer from Ledger Live Mobile
// CustomTabBar.tsx line 52-59 - used for Transfer FAB positioning
const MiddleIconContainer = styled(Flex).attrs({
  ...StyleSheet.absoluteFillObject,
  top: undefined,
  flex: 1,
  alignItems: "center",
  zIndex: 1,
  justifyContent: "flex-end",
})``;

/**
 * Custom Tab Bar Component
 * Exact recreation of Ledger Live Mobile bottom navigation with:
 * - 56px height with curved SVG cutout
 * - 5-tab configuration with center FAB
 * - Background gradients for dark/light themes
 * - Safe area handling
 * - Official MiddleIconContainer approach for Transfer FAB
 * - React Navigation handles space reservation via tabBarStyle height: 300
 */
function CustomTabBar({ 
  state, 
  onTabPress, 
  hideTabBar = false 
}: CustomTabBarProps) {
  const { colors } = useTheme();
  const { bottom: bottomInset } = useSafeAreaInsets();
  
  // Background color and gradients
  const bgColor = getBgColor(colors);
  const gradients = colors.type === "light" ? lightGradients : darkGradients;

  // Tab color logic
  const getTabColor = (index: number) => {
    const isFocused = state.activeIndex === index;
    return isFocused ? 
      (colors.primary?.c80 || "#7C3AED") : 
      (colors.neutral?.c70 || "#999999");
  };

  // Handle tab press
  const handleTabPress = (index: number) => {
    if (onTabPress) {
      onTabPress(index);
    }
  };

  // Don't render if hidden
  if (hideTabBar) {
    return null;
  }

  return (
    <Flex
      width="100%"
      flexDirection="row"
      height={TAB_BAR_HEIGHT}
      bottom={bottomInset}
      position="absolute"
      overflow="visible"
    >
      {/* Background Gradients */}
      <BackgroundGradient {...gradients[0]} />
      <BackgroundGradient {...gradients[1]} />
      
      {/* Bottom Filler */}
      <BottomFiller 
        bgColor={bgColor}
        bottom={bottomInset ? -bottomInset : bottomInset} 
        height={bottomInset} 
      />
      
      {/* Side Background Fillers */}
      <BackgroundFiller bgColor={bgColor} left={0} />
      <BackgroundFiller bgColor={bgColor} right={0} />
      
      {/* Tab Bar Shape */}
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        left={-1}
        right={0}
      >
        <TabBarShape color={bgColor} />
      </Flex>
      
      {/* 
        TAB LAYOUT - EXACT LEDGER LIVE MOBILE APPROACH:
        Following official CustomTabBar.tsx line 130-180 pattern:
        - Regular tabs render with flex layout
        - Transfer tab (index 2) gets special MiddleIconContainer treatment
        - This approach ensures perfect positioning alignment
      */}
      {state.routes.map((route, index) => {
        const isFocused = state.activeIndex === index;
        const color = getTabColor(index);

        // TRANSFER TAB - EXACT OFFICIAL IMPLEMENTATION
        // Following official CustomTabBar.tsx line 146-165
        // The key is the <Flex flex={1} /> spacer that creates proper spacing
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
                <TransferFAB
                  onPress={() => handleTabPress(index)}
                  focused={isFocused}
                  bottomInset={bottomInset}
                />
              </MiddleIconContainer>
            </React.Fragment>
          );
        }

        // Regular Tab Rendering
        const renderTabContent = () => {
          switch (index) {
            case 0: // Portfolio
              return (
                <PortfolioTabIcon 
                  color={color} 
                  focused={isFocused}
                  onPress={() => handleTabPress(index)}
                />
              );
            case 1: // Earn
              return (
                <EarnTabIcon 
                  color={color} 
                  focused={isFocused}
                  onPress={() => handleTabPress(index)}
                />
              );
            case 3: // Discover
              return (
                <DiscoverTabIcon 
                  color={color} 
                  focused={isFocused}
                  onPress={() => handleTabPress(index)}
                />
              );
            case 4: // My Ledger
              return (
                <ManagerTabIcon 
                  color={color} 
                  focused={isFocused}
                  hasAvailableUpdate={true} // Show update badge for demo
                  onPress={() => handleTabPress(index)}
                />
              );
            default:
              return null;
          }
        };

        return (
          <Flex key={index} flex={1}>
            {renderTabContent()}
          </Flex>
        );
      })}
    </Flex>
  );
}

export default React.memo(CustomTabBar); 