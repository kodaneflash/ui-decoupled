import React, { useCallback, useState, memo } from "react";
import { Flex, Text, GraphTabs } from "@ledgerhq/native-ui";
import styled, { useTheme } from "styled-components/native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Dimensions } from "react-native";
import Svg, { Path, Defs } from "react-native-svg";
import { BigNumber } from "bignumber.js";
import Delta from "./Delta";
import CurrencyUnitValue from "./CurrencyUnitValue";
import DefGraph from "./Graph/DefGrad";
import { usePriceContext } from "../context/PriceContext";

import {
  PORTFOLIO_DATA,
  MOCK_CURRENCY_UNIT,
  GRAPH_TIME_RANGES,
  CRYPTO_ASSETS,
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

// Enhanced Graph component with proper SVG and gradient
const Graph = ({
  height,
  width,
  color,
  data,
  fill,
  isInteractive,
  onItemHover,
  mapValue,
  testID,
}: {
  height: number;
  width: number;
  color: string;
  data: Item[];
  fill?: string;
  isInteractive?: boolean;
  onItemHover?: (item?: Item | null) => void;
  mapValue?: (item: Item) => number;
  testID?: string;
}) => {
  // Generate a simple upward trending path for the static chart
  const generatePath = () => {
    const points = [
      [0, height * 0.8],
      [width * 0.2, height * 0.7],
      [width * 0.4, height * 0.9],
      [width * 0.6, height * 0.4],
      [width * 0.8, height * 0.3],
      [width, height * 0.5],
    ];

    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }
    return path;
  };

  const generateAreaPath = () => {
    const linePath = generatePath();
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  };

  return (
    <Svg
      testID={testID}
      height={height}
      width={width}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none">
      <Defs>
        <DefGraph height={height} color={color} />
      </Defs>
      <Path d={generateAreaPath()} fill={fill || "url(#grad)"} />
      <Path d={generatePath()} stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
};

function GraphCard({
  areAccountsEmpty,
  portfolio: portfolioProp,
  counterValueCurrency: counterValueCurrencyProp,
  currentPositionY,
  graphCardEndPosition = 0,
  onTouchEndGraph,
}: Props) {
  const { calculateFiatValue, get24hChange, loading } = usePriceContext();

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

  // Use dynamic calculations or fallback to static data
  const dynamicPortfolioBalance = calculatePortfolioBalance();
  const dynamicCountervalueChange = calculatePortfolioChange();

  const portfolio: Portfolio = portfolioProp || {
    ...PORTFOLIO_DATA,
    range: '1w',
    balanceAvailable: true,
    balanceHistory: PORTFOLIO_DATA.balanceHistory.map((item, index, array) => ({
      date: item.date,
      value: index === array.length - 1 ? dynamicPortfolioBalance.toNumber() : item.value || 0,
    })),
    countervalueChange: dynamicCountervalueChange,
  };

  const counterValueCurrency: Currency = counterValueCurrencyProp || {
    units: [MOCK_CURRENCY_UNIT],
  };

  const {countervalueChange, balanceHistory} = portfolio;
  const item = balanceHistory[balanceHistory.length - 1];
  const unit = counterValueCurrency.units[0];

  const [hoveredItem, setItemHover] = useState<Item | null>();

  // Static time range data
  const timeRangeItems = GRAPH_TIME_RANGES;
  const activeRangeIndex = timeRangeItems.findIndex(r => r.active);
  const rangesLabels = timeRangeItems.map(({label}) => label);

  const {colors} = useTheme();

  const updateTimeRange = useCallback(
    (index: number) => {
      // Static implementation - no actual time range change
      console.log('Time range clicked:', timeRangeItems[index].label);
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
                  {!balanceHistory ? (
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
                        value={hoveredItem ? new BigNumber(hoveredItem.value) : new BigNumber(item.value)}
                      />
                    </Text>
                  )}
                  {/* TransactionsPendingConfirmationWarning omitted for static replica */}
                </Flex>
                <Flex flexDirection={'row'}>
                  {!balanceHistory ? (
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
