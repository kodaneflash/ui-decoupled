import React from 'react';
import {Text} from '@ledgerhq/native-ui';
import { BigNumber } from 'bignumber.js';

interface Unit {
  name: string;
  code: string;
  magnitude: number;
  symbol: string;
}

// Simplified formatCurrencyUnit that matches Ledger Live's behavior
const formatCurrencyUnit = (
  unit: Unit, 
  value: BigNumber,
  options: {
    showCode?: boolean;
    locale?: string;
    discreet?: boolean;
  } = {}
): string => {
  const { showCode = true } = options;
  const amountNum = value.toNumber();
  
  // Handle fiat currencies (USD, EUR, etc.)
  if (unit.code === 'USD' || unit.symbol === '$') {
    if (amountNum === 0) {
      return '$0';
    }
    // For fiat, value is already in the correct unit (no conversion needed)
    return `$${amountNum.toLocaleString()}`;
  }
  
  // Handle crypto currencies (BTC, ETH, SOL, etc.)
  if (amountNum === 0) {
    return `0 ${unit.code}`;
  }
  
  // For crypto amounts, convert from smallest unit based on magnitude
  const displayAmount = amountNum / Math.pow(10, unit.magnitude);
  
  // Format with appropriate decimal places
  const formattedAmount = displayAmount < 1 
    ? displayAmount.toFixed(unit.magnitude) // Show full precision for small amounts
    : displayAmount.toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 4 
      });
  
  return showCode ? `${formattedAmount} ${unit.code}` : formattedAmount;
};

export type CurrencyUnitValueProps = {
  unit: Unit;
  value?: BigNumber | number | null;
  showCode?: boolean;
  alwaysShowValue?: boolean;
  before?: string;
  after?: string;
  variant?: 'large' | 'body' | 'small';
  fontWeight?: 'medium' | 'semiBold';
  color?: string;
  joinFragmentsSeparator?: string;
};

const CurrencyUnitValue: React.FC<CurrencyUnitValueProps> = ({
  unit,
  value: valueProp,
  showCode = false,
  alwaysShowValue = false,
  before = '',
  after = '',
  variant = 'body',
  fontWeight = 'medium',
  color = 'neutral.c70',
  joinFragmentsSeparator = '',
}) => {
  // EXACT Ledger Live defensive value handling
  const value =
    valueProp || valueProp === 0
      ? valueProp instanceof BigNumber
        ? valueProp
        : new BigNumber(valueProp)
      : null;

  // Return empty string if no value (matches Ledger Live behavior)
  if (!value) {
    return <></>;
  }

  const formattedValue = formatCurrencyUnit(unit, value, { showCode });
  const displayText = `${before}${formattedValue}${after}`;
  
  // For inline display (when used inside other Text components), return just the string
  if (joinFragmentsSeparator === '') {
    return <>{displayText}</>;
  }
  
  return (
    <Text variant={variant} fontWeight={fontWeight} color={color}>
      {displayText}
    </Text>
  );
};

export default React.memo(CurrencyUnitValue);
