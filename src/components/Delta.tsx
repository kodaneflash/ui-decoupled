import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconsLegacy } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import CurrencyUnitValue from "./CurrencyUnitValue";

interface ValueChange {
  value: number;
  percentage: number;
}

interface Unit {
  name: string;
  code: string;
  magnitude: number;
  symbol: string;
}

type Props = {
  valueChange?: ValueChange;
  percent?: boolean;
  show0Delta?: boolean;
  fallbackToPercentPlaceholder?: boolean;
  isArrowDisplayed?: boolean;
  unit?: Unit;
  range?: string;
};

const Delta: React.FC<Props> = ({
  valueChange,
  percent = false,
  show0Delta = false,
  fallbackToPercentPlaceholder = false,
  isArrowDisplayed = true,
  unit,
  range,
}) => {
  const { colors } = useTheme();

  // DEBUG: Log all input props and context
  console.log('[Delta] Input props:', {
    valueChange,
    percent,
    show0Delta,
    fallbackToPercentPlaceholder,
    isArrowDisplayed,
    unit: unit?.code,
    range,
    timestamp: new Date().toISOString(),
  });

  const percentPlaceholder = fallbackToPercentPlaceholder ? (
    <Text variant="large" color="neutral.c60" fontWeight="semiBold">
      —
    </Text>
  ) : null;

  if (!valueChange) {
    console.log('[Delta] No valueChange provided, returning placeholder');
    return percentPlaceholder;
  }

  const { percentage, value } = valueChange;
  
  // DEBUG: Log raw values before processing
  console.log('[Delta] Raw values:', {
    percentage,
    value,
    percentageType: typeof percentage,
    valueType: typeof value,
  });
  
  // Handle the delta calculation - percentage is already in decimal format (0-1)
  const delta = percent ? percentage * 100 : value;
  
  // Use EXACT Ledger Live rounding logic
  const roundedDelta = percent ? parseFloat(delta.toFixed(0)) : parseFloat(delta.toFixed(2));

  // DEBUG: Log calculated values
  console.log('[Delta] Calculated values:', {
    delta,
    roundedDelta,
    percent,
    deltaAfterMultiply: percent ? percentage * 100 : 'N/A',
    isZero: roundedDelta === 0,
    show0Delta,
    roundingMethod: percent ? 'toFixed(0)' : 'toFixed(2)',
    ledgerLiveCompatible: true,
  });

  if (roundedDelta === 0) {
    console.log('[Delta] Returning placeholder because roundedDelta is 0 (Ledger Live behavior)');
    return percentPlaceholder;
  }

  // Use EXACT Ledger Live colors and arrows (matching official implementation)
  const [color, ArrowIcon, sign] =
    roundedDelta > 0
      ? ["success.c50", IconsLegacy.ArrowEvolutionUpMedium, "+"] // Official success green
      : roundedDelta < 0
        ? ["error.c50", IconsLegacy.ArrowEvolutionDownMedium, "-"] // Official error red with minus sign
        : ["neutral.c70", null, ""];

  // DEBUG: Log color and arrow selection
  console.log('[Delta] Display properties:', {
    color,
    ArrowIcon: ArrowIcon?.name || 'null',
    sign,
    roundedDelta,
  });

  if (
    percent &&
    ((percentage === 0 && !show0Delta) ||
      percentage === null ||
      percentage === undefined)
  ) {
    console.log('[Delta] Returning early due to percentage conditions:', {
      percentage,
      show0Delta,
      isPercent: percent,
    });
    if (fallbackToPercentPlaceholder) return percentPlaceholder;
    if (percent && isArrowDisplayed && ArrowIcon) return <ArrowIcon size={20} color={color} />;
    return null;
  }

  if (Number.isNaN(delta)) {
    console.log('[Delta] Delta is NaN, returning fallback');
    if (percent && fallbackToPercentPlaceholder) return percentPlaceholder;
    return null;
  }

  const absDelta = Math.abs(roundedDelta);
  const absValue = Math.abs(value);

  // DEBUG: Log final display values
  console.log('[Delta] Final display values:', {
    absDelta,
    absValue,
    unit: unit?.code,
    displayText: percent ? `${absDelta.toFixed(0)}%` : 'currency',
    willShowArrow: percent && isArrowDisplayed && ArrowIcon,
    currencyFormat: unit ? `(${sign}$${absValue.toLocaleString()})` : 'N/A',
  });

  return (
    <View style={styles.root}>
      {percent && isArrowDisplayed && ArrowIcon && (
        <ArrowIcon size={20} color={color} />
      )}
      <View style={percent ? styles.content : null}>
        <Text
          variant="large"
          color={color}
          fontWeight="semiBold"
        >
          {unit && absValue !== 0 ? (
            <CurrencyUnitValue
              before={`(${sign}`}
              after=")"
              unit={unit}
              value={absValue}
            />
          ) : percent ? (
            `${absDelta.toFixed(0)}%`
          ) : null}
          {range && ` (${range})`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginLeft: 5, // EXACT 5px spacing from official code
  },
});

export default React.memo(Delta);