import React from 'react';
import { Text } from '@ledgerhq/native-ui';

type Unit = {
  code: string;
  symbol: string;
  magnitude: number;
  name: string;
};

type ValueChange = {
  value: number;
  percentage: number;
};

type Props = {
  valueChange?: ValueChange;
  unit?: Unit;
  percent?: boolean;
  show0Delta?: boolean;
  variant?: "large" | "body" | "small";
  fontWeight?: "medium" | "semiBold";
};

const Delta = ({ 
  valueChange,
  unit,
  percent = false,
  show0Delta = true,
  variant = "body",
  fontWeight = "medium"
}: Props) => {
  // For static replica, always show 0 values
  const value = valueChange?.value || 0;
  const percentage = valueChange?.percentage || 0;
  
  if (!show0Delta && value === 0 && percentage === 0) {
    return null;
  }

  // Determine what to display
  let displayValue = "";
  let color = "neutral.c70";

  if (percent) {
    // Show percentage change
    displayValue = `${percentage.toFixed(2)}%`;
    color = percentage > 0 ? "success.c50" : percentage < 0 ? "error.c50" : "neutral.c70";
  } else if (unit) {
    // Show value change with unit
    const formattedValue = unit.code === "USD" 
      ? `${unit.symbol}${Math.abs(value).toFixed(2)}`
      : `${Math.abs(value).toFixed(unit.magnitude)} ${unit.code}`;
    
    displayValue = value > 0 ? `+${formattedValue}` : value < 0 ? `-${formattedValue}` : formattedValue;
    color = value > 0 ? "success.c50" : value < 0 ? "error.c50" : "neutral.c70";
  }

  if (!displayValue) return null;

  return (
    <Text 
      variant={variant} 
      fontWeight={fontWeight} 
      color={color}
    >
      {displayValue}
    </Text>
  );
};

export default React.memo(Delta); 