import React, { useCallback, useMemo } from "react";
import { BigNumber } from "bignumber.js";
import isEqual from "lodash/isEqual";
import { GestureResponderEvent } from "react-native";
import AssetRowLayout from "./AssetRowLayout";
import { usePriceContext } from "../context/PriceContext";

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
  countervalueChange?: {
    [timeframe: string]: {
      value: number;
      percentage: number;
    };
  };
}

interface ValueChange {
  value: number;
  percentage: number;
}

type Props = {
  asset: Asset;
  hideDelta?: boolean;
  topLink?: boolean;
  bottomLink?: boolean;
  onPress?: (asset: Asset) => void;
};

const AssetRow = ({
  asset,
  hideDelta,
  topLink,
  bottomLink,
  onPress,
}: Props) => {
  const { selectedTimeframe } = usePriceContext();
  const currency = asset.currency;
  const name = currency.name;
  const unit = currency.units[0];

  // Get countervalue change for the selected timeframe
  const countervalueChange: ValueChange = useMemo(() => {
    // Try to get timeframe-specific data first
    if (asset.countervalueChange && asset.countervalueChange[selectedTimeframe]) {
      const timeframeData = asset.countervalueChange[selectedTimeframe];
      console.log(`[AssetRow] Using ${selectedTimeframe} data for ${asset.id}:`, timeframeData);
      return timeframeData;
    }
    
    // Fallback to default data
    const fallback = (asset as any).countervalueChange || {
      value: 0,
      percentage: 0,
    };
    
    console.log(`[AssetRow] Using fallback data for ${asset.id}:`, fallback);
    return fallback;
  }, [asset, selectedTimeframe]);

  const onAssetPress = useCallback(
    (uiEvent: GestureResponderEvent) => {
      if (onPress) {
        onPress(asset);
      }
    },
    [asset, onPress],
  );

  /**
   * Avoid passing a new object to AssetRowLayout if the value didn't actually
   * change.
   * Not a small optimisation as that component can take several milliseconds to
   * render, and it's meant to be rendered in a list.
   */
  const balance = useMemo(() => BigNumber(asset.amount || 0), [asset.amount]);

  return (
    <AssetRowLayout
      onPress={onAssetPress}
      currency={currency}
      currencyUnit={unit}
      balance={balance}
      name={name}
      countervalueChange={countervalueChange}
      topLink={topLink}
      bottomLink={bottomLink}
      hideDelta={hideDelta}
    />
  );
};

export default React.memo(
  AssetRow,
  /**
   * Here we need a deep compare for the `asset` prop in particular.
   * We want to avoid recomputing usePortfolioForAccounts if the accounts value
   * did not change.
   * (That portfolio computation can take several milliseconds ~4ms for instance
   * on a performant device, in __DEV__ mode). Since it's meant to be rendered
   * in a list, this is not a small optimisation.
   */
  (prevProps, newProps) => isEqual(prevProps, newProps),
); 