import React from 'react';
import {Text} from '@ledgerhq/native-ui';
import BigNumber from 'bignumber.js';

interface Unit {
  name: string;
  code: string;
  magnitude: number;
  symbol: string;
}

type Props = {
  unit: Unit;
  value: BigNumber;
  showCode?: boolean;
  alwaysShowValue?: boolean;
  before?: string;
  after?: string;
  variant?: 'large' | 'body' | 'small';
  fontWeight?: 'medium' | 'semiBold';
  color?: string;
  joinFragmentsSeparator?: string;
};

const CurrencyUnitValue: React.FC<Props> = ({
  unit,
  value,
  showCode = false,
  alwaysShowValue = false,
  before = '',
  after = '',
  variant = 'body',
  fontWeight = 'medium',
  color = 'neutral.c70',
  joinFragmentsSeparator = '',
}) => {
  // Format currency unit - handle both fiat (USD) and crypto (BTC, ETH, etc.)
  const formatCurrencyUnit = (unit: Unit, value: BigNumber): string => {
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
    
    return showCode || true ? `${formattedAmount} ${unit.code}` : formattedAmount;
  };

  const formattedValue = formatCurrencyUnit(unit, value);
  
  if (!alwaysShowValue && value.isZero()) {
    const zeroDisplay = unit.code === 'USD' || unit.symbol === '$' ? '$0' : `0 ${unit.code}`;
    return (
      <Text variant={variant} fontWeight={fontWeight} color={color}>
        {zeroDisplay}
      </Text>
    );
  }

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
