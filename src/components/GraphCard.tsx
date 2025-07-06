import React, { useCallback, useState, memo, useEffect } from "react";
import { Flex, Text, GraphTabs } from "@ledgerhq/native-ui";
import styled, { useTheme } from "styled-components/native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Dimensions } from "react-native";
import { BigNumber } from "bignumber.js";
import Delta from "./Delta";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Graph from "./Graph";
import { Item } from "./Graph/types";
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
  const { calculateFiatValue, get24hChange, loading, selectedTimeframe, setSelectedTimeframe, getValueChangeForTimeframe } = usePriceContext();

  // State for time range items
  const [timeRangeItems, setTimeRangeItems] = useState(GRAPH_TIME_RANGES);

  // Sync local selectedRange with global selectedTimeframe from PriceContext
  const selectedRange = selectedTimeframe;

  // Update timeRangeItems when selectedTimeframe changes
  useEffect(() => {
    const updatedRanges = GRAPH_TIME_RANGES.map((item) => ({
      ...item,
      active: item.key === selectedTimeframe,
    }));
    setTimeRangeItems(updatedRanges);
  }, [selectedTimeframe]);

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

  const calculatePortfolioChange = useCallback(async (): Promise<{ value: number; percentage: number }> => {
    if (loading || areAccountsEmpty) {
      return { value: 0, percentage: 0 };
    }

    let totalCurrentValue = new BigNumber(0);
    let totalChange = new BigNumber(0);

    // Calculate changes for each asset based on the selected timeframe
    for (const asset of CRYPTO_ASSETS) {
      try {
        const cryptoId = asset.id as 'bitcoin' | 'solana';
        const magnitude = asset.currency.units[0].magnitude;
        const balance = new BigNumber(asset.amount);
        const currentFiatValue = calculateFiatValue(cryptoId, balance, magnitude);
        
        totalCurrentValue = totalCurrentValue.plus(currentFiatValue);
        
        // Get value change for the selected timeframe (not just 24h)
        const valueChangeData = await getValueChangeForTimeframe(
          cryptoId,
          balance,
          selectedRange, // Use the selected timeframe instead of hardcoded 24h
          magnitude
        );
        
        console.log(`[GraphCard] ${selectedRange} change for ${cryptoId}:`, {
          currentValue: currentFiatValue.toNumber(),
          valueChange: valueChangeData.value,
          percentage: valueChangeData.percentage,
        });
        
        // Add this asset's value change to the total
        totalChange = totalChange.plus(valueChangeData.value);
        
      } catch (error) {
        console.error(`[GraphCard] Error calculating ${selectedRange} change for ${asset.id}:`, error);
      }
    }

    // CORRECT: Calculate percentage as change / previousValue
    const totalPreviousValue = totalCurrentValue.minus(totalChange);
    const changePercentage = totalPreviousValue.isZero() 
      ? 0 
      : totalChange.dividedBy(totalPreviousValue).toNumber(); // Already as decimal

    console.log(`[GraphCard] Portfolio ${selectedRange} change:`, {
      totalCurrentValue: totalCurrentValue.toNumber(),
      totalPreviousValue: totalPreviousValue.toNumber(),
      totalChange: totalChange.toNumber(),
      changePercentage: changePercentage,
    });

    return {
      value: totalChange.toNumber(),
      percentage: changePercentage, // Already in decimal format (0-1)
    };
  }, [loading, areAccountsEmpty, calculateFiatValue, getValueChangeForTimeframe, selectedRange]);

  // State for dynamic countervalue change
  const [dynamicCountervalueChange, setDynamicCountervalueChange] = useState<{ value: number; percentage: number }>({ value: 0, percentage: 0 });

  // Calculate dynamic portfolio change when timeframe changes
  useEffect(() => {
    const updatePortfolioChange = async () => {
      console.log(`[GraphCard] Updating portfolio change for timeframe: ${selectedRange}`);
      const newCountervalueChange = await calculatePortfolioChange();
      setDynamicCountervalueChange(newCountervalueChange);
    };

    updatePortfolioChange();
  }, [selectedRange, calculatePortfolioChange]);

  // Generate portfolio data based on selected time range
  const portfolioData = generatePortfolioData(selectedRange);
  
  // Use dynamic calculations for current balance
  const dynamicPortfolioBalance = calculatePortfolioBalance();

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
      console.log('[GraphCard] Time range clicked:', newRange.label, newRange.key);
      
      // Update global timeframe in PriceContext (this will trigger asset rows to update)
      setSelectedTimeframe(newRange.key);
      
      // Local state will be updated via useEffect when selectedTimeframe changes
    },
    [timeRangeItems, setSelectedTimeframe],
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
                          {/* DEBUG: Log Delta props before rendering */}
                          {(() => {
                            console.log('[GraphCard] About to render Delta with props:', {
                              percent: true,
                              show0Delta: true,
                              valueChange: countervalueChange,
                              context: 'portfolio-percentage',
                              selectedRange,
                            });
                            return null;
                          })()}
                          <Delta
                            percent
                            show0Delta
                            valueChange={countervalueChange}
                          />
                          <Text> </Text>
                          {/* DEBUG: Log Delta props before rendering */}
                          {(() => {
                            console.log('[GraphCard] About to render Delta with props:', {
                              unit: unit,
                              valueChange: countervalueChange,
                              context: 'portfolio-value',
                              selectedRange,
                            });
                            return null;
                          })()}
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
