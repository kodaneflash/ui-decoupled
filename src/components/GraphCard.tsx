import React, { useCallback, useState, memo } from "react";
import { Flex, Text, GraphTabs } from "@ledgerhq/native-ui";
import styled, { useTheme } from "styled-components/native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Dimensions } from "react-native";
import Delta from "./Delta";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { PORTFOLIO_DATA, MOCK_CURRENCY_UNIT, GRAPH_TIME_RANGES } from "../constants/portfolioData";

const { width } = Dimensions.get("window");

type Props = {
  areAccountsEmpty: boolean;
  portfolio?: Portfolio;
  counterValueCurrency?: Currency;
  currentPositionY?: Animated.SharedValue<number>;
  graphCardEndPosition?: number;
  onTouchEndGraph?: () => void;
};

// Static types for our replica
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

// Static Graph component
const Graph = ({ 
  height, 
  width, 
  color, 
  data, 
  fill,
  isInteractive,
  onItemHover,
  mapValue,
  testID 
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
}) => (
  <Flex height={height} width={width} backgroundColor="transparent" testID={testID} />
);

function GraphCard({
  areAccountsEmpty,
  portfolio: portfolioProp,
  counterValueCurrency: counterValueCurrencyProp,
  currentPositionY,
  graphCardEndPosition = 0,
  onTouchEndGraph,
}: Props) {
  // Use provided props or fallback to static data
  const portfolio: Portfolio = portfolioProp || {
    ...PORTFOLIO_DATA,
    range: "1w",
    balanceAvailable: true,
    balanceHistory: PORTFOLIO_DATA.balanceHistory.map(item => ({
      date: item.date,
      value: item.value || 0,
    })),
  };

  const counterValueCurrency: Currency = counterValueCurrencyProp || {
    units: [MOCK_CURRENCY_UNIT],
  };

  const { countervalueChange, balanceHistory } = portfolio;
  const item = balanceHistory[balanceHistory.length - 1];
  const unit = counterValueCurrency.units[0];

  const [hoveredItem, setItemHover] = useState<Item | null>();
  
  // Static time range data
  const timeRangeItems = GRAPH_TIME_RANGES;
  const activeRangeIndex = timeRangeItems.findIndex(r => r.active);
  const rangesLabels = timeRangeItems.map(({ label }) => label);

  const { colors } = useTheme();

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
    if (!currentPositionY) return { opacity: 1 };
    
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
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        marginTop={40}
        marginBottom={40}
      >
        <Animated.View style={[BalanceOpacity]}>
          <Flex alignItems="center">
            {areAccountsEmpty ? (
              <Text
                fontFamily="Inter"
                fontWeight="semiBold"
                fontSize="42px"
                color={"neutral.c100"}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                <CurrencyUnitValue unit={unit} value={0} />
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
                      color={"neutral.c100"}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      testID={"graphCard-balance"}
                    >
                      <CurrencyUnitValue
                        unit={unit}
                        value={hoveredItem ? hoveredItem.value : item.value}
                        joinFragmentsSeparator=""
                      />
                    </Text>
                  )}
                  {/* TransactionsPendingConfirmationWarning omitted for static replica */}
                </Flex>
                <Flex flexDirection={"row"}>
                  {!balanceHistory ? (
                    <>
                      <SmallPlaceholder mt="12px" />
                    </>
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      {hoveredItem && hoveredItem.date ? (
                        <Text variant={"large"} fontWeight={"semiBold"}>
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
                          <Delta unit={unit} valueChange={countervalueChange} />
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
            color={colors.palette?.primary?.c80 || colors.primary?.c80 || "#BBB0FF"}
            data={balanceHistory}
            onItemHover={onItemHover}
            mapValue={mapGraphValue}
            fill={colors.background?.main || "#131214"}
            testID="graphCard-chart"
          />
        </Flex>
        <Flex paddingTop={6} backgroundColor={colors.background?.main || "#131214"}>
          <GraphTabs
            activeIndex={activeRangeIndex}
            onChange={updateTimeRange}
            labels={rangesLabels}
          />
        </Flex>
      </>
    </Flex>
  );
}

export default memo<Props>(GraphCard); 