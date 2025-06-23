import React from "react";
import Lottie from "lottie-react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import proxyStyled, { BaseStyledProps } from "@ledgerhq/native-ui/lib/components/styled";
import Touchable from "../Touchable";
import { 
  MAIN_BUTTON_BOTTOM, 
  MAIN_BUTTON_SIZE 
} from "../../constants/tabBarConstants";

import darkAnimSource from "../../animations/mainButton/dark.json";

interface TransferFABProps {
  onPress?: () => void;
  focused?: boolean;
  bottomInset?: number;
}

// EXACT REPLICATION of official Ledger Live Mobile MainButton styling
const MainButton = proxyStyled(Touchable).attrs({
  backgroundColor: "primary.c80",
  height: MAIN_BUTTON_SIZE,
  width: MAIN_BUTTON_SIZE,
  borderRadius: MAIN_BUTTON_SIZE / 2,
  overflow: "hidden",
  position: "absolute",
})<BaseStyledProps>`
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

// EXACT REPLICATION of official ButtonAnimation component
const ButtonAnimation = Animated.createAnimatedComponent(
  proxyStyled(Lottie).attrs({
    height: MAIN_BUTTON_SIZE,
    width: MAIN_BUTTON_SIZE,
  })``,
);

// Official hit area expansion
const hitSlop = {
  top: 10,
  left: 25,
  right: 25,
  bottom: 25,
};

/**
 * Transfer FAB Button Component
 * Using only dark.json animation as requested
 */
function TransferFAB({ onPress, focused = false, bottomInset = 0 }: TransferFABProps) {
  // Static animation progress - always show transfer arrows icon
  const lottieProps = useAnimatedProps(() => ({
    progress: 0, // 0 = transfer arrows, 0.5 = close X, 1 = transfer arrows
  }));

  return (
    <MainButton
      activeOpacity={1}
      hitSlop={hitSlop}
      onPress={onPress}
      bottom={MAIN_BUTTON_BOTTOM + bottomInset}
      testID="transfer-button"
    >
      <ButtonAnimation
        source={darkAnimSource}
        animatedProps={lottieProps}
        loop={false}
      />
    </MainButton>
  );
}

export default TransferFAB; 