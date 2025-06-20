import React from 'react';
import { Text } from '@ledgerhq/native-ui';

type Props = {
  value?: string; // Simple string like "+2.5%" or "-$50.00"
  isPositive?: boolean;
  show0Delta?: boolean;
  percent?: boolean;
};

const Delta = ({ 
  value = "0.00%", 
  isPositive = false,
  show0Delta = true 
}: Props) => {
  // For static replica, just show 0.00% always
  const displayValue = show0Delta ? "0.00%" : "";
  const color = isPositive ? "success.c50" : "neutral.c70";

  if (!displayValue) return null;

  return (
    <Text 
      variant="body" 
      fontWeight="medium" 
      color={color}
    >
      {displayValue}
    </Text>
  );
};

export default React.memo(Delta); 