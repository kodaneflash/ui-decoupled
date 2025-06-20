import React, { useCallback } from "react";
import Animated from "react-native-reanimated";
import GraphCard from "./GraphCard";
import { PORTFOLIO_DATA, MOCK_CURRENCY_UNIT } from "../constants/portfolioData";

interface Props {
  showGraphCard: boolean;
  areAccountsEmpty: boolean;
  currentPositionY: Animated.SharedValue<number>;
  graphCardEndPosition: number;
}

const GraphCardContainer = ({
  showGraphCard,
  areAccountsEmpty,
  currentPositionY,
  graphCardEndPosition,
}: Props) => {
  const handleTouchEndGraph = useCallback(() => {
    // Static implementation - no analytics tracking needed for visual replica
  }, []);

  // Create static data internally - much simpler for UI replica
  const portfolio = {
    ...PORTFOLIO_DATA,
    range: "1w",
    balanceAvailable: true,
    balanceHistory: PORTFOLIO_DATA.balanceHistory.map(item => ({
      date: item.date,
      value: item.value || 0,
    })),
  };

  const counterValueCurrency = {
    units: [MOCK_CURRENCY_UNIT],
  };

  return (
    <>
      {/* CurrencyDownStatusAlert omitted for static replica as not visible in reference image */}
      
      {showGraphCard && (
        <GraphCard
          areAccountsEmpty={areAccountsEmpty}
          portfolio={portfolio}
          counterValueCurrency={counterValueCurrency}
          currentPositionY={currentPositionY}
          graphCardEndPosition={graphCardEndPosition}
          onTouchEndGraph={handleTouchEndGraph}
        />
      )}
    </>
  );
};

// Note: withDiscreetMode HOC would be applied at higher level in the original
export default React.memo(GraphCardContainer); 