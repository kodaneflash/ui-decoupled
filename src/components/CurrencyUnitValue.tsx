import React from 'react';
import {Text} from '@ledgerhq/native-ui';

type Unit = {
  code: string;
  symbol: string;
  magnitude: number;
  name: string;
};

type Props = {
  unit: Unit;
  value: number;
  joinFragmentsSeparator?: string;
  showCode?: boolean;
  color?: string;
  variant?: 'large' | 'body' | 'small';
  fontWeight?: 'medium' | 'semiBold';
};

const CurrencyUnitValue = ({
  unit,
  value,
  joinFragmentsSeparator = '',
  showCode = false,
  color = 'neutral.c70',
  variant = 'body',
  fontWeight = 'medium',
}: Props) => {
  // Format the value based on the unit
  const formatValue = () => {
    if (unit.code === 'USD') {
      return `${unit.symbol}${value.toFixed(2)}`;
    }
    // For crypto currencies, show with proper precision
    const formattedValue = value === 0 ? '0' : value.toFixed(unit.magnitude);
    return showCode
      ? `${formattedValue} ${unit.code}`
      : `${unit.symbol}${formattedValue}`;
  };

  return (
    <Text variant={variant} fontWeight={fontWeight} color={color}>
      {formatValue()}
    </Text>
  );
};

export default React.memo(CurrencyUnitValue);
