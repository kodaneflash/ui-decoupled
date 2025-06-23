import React, { useCallback, useState, memo } from "react";
import { Flex, Text, GraphTabs } from "@ledgerhq/native-ui";
import styled, { useTheme } from "styled-components/native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Dimensions } from "react-native";
import { BigNumber } from "bignumber.js";
import Delta from "./Delta";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Graph from "./Graph";
import { usePriceContext } from "../context/PriceContext";

import {
  PORTFOLIO_DATA,
  MOCK_CURRENCY_UNIT,
  GRAPH_TIME_RANGES,
  CRYPTO_ASSETS,
  generatePortfolioData,
} from "../constants/portfolioData";

const { width } = Dimensions.get("window");

type Props = {
  areAccountsEmpty: boolean;
  portfolio?: Portfolio;
  counterValueCurrency?: Currency;
  currentPositionY?: Animated.SharedValue<number>;
  graphCardEndPosition?: number;
  onTouchEndGraph?: () => void;
};

// Static types for our replica - matching ledger-live exactly
interface Item {
  date: Date;
  value: number;
}

interface Portfolio {
  countervalueChange: {
    value: number;
    percentage: number;
  };
  balanceHistory: Item[];
  range: string;
  balanceAvailable: boolean;
}

interface Currency {
  units: Array<{
    code: string;
    symbol: string;
    magnitude: number;
    name: string;
  }>;
}

// Using EXACT styled components from ledger-live
const Placeholder = styled(Flex).attrs({
  backgroundColor: "neutral.c40",
  borderRadius: "4px",
})``;

const BigPlaceholder = styled(Placeholder).attrs({
  width: 189,
  height: 18,
})``;

const SmallPlaceholder = styled(Placeholder).attrs({
  width: 109,
  height: 8,
  borderRadius: "2px",
})``;

function GraphCard({
  areAccountsEmpty,
  portfolio: portfolioProp,
  counterValueCurrency: counterValueCurrencyProp,
  currentPositionY,
  graphCardEndPosition = 0,
  onTouchEndGraph,
}: Props) {
  const { calculateFiatValue, get24hChange, loading } = usePriceContext();

  // State for selected time range
  const [selectedRange, setSelectedRange] = useState('1w');
  const [timeRangeItems, setTimeRangeItems] = useState(GRAPH_TIME_RANGES);

  // Calculate dynamic portfolio values
  const calculatePortfolioBalance = (): BigNumber => {
    if (loading || areAccountsEmpty) {
      return new BigNumber(0);
    }

    let totalBalance = new BigNumber(0);

    CRYPTO_ASSETS.forEach(asset => {
      try {
        const cryptoId = asset.id as 'bitcoin' | 'solana';
        const magnitude = asset.currency.units[0].magnitude;
        const balance = new BigNumber(asset.amount);
        const fiatValue = calculateFiatValue(cryptoId, balance, magnitude);
        totalBalance = totalBalance.plus(fiatValue);
      } catch (error) {
        console.error(`[GraphCard] Error calculating balance for ${asset.id}:`, error);
      }
    });

    return totalBalance;
  };

  const calculatePortfolioChange = (): { value: number; percentage: number } => {
    if (loading || areAccountsEmpty) {
      return { value: 0, percentage: 0 };
    }

    let totalCurrentValue = new BigNumber(0);
    let totalChange = new BigNumber(0);

    CRYPTO_ASSETS.forEach(asset => {
      try {
        const cryptoId = asset.id as 'bitcoin' | 'solana';
        const magnitude = asset.currency.units[0].magnitude;
        const balance = new BigNumber(asset.amount);
        const currentFiatValue = calculateFiatValue(cryptoId, balance, magnitude);
        const change24hPercent = get24hChange(cryptoId);
        
        totalCurrentValue = totalCurrentValue.plus(currentFiatValue);
        
        // Calculate the dollar change for this asset
        const assetChange = currentFiatValue.multipliedBy(change24hPercent / 100);
        totalChange = totalChange.plus(assetChange);
      } catch (error) {
        console.error(`[GraphCard] Error calculating change for ${asset.id}:`, error);
      }
    });

    const changePercentage = totalCurrentValue.isZero() 
      ? 0 
      : totalChange.dividedBy(totalCurrentValue).multipliedBy(100).toNumber();

    return {
      value: totalChange.toNumber(),
      percentage: changePercentage / 100, // Delta expects decimal format
    };
  };

  // Generate portfolio data based on selected time range
  const portfolioData = generatePortfolioData(selectedRange);
  
  // Use dynamic calculations for current balance
  const dynamicPortfolioBalance = calculatePortfolioBalance();
  const dynamicCountervalueChange = calculatePortfolioChange();

  const portfolio: Portfolio = portfolioProp || {
    ...portfolioData,
    // SMOOTH INTEGRATION: Use historical data as-is, let hover handle current balance display
    balanceHistory: portfolioData.balanceHistory.map((item: any) => ({
      date: item.date,
      value: item.value || 0,
    })),
    // Use dynamic change calculation for more accurate delta
    countervalueChange: loading ? portfolioData.countervalueChange : dynamicCountervalueChange,
  };

  const counterValueCurrency: Currency = counterValueCurrencyProp || {
    units: [MOCK_CURRENCY_UNIT],
  };

  const {countervalueChange, balanceHistory} = portfolio;
  
  // DEFENSIVE: Handle empty balanceHistory like Ledger Live
  const item = balanceHistory && balanceHistory.length > 0 
    ? balanceHistory[balanceHistory.length - 1] 
    : { date: new Date(), value: 0 };
    
  const unit = counterValueCurrency.units[0];

  const [hoveredItem, setItemHover] = useState<Item | null>();

  const activeRangeIndex = timeRangeItems.findIndex(r => r.key === selectedRange);
  const rangesLabels = timeRangeItems.map(({label}) => label);

  const {colors} = useTheme();

  const updateTimeRange = useCallback(
    (index: number) => {
      const newRange = timeRangeItems[index];
      console.log('Time range clicked:', newRange.label, newRange.key);
      
      // Update active state
      const updatedRanges = timeRangeItems.map((item, i) => ({
        ...item,
        active: i === index,
      }));
      
      setTimeRangeItems(updatedRanges);
      setSelectedRange(newRange.key);
    },
    [timeRangeItems],
  );

  const mapGraphValue = useCallback((d: Item) => d.value || 0, []);

  const range = portfolio.range;
  const isAvailable = portfolio.balanceAvailable;

  // Animation for balance opacity (static implementation)
  const BalanceOpacity = useAnimatedStyle(() => {
    if (!currentPositionY) {
      return {opacity: 1};
    }

    const opacity = interpolate(
      currentPositionY.value,
      [graphCardEndPosition + 30, graphCardEndPosition + 50],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  }, [graphCardEndPosition]);

  const onItemHover = (item?: Item | null) => {
    setItemHover(item);
  };

  // SMOOTH INTEGRATION: Show dynamic balance when not hovering, historical when hovering
  const getDisplayValue = (): BigNumber => {
    if (hoveredItem && typeof hoveredItem.value === 'number') {
      // When hovering, show the historical data point
      return new BigNumber(hoveredItem.value);
    }
    
    // When not hovering, show current dynamic balance (live prices)
    if (!loading && !areAccountsEmpty) {
      return dynamicPortfolioBalance;
    }
    
    // Fallback to historical data if dynamic calculation unavailable
    if (item && typeof item.value === 'number') {
      return new BigNumber(item.value);
    }
    
    return new BigNumber(0);
  };

  return (
    <Flex>
      <Flex
        flexDirection={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        marginTop={40}
        marginBottom={80}>
        <Animated.View style={[
          BalanceOpacity,
          { transform: [{ translateY: 65 }] }
        ]}>
          <Flex alignItems="center">
            {areAccountsEmpty ? (
              <Text
                fontFamily="Inter"
                fontWeight="semiBold"
                fontSize="42px"
                color={'neutral.c100'}
                numberOfLines={1}
                adjustsFontSizeToFit>
                <CurrencyUnitValue unit={unit} value={new BigNumber(0)} />
              </Text>
            ) : (
              <>
                <Flex px={6}>
                  {!balanceHistory || balanceHistory.length === 0 ? (
                    <BigPlaceholder mt="8px" />
                  ) : (
                    <Text
                      fontFamily="Inter"
                      fontWeight="semiBold"
                      fontSize="42px"
                      color={'neutral.c100'}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      testID={'graphCard-balance'}>
                      <CurrencyUnitValue
                        unit={unit}
                        value={getDisplayValue()}
                      />
                    </Text>
                  )}
                  {/* TransactionsPendingConfirmationWarning omitted for static replica */}
                </Flex>
                <Flex flexDirection={'row'}>
                  {!balanceHistory || balanceHistory.length === 0 ? (
                    <>
                      <SmallPlaceholder mt="12px" />
                    </>
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      {hoveredItem && hoveredItem.date ? (
                        <Text variant={'large'} fontWeight={'semiBold'}>
                          {hoveredItem.date.toLocaleDateString()}
                        </Text>
                      ) : (
                        <>
                          <Delta
                            percent
                            show0Delta
                            valueChange={countervalueChange}
                          />
                          <Text> </Text>
                          <Delta 
                            unit={unit} 
                            valueChange={countervalueChange} 
                          />
                        </>
                      )}
                    </Flex>
                  )}
                </Flex>
              </>
            )}
          </Flex>
        </Animated.View>
      </Flex>

      <>
        <Flex onTouchEnd={onTouchEndGraph}>
          <Graph
            isInteractive={isAvailable}
            height={110}
            width={width + 1}
            color={
              colors.palette?.primary?.c80 || colors.primary?.c80 || '#BBB0FF'
            }
            data={balanceHistory}
            onItemHover={onItemHover}
            mapValue={mapGraphValue}
            fill={colors.background?.main || '#131214'}
            testID="graphCard-chart"
          />
        </Flex>
          {/* Time Range Tabs with FIXED WIDTH - Matching Real Ledger Live */}
          <Flex paddingTop={6} flexDirection="row" justifyContent="center" alignItems="center" style={{ position: 'relative', top: 18 }}>
            {rangesLabels.map((label, index) => (
              <Flex
                key={label}
                width={50}                                    // CRITICAL: Fixed 50px width per tab
                height={40}                                   // Fixed height for medium size
                alignItems="center"
                justifyContent="center"
                borderRadius={4}                              // 4px border radius (theme.radii[1])
                backgroundColor={index === activeRangeIndex ? "neutral.c30" : "transparent"}
                marginLeft={index > 0 ? 1 : 0}               // 4px spacing between tabs (theme.space[1])
                onTouchStart={() => updateTimeRange(index)}
              >
                <Text
                  fontSize={11}
                  fontWeight="semiBold"
                  color={index === activeRangeIndex ? "neutral.c100" : "neutral.c70"}
                >
                  {label.toUpperCase()}
                </Text>
              </Flex>
            ))}
          </Flex>
      </>
    </Flex>
  );
}

export default memo<Props>(GraphCard);
