import React, { useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { Flex } from "@ledgerhq/native-ui";
import isEqual from "lodash/isEqual";
import AssetRow from "./AssetRow";
import { CRYPTO_ASSETS } from "../constants/portfolioData";

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

interface Asset {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
  amount: string;
  accounts: any[];
}

interface Props {
  onContentChange?: (width: number, height: number) => void;
  limitNumberOfAssets?: number;
}

// Estimated height per item (official Ledger Live calculation)
// Icon: 32px + Vertical padding: 48px (pt=6 + pb=6) = 80px total
const ESTIMATED_ITEM_HEIGHT = 80;

const AssetsListView: React.FC<Props> = ({
  onContentChange,
  limitNumberOfAssets = 5,
}) => {
  // Convert static data to match expected Asset format
  const assetsToDisplay: Asset[] = useMemo(() => {
    return CRYPTO_ASSETS.slice(0, limitNumberOfAssets).map(cryptoAsset => ({
      id: cryptoAsset.id,
      name: cryptoAsset.name,
      currency: cryptoAsset.currency,
      balance: cryptoAsset.balance,
      amount: cryptoAsset.amount || cryptoAsset.balance.toString(),
      accounts: [], // Empty for static implementation
      countervalueChange: (cryptoAsset as any).countervalueChange,
    }));
  }, [limitNumberOfAssets]);

  const onItemPress = useCallback((asset: Asset) => {
    // Static implementation - no navigation
    console.log("Asset pressed:", asset.name);
  }, []);

  const renderItem = useCallback(
    (asset: Asset, index: number) => {
      return (
        <Pressable
          key={asset.id}
          style={({ pressed }: { pressed: boolean }) => [
            { 
              opacity: pressed ? 0.5 : 1.0,
              // Remove marginVertical - let AssetRowLayout handle all spacing
            },
          ]}
          hitSlop={6}
          onPress={() => onItemPress(asset)}
        >
          <AssetRow asset={asset} />
        </Pressable>
      );
    },
    [onItemPress],
  );

  // Calculate total height based on number of items
  const totalHeight = useMemo(() => {
    return assetsToDisplay.length * ESTIMATED_ITEM_HEIGHT;
  }, [assetsToDisplay.length]);

  const handleContentSizeChange = useCallback((width: number, height: number) => {
    console.log('AssetsListView contentSizeChange:', { width, height, assetsCount: assetsToDisplay.length });
    onContentChange?.(width, height);
  }, [onContentChange, assetsToDisplay.length]);

  const handleLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    console.log('AssetsListView layout:', { width, height, totalHeight, assetsCount: assetsToDisplay.length });
    // Use the calculated total height if layout height is 0
    const effectiveHeight = height > 0 ? height : totalHeight;
    onContentChange?.(width, effectiveHeight);
  }, [onContentChange, assetsToDisplay.length, totalHeight]);

  console.log('AssetsListView rendering with assets:', assetsToDisplay.length, 'estimated height:', totalHeight);

  return (
    <View 
      testID="AssetsList"
      onLayout={handleLayout}
      style={{ 
        minHeight: totalHeight,
      }}
    >
      <Flex>
        {assetsToDisplay.map((asset, index) => renderItem(asset, index))}
      </Flex>
    </View>
  );
};

export default React.memo(AssetsListView, isEqual); 