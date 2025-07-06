import React, { useEffect, useState } from "react";
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
  const { calculateFiatValue, loading, selectedTimeframe, getValueChangeForTimeframe } = usePriceContext();
  
  // State for dynamic countervalue change based on selected timeframe
  const [dynamicCountervalueChange, setDynamicCountervalueChange] = useState<ValueChange | undefined>(staticCountervalueChange);

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

  // Calculate dynamic countervalue change for the selected timeframe
  useEffect(() => {
    const calculateTimeframeChange = async () => {
      console.log(`[AssetRowLayout] calculateTimeframeChange called for ${currency.id}:`, {
        currencyId: currency.id,
        selectedTimeframe,
        loading,
        balanceNumber: balance.toNumber(),
        staticCountervalueChange,
      });

      const supportedCryptoId = getSupportedCryptoId(currency.id);
      
      if (!supportedCryptoId || loading) {
        console.log(`[AssetRowLayout] Using static data for ${currency.id} - not supported or loading:`, {
          supportedCryptoId,
          loading,
          staticCountervalueChange,
        });
        setDynamicCountervalueChange(staticCountervalueChange);
        return;
      }

      try {
        console.log(`[AssetRowLayout] Calculating ${selectedTimeframe} change for ${supportedCryptoId}:`, {
          balance: balance.toNumber(),
          timeframe: selectedTimeframe,
        });
        
        const magnitude = currency.units[0]?.magnitude || 8;
        
        // Get value change for the selected timeframe
        const valueChangeData = await getValueChangeForTimeframe(
          supportedCryptoId, 
          balance, 
          selectedTimeframe, 
          magnitude
        );
        
        console.log(`[AssetRowLayout] ${selectedTimeframe} change result for ${supportedCryptoId}:`, {
          ...valueChangeData,
          percentageAsPercent: (valueChangeData.percentage * 100).toFixed(4) + '%',
          isPercentageSmall: Math.abs(valueChangeData.percentage) < 0.01,
          isPercentageVerySmall: Math.abs(valueChangeData.percentage) < 0.001,
        });
        
        const newCountervalueChange = {
          value: valueChangeData.value,
          percentage: valueChangeData.percentage, // Already in decimal format
        };

        // DEBUG: Compare with static data
        console.log(`[AssetRowLayout] Comparison for ${supportedCryptoId}:`, {
          staticCountervalueChange,
          newCountervalueChange,
          difference: {
            value: newCountervalueChange.value - (staticCountervalueChange?.value || 0),
            percentage: newCountervalueChange.percentage - (staticCountervalueChange?.percentage || 0),
          },
        });
        
        setDynamicCountervalueChange(newCountervalueChange);
        
      } catch (error) {
        console.error(`[AssetRowLayout] Error calculating ${selectedTimeframe} change for ${supportedCryptoId}:`, error);
        setDynamicCountervalueChange(staticCountervalueChange);
      }
    };

    calculateTimeframeChange();
  }, [
    currency.id, 
    currency.units, 
    balance, 
    selectedTimeframe, 
    loading, 
    getValueChangeForTimeframe, 
    staticCountervalueChange
  ]);

  // Use dynamic calculation if available, fallback to static
  const countervalueChange = dynamicCountervalueChange || staticCountervalueChange;

  // DEBUG: Log final countervalue change before rendering
  console.log(`[AssetRowLayout] Final countervalue change for ${currency.id}:`, {
    countervalueChange,
    dynamicCountervalueChange,
    staticCountervalueChange,
    selectedTimeframe,
    willShowDelta: !hideDelta && countervalueChange,
  });

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
              <>
                {/* DEBUG: Log Delta props before rendering */}
                {(() => {
                  console.log(`[AssetRowLayout] About to render Delta for ${currency.id}:`, {
                    percent: true,
                    show0Delta: balance.toNumber() !== 0,
                    fallbackToPercentPlaceholder: true,
                    valueChange: countervalueChange,
                    context: 'asset-row',
                    selectedTimeframe,
                    balanceIsZero: balance.toNumber() === 0,
                  });
                  return null;
                })()}
                <Delta
                  percent
                  show0Delta={balance.toNumber() !== 0}
                  fallbackToPercentPlaceholder
                  valueChange={countervalueChange}
                />
              </>
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