import React from 'react';
import { Flex, Text } from '@ledgerhq/native-ui';
import styled from 'styled-components/native';
import Svg, { Path } from 'react-native-svg';
import Delta from './Delta';
import CurrencyUnitValue from './CurrencyUnitValue';

type Props = {
  balance?: string;
  areAccountsEmpty?: boolean;
};

// Graph component with SVG wavy line
const GraphChart = () => {
  const width = 320;
  const height = 80;
  
  // Create a wavy path that resembles the screenshot
  const pathData = `M 0,${height/2} Q ${width/8},${height/4} ${width/4},${height/2} T ${width/2},${height/3} T ${3*width/4},${height/2} T ${width},${height/4}`;
  
  return (
    <Flex height={120} mx={6} mb={6} alignItems="center" justifyContent="center">
      <Svg width={width} height={height}>
        <Path
          d={pathData}
          stroke="#666"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Flex>
  );
};

function GraphCard({ balance = "$0.00", areAccountsEmpty = false }: Props) {
  return (
    <Flex>
      {/* Balance Section */}
      <Flex alignItems="center" py={8}>
        <Text 
          fontSize="48px" 
          fontWeight="semiBold" 
          color="neutral.c100"
        >
          {balance}
        </Text>
        {!areAccountsEmpty && (
          <Flex flexDirection="row" alignItems="center" mt={2}>
            <Delta show0Delta />
          </Flex>
        )}
      </Flex>

      {/* Graph */}
      <GraphChart />
    </Flex>
  );
}

export default React.memo(GraphCard); 