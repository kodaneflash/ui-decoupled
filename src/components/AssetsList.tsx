import React from "react";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { View } from "react-native";
import { useTheme } from "styled-components/native";

interface Asset {
  id: string;
  name: string;
  ticker: string;
  balance: string;
  balanceFormatted: string;
  percentage: string;
  color: string;
  symbol: string;
}

const staticAssets: Asset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    balance: "$***",
    balanceFormatted: "*** BTC",
    percentage: "19515%",
    color: "#F7931A",
    symbol: "₿",
  },
  {
    id: "xrp", 
    name: "XRP",
    ticker: "XRP",
    balance: "$***",
    balanceFormatted: "*** XRP",
    percentage: "285%",
    color: "#0085C3",
    symbol: "✕",
  },
];

interface AssetRowProps {
  asset: Asset;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset }) => {
  const { colors } = useTheme();
  
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      py={3}
      height={72}
    >
      {/* Currency Icon */}
      <Flex flexDirection="row" alignItems="center" flex={1}>
        <Box
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={asset.color}
          alignItems="center"
          justifyContent="center"
          mr={3}
        >
          <Text color="white" fontSize={18} fontWeight="bold">
            {asset.symbol}
          </Text>
        </Box>
        
        {/* Asset Info */}
        <Flex flex={1}>
          <Text color="neutral.c100" variant="large" fontWeight="semiBold">
            {asset.name}
          </Text>
          <Text color="neutral.c70" variant="small">
            {asset.balanceFormatted}
          </Text>
        </Flex>
      </Flex>

      {/* Balance and Change */}
      <Flex alignItems="flex-end">
        <Text color="neutral.c100" variant="large" fontWeight="semiBold">
          {asset.balance}
        </Text>
        <Flex flexDirection="row" alignItems="center">
          <Box mr={1}>
            <Text color="#66BE54" variant="small">
              ↗
            </Text>
          </Box>
          <Text color="#66BE54" variant="small">
            {asset.percentage}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface AssetsListProps {
  onContentChange?: (width: number, height: number) => void;
}

const AssetsList: React.FC<AssetsListProps> = ({ onContentChange }) => {
  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    onContentChange?.(width, height);
  };

  return (
    <View onLayout={handleLayout}>
      {staticAssets.map((asset) => (
        <AssetRow key={asset.id} asset={asset} />
      ))}
    </View>
  );
};

export default React.memo(AssetsList); 