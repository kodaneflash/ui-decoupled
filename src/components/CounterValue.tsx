import React from "react";
import { Text } from "@ledgerhq/native-ui";
import BigNumber from "bignumber.js";

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
  // Static fiat conversion based on currency ID and amount
  const getFiatValue = (currencyId: string, amount: BigNumber): string => {
    const amountNum = amount.toNumber();
    
    // Static conversion rates for our demo
    const fiatValues: { [key: string]: number } = {
      bitcoin: amountNum > 0 ? 45234 : 0,
      ethereum: amountNum > 0 ? 7892 : 0,
      xrp: amountNum > 0 ? 875 : 0,
      tether: amountNum > 0 ? 1000 : 0,
      bnb: amountNum > 0 ? 2340 : 0,
    };
    
    const fiatAmount = fiatValues[currencyId] || 0;
    
    if (fiatAmount === 0) {
      return placeholder;
    }
    
    return fiatAmount >= 1000 
      ? `$${(fiatAmount / 1000).toFixed(1)}k`
      : `$${fiatAmount.toLocaleString()}`;
  };

  const fiatValue = getFiatValue(currency.id, value);
  
  return `${before}${fiatValue}${showCode ? " USD" : ""}${after}`;
};

export default React.memo(CounterValue); 