import React, {memo} from 'react';
import {Animated, Dimensions, ColorValue} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';
import {useTheme} from 'styled-components/native';

const {width: screenWidth} = Dimensions.get('window');

// Exact Ledger Live props interface
type Props = {
  scrollX?: Animated.Value;
  scrollY?: Animated.Value;
  headerHeight?: number;
  color?: ColorValue;
};

function WalletTabBackgroundGradient({ 
  color, 
  scrollX, 
  scrollY, 
  headerHeight = 200 
}: Props) {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  // Real Ledger Live scroll-responsive opacity calculation
  let opacity: Animated.AnimatedNode | number = 1;
  
  if (scrollY && headerHeight) {
    const scrollOpacity = scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    
    if (scrollX) {
      const tabOpacity = scrollX.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      opacity = Animated.multiply(scrollOpacity, tabOpacity);
    } else {
      opacity = scrollOpacity;
    }
  } else if (scrollX) {
    opacity = scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  }

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.background?.main || '#131214',
          position: 'absolute',
          // Position from absolute top (behind status bar) like real Ledger Live
          width: 850,
          height: 480,
          top: -130 - insets.top, // Account for safe area to start from absolute top
          opacity,
        },
      ]}>
      <Svg
        width={850}
        height={480}
        viewBox="0 0 850 480"
        fill="none">
        <Path fill="url(#paint0_linear_9_2)" d="M0 0H850V480H0z" />
        <Path fill="url(#paint1_radial_9_2)" d="M0 0H850V480H0z" />
        <Path fill="url(#paint2_radial_9_2)" d="M0 0H850V480H0z" />
        <Path fill="url(#paint3_linear_9_2)" d="M0 0H850V480H0z" />
        <Defs>
          {/* Primary Linear Gradient - Purple tones */}
          <LinearGradient
            id="paint0_linear_9_2"
            x1={270.5}
            y1={0}
            x2={270.5}
            y2={480}
            gradientUnits="userSpaceOnUse">
            <Stop offset={0.380208} stopColor={color || "#BE96FF"} />
            <Stop offset={0.864583} stopColor={color || "#BE97FF"} />
          </LinearGradient>

          {/* First Radial Gradient - Light purple glow */}
          <RadialGradient
            id="paint1_radial_9_2"
            cx={0}
            cy={0}
            r={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(131.49984 186.99987 -218.94593 153.96457 172 252.5)">
            <Stop stopColor={color || "#B7A6F5"} />
            <Stop
              offset={0.505208}
              stopColor={color || "#B09BF1"}
              stopOpacity={0.770833}
            />
            <Stop offset={1} stopColor={color || "#9678E3"} stopOpacity={0} />
          </RadialGradient>

          {/* Second Radial Gradient - Deeper purple */}
          <RadialGradient
            id="paint2_radial_9_2"
            cx={0}
            cy={0}
            r={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(-138.50157 186.49933 -184.81339 -137.24953 361.5 250)">
            <Stop stopColor={color || "#8069D5"} />
            <Stop offset={0.576908} stopColor={color || "#AC91F8"} />
            <Stop offset={0.973958} stopColor={color || "#BE9BFD"} stopOpacity={0} />
          </RadialGradient>

          {/* Blend to background - Exact Ledger Live implementation */}
          <LinearGradient
            id="paint3_linear_9_2"
            x1={270.5}
            y1={-73.5}
            x2={270.5}
            y2={480}
            gradientUnits="userSpaceOnUse">
            <Stop
              offset={0.46223}
              stopColor={colors.background?.main || '#131214'}
              stopOpacity={0.6}
            />
            <Stop
              offset={0.977251}
              stopColor={colors.background?.main || '#131214'}
            />
          </LinearGradient>
        </Defs>
      </Svg>
    </Animated.View>
  );
}

export default memo<Props>(WalletTabBackgroundGradient);
