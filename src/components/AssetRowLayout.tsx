import React from "react";
import { useTheme } from "styled-components/native";
import { BigNumber } from "bignumber.js";
import { Flex, Text, Tag } from "@ledgerhq/native-ui";
import isEqual from "lodash/isEqual";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import CurrencyUnitValue from "./CurrencyUnitValue";
import CounterValue from "./CounterValue";
import Delta from "./Delta";
import ParentCurrencyIcon from "./ParentCurrencyIcon";
import { usePriceContext } from "../context/PriceContext";
import type { SupportedCryptoId } from "../services/PriceService";

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

interface Unit {
  name: string;
  code: string;
  magnitude: number;
  symbol: string;
}

interface ValueChange {
  value: number;
  percentage: number;
}

type Props = {
  balance: BigNumber;
  currency: Currency;
  currencyUnit?: Unit;
  countervalueChange?: ValueChange;
  name: string;
  tag?: string | null | boolean;
  onPress?: TouchableOpacityProps["onPress"];
  progress?: number;
  hideDelta?: boolean;
  topLink?: boolean;
  bottomLink?: boolean;
};

const AssetRowLayout = ({
  balance,
  currency,
  currencyUnit,
  name,
  onPress,
  hideDelta,
  topLink,
  bottomLink,
  countervalueChange: staticCountervalueChange,
  tag,
}: Props) => {
  const { colors, space } = useTheme();
  const { calculateFiatValue, get24hChange, loading } = usePriceContext();

  // Map currency ID to supported crypto IDs (only BTC and SOL supported)
  const getSupportedCryptoId = (currencyId: string): SupportedCryptoId | null => {
    switch (currencyId) {
      case 'bitcoin':
        return 'bitcoin';
      case 'solana':
        return 'solana';
      default:
        return null;
    }
  };

  // Calculate dynamic countervalue change for supported cryptocurrencies
  const getDynamicCountervalueChange = (): ValueChange | undefined => {
    const supportedCryptoId = getSupportedCryptoId(currency.id);
    
    if (!supportedCryptoId || loading) {
      return staticCountervalueChange;
    }

    try {
      const change24hPercent = get24hChange(supportedCryptoId);
      const magnitude = currency.units[0]?.magnitude || 8;
      const currentFiatValue = calculateFiatValue(supportedCryptoId, balance, magnitude);
      
      // Calculate the dollar change: current_value * (change_percent / 100)
      const dollarChange = currentFiatValue.multipliedBy(change24hPercent / 100);
      
      return {
        value: dollarChange.toNumber(),
        percentage: change24hPercent / 100, // Delta expects decimal (will multiply by 100 for display)
      };
    } catch (error) {
      console.error('[AssetRowLayout] Error calculating dynamic change:', error);
      return staticCountervalueChange;
    }
  };

  const countervalueChange = getDynamicCountervalueChange();

  return (
    <TouchableOpacity onPress={onPress}>
      {topLink && (
        <Flex
          width="1px"
          height={space[4]}
          marginLeft="16px"
          backgroundColor={colors.neutral.c40}
          mb={2}
        />
      )}
      <Flex 
        flexDirection="row" 
        pt={topLink ? 0 : 6} 
        pb={bottomLink ? 0 : 6} 
        alignItems="center"
      >
        <ParentCurrencyIcon currency={currency} size={32} />
        <Flex flex={1} justifyContent="center" ml={4}>
          <Flex mb={1} flexDirection="row" justifyContent="space-between">
            <Flex flexGrow={1} flexShrink={1} flexDirection="row" alignItems="center">
              <Flex flexShrink={1}>
                <Text
                  testID={`asset-row-name-${name}`}
                  variant="large"
                  fontWeight="semiBold"
                  color="neutral.c100"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Flex>
              {tag && (
                <Flex mx={3} flexShrink={0}>
                  <Tag numberOfLines={1}>{tag}</Tag>
                </Flex>
              )}
            </Flex>
            <Flex flexDirection="row" alignItems="flex-end" flexShrink={0}>
              <Text
                variant="large"
                fontWeight="semiBold"
                color="neutral.c100"
                testID="asset-balance"
              >
                <CounterValue currency={currency} value={balance} />
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="body" fontWeight="medium" color="neutral.c70">
              {currencyUnit ? (
                <CurrencyUnitValue showCode unit={currencyUnit} value={balance} />
              ) : null}
            </Text>
            {!hideDelta && countervalueChange && (
              <Delta
                percent
                show0Delta={balance.toNumber() !== 0}
                fallbackToPercentPlaceholder
                valueChange={countervalueChange}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      {bottomLink && (
        <Flex
          width="1px"
          height={space[4]}
          marginLeft="16px"
          backgroundColor={colors.neutral.c40}
          mt={2}
        />
      )}
    </TouchableOpacity>
  );
};

/**
 * In most usages, the prop `countervalueChange` is an object that is
 * created at each render in the parent component, (with a new ref)
 * hence why the deep equality here.
 * By avoiding a re-render of this component, we can save ~5ms on a performant
 * device, in __DEV__ mode. Since it's meant to be rendered in a list, this is
 * not a small optimisation.
 */
export default React.memo<Props>(AssetRowLayout, isEqual); 