import React, { useCallback, useState } from "react";
import { Box } from "@ledgerhq/native-ui";
import { LayoutChangeEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { PORTFOLIO_DATA, MOCK_CURRENCY_UNIT } from "../constants/portfolioData";
import GraphCardContainer from "./GraphCardContainer";

interface Props {
  showAssets: boolean;
}

const PortfolioGraphCard = ({ showAssets }: Props) => {
  const [graphCardEndPosition, setGraphCardEndPosition] = useState(0);
  const currentPositionY = useSharedValue(0);

  const onPortfolioCardLayout = useCallback((event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    setGraphCardEndPosition(y + height / 10);
  }, []);

  // Static data instead of Redux selectors and hooks
  const areAccountsEmpty = false; // Always false since we have mock data
  const balance = "$0.00"; // Static balance from our mock data

  return (
    <Box onLayout={onPortfolioCardLayout}>
      <GraphCardContainer
        showGraphCard={showAssets}
        areAccountsEmpty={areAccountsEmpty}
        currentPositionY={currentPositionY}
        graphCardEndPosition={graphCardEndPosition}
      />
    </Box>
  );
};

export default React.memo(PortfolioGraphCard); 