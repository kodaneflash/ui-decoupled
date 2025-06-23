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

  const percentPlaceholder = fallbackToPercentPlaceholder ? (
    <Text variant="large" color="neutral.c60" fontWeight="semiBold">
      —
    </Text>
  ) : null;

  if (!valueChange) {
    return percentPlaceholder;
  }

  const { percentage, value } = valueChange;
  
  // Handle the delta calculation - percentage is already in decimal format (0-1)
  const delta = percent ? percentage * 100 : value;
  const roundedDelta = parseFloat(delta.toFixed(percent ? 0 : 2));

  if (roundedDelta === 0 && !show0Delta) {
    return percentPlaceholder;
  }

  // Use EXACT Ledger Live colors and arrows (matching official implementation)
  const [color, ArrowIcon, sign] =
    roundedDelta > 0
      ? ["success.c50", IconsLegacy.ArrowEvolutionUpMedium, "+"] // Official success green
      : roundedDelta < 0
        ? ["error.c50", IconsLegacy.ArrowEvolutionDownMedium, ""] // Official error red, no explicit sign
        : ["neutral.c70", null, ""];

  if (
    percent &&
    ((percentage === 0 && !show0Delta) ||
      percentage === null ||
      percentage === undefined)
  ) {
    if (fallbackToPercentPlaceholder) return percentPlaceholder;
    if (percent && isArrowDisplayed && ArrowIcon) return <ArrowIcon size={20} color={color} />;
    return null;
  }

  if (Number.isNaN(delta)) {
    if (percent && fallbackToPercentPlaceholder) return percentPlaceholder;
    return null;
  }

  const absDelta = Math.abs(roundedDelta);
  const absValue = Math.abs(value);

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
              before={`${sign}`}
              after=""
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
