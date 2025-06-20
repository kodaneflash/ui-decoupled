import React from 'react';
import { Text } from '@ledgerhq/native-ui';

type Props = {
  value: string; // Simple string like "0 BTC" or "$0.00"
  showCode?: boolean;
  color?: string;
  variant?: "large" | "body" | "small";
  fontWeight?: "medium" | "semiBold";
};

const CurrencyUnitValue = ({ 
  value, 
  color = "neutral.c70",
  variant = "body",
  fontWeight = "medium"
}: Props) => {
  return (
    <Text 
      variant={variant} 
      fontWeight={fontWeight} 
      color={color}
    >
      {value}
    </Text>
  );
};

export default React.memo(CurrencyUnitValue); 