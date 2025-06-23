import React, { memo, useMemo } from "react";
import { Flex, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import * as CryptoIcons from "@ledgerhq/crypto-icons-ui/native";

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

// Get crypto icon component from the crypto-icons-ui package
const getCryptoIconComponent = (currencyId: string) => {
  // Map currency IDs to crypto icon names
  const iconMap: { [key: string]: keyof typeof CryptoIcons } = {
    bitcoin: "BTC",
    solana: "SOL",
    ethereum: "ETH",
    tether: "USDT",
    xrp: "XRP",
    bnb: "BNB",
  };

  const iconName = iconMap[currencyId.toLowerCase()];
  return iconName ? CryptoIcons[iconName] : null;
};

// Crypto icon component using proper Ledger Live icons
const CurrencyIcon: React.FC<{
  currency: Currency;
  size: number;
  color: string;
  forceIconScale?: number;
}> = ({ currency, size, color, forceIconScale = 1 }) => {
  const IconComponent = getCryptoIconComponent(currency.id);

  // If we have a proper crypto icon, use it
  if (IconComponent) {
    // Bitcoin needs a slightly larger icon to match Ledger Live exactly
    const bitcoinScale = currency.id.toLowerCase() === 'bitcoin' ? 1.5 : 1;
    const iconSize = Math.round(size * forceIconScale * 0.625 * bitcoinScale);
    return (
      <IconComponent 
        size={iconSize} 
        color={color}
      />
    );
  }

  // Fallback to text symbols for unsupported currencies
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
        currency={currency}
        forceIconScale={forceIconScale}
        color={colors.constant.white}
        size={size}
      />
    </Flex>
  );
};

export default memo<Props>(ParentCurrencyIcon); 