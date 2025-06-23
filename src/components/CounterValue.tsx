import React from "react";
import { Text } from "@ledgerhq/native-ui";
import BigNumber from "bignumber.js";
import { usePriceContext } from "../context/PriceContext";
import type { SupportedCryptoId } from "../services/PriceService";

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

type Props = {
  currency: Currency;
  value: BigNumber;
  joinFragmentsSeparator?: string;
  showCode?: boolean;
  alwaysShowValue?: boolean;
  before?: string;
  after?: string;
  placeholder?: string;
};

const CounterValue: React.FC<Props> = ({
  currency,
  value,
  joinFragmentsSeparator = "",
  showCode = false,
  alwaysShowValue = false,
  before = "",
  after = "",
  placeholder = "-",
}) => {
  const { calculateFiatValue, loading } = usePriceContext();

  // Map currency ID to supported crypto IDs (only BTC and SOL supported)
  const getSupportedCryptoId = (currencyId: string): SupportedCryptoId | null => {
    switch (currencyId) {
      case 'bitcoin':
        return 'bitcoin';
      case 'solana':
        return 'solana';
      default:
        return null;
    }
  };

  const formatFiatValue = (fiatAmount: BigNumber): string => {
    const amount = fiatAmount.toNumber();
    
    if (amount === 0) {
      return placeholder;
    }
    
    // Format with full numbers and comma separators (like $8,562,791.95)
    if (amount >= 1) {
      return `$${amount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    } else {
      // For amounts less than $1, show more decimal places
      return `$${amount.toFixed(4)}`;
    }
  };

  // Dynamic fiat conversion using live prices
  const getFiatValue = (): string => {
    if (loading) {
      return placeholder;
    }

    const supportedCryptoId = getSupportedCryptoId(currency.id);
    
    if (!supportedCryptoId) {
      // Unsupported currency - return 0 or placeholder
      return placeholder;
    }

    try {
      // Get currency unit magnitude for proper decimal calculation
      const magnitude = currency.units[0]?.magnitude || 8;
      const fiatAmount = calculateFiatValue(supportedCryptoId, value, magnitude);
      return formatFiatValue(fiatAmount);
    } catch (error) {
      console.error('[CounterValue] Error calculating fiat value:', error);
      return placeholder;
    }
  };

  const fiatValue = getFiatValue();
  
  return `${before}${fiatValue}${showCode ? " USD" : ""}${after}`;
};

export default React.memo(CounterValue); 