import React, { memo, useMemo } from "react";
import { Flex, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";

// Simplified Currency type for static implementation
interface Currency {
  id: string;
  name: string;
  color: string;
  units: Array<{
    name: string;
    code: string;
    magnitude: number;
    symbol: string;
  }>;
}

type Props = {
  currency: Currency;
  size: number;
  hideParentIcon?: boolean;
  borderColor?: string;
  forceIconScale?: number;
};

// Simple color contrast helper
const ensureContrast = (color: string, backgroundColor: string): string => {
  // For static implementation, just return the original color
  return color;
};

// Simple currency icon component using text symbols
const CurrencyIcon: React.FC<{
  currency: Currency;
  size: number;
  color: string;
  forceIconScale?: number;
}> = ({ currency, size, color, forceIconScale = 1 }) => {
  const getSymbol = (curr: Currency): string => {
    // Use the symbol from currency units or fallback to common symbols
    if (curr.units && curr.units.length > 0) {
      return curr.units[0].symbol;
    }
    
    const symbolMap: { [key: string]: string } = {
      bitcoin: "₿",
      ethereum: "Ξ",
      tether: "₮", 
      xrp: "✕",
      bnb: "◆",
    };
    return symbolMap[curr.id] || "?";
  };

  return (
    <Text 
      color={color}
      fontSize={Math.round(size * forceIconScale)}
      fontWeight="bold"
    >
      {getSymbol(currency)}
    </Text>
  );
};

const ParentCurrencyIcon = ({
  currency,
  size,
  hideParentIcon = false,
  borderColor = "background.main",
  forceIconScale = 1,
}: Props) => {
  const { colors } = useTheme();
  const color = useMemo(
    () => ensureContrast(currency.color, colors.constant.white),
    [colors, currency],
  );

  const iconSize = size * 0.625;

  return (
    <Flex
      bg={color}
      width={size}
      height={size}
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={size}
    >
      <CurrencyIcon
        size={iconSize}
        currency={currency}
        forceIconScale={forceIconScale}
        color={colors.constant.white}
      />
    </Flex>
  );
};

export default memo<Props>(ParentCurrencyIcon); 