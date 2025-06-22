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
  // Format currency unit similar to official Ledger Live
  const formatCurrencyUnit = (unit: Unit, value: BigNumber): string => {
    const amountNum = value.toNumber();
    
    // If amount is 0, return formatted 0
    if (amountNum === 0) {
      return '$0';
    }
    
    // For main portfolio balance display, use the total balance from our data
    // This matches the official Ledger Live behavior where it shows the total USD value
    const formattedValue = `$${amountNum.toLocaleString()}`;
    
    return showCode ? `${formattedValue} ${unit.code}` : formattedValue;
  };

  const formattedValue = formatCurrencyUnit(unit, value);
  
  if (!alwaysShowValue && value.isZero()) {
    return (
      <Text variant={variant} fontWeight={fontWeight} color={color}>
        $0
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
