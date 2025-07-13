import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "styled-components/native";
import LText from "../../components/LText";
import LedgerLogoRec from "../../icons/LedgerLogoRec";

export default function PoweredByLedger() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <LText secondary semiBold style={styles.textStyle} color="grey">
        Powered by
      </LText>
      <View style={styles.iconStyle}>
        <LedgerLogoRec height={17} width={68} color={colors.neutral?.c70 || colors.grey || "#999"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  textStyle: {
    justifyContent: "center",
    fontSize: 12,
  },
  iconStyle: {
    marginLeft: 5,
    alignSelf: "flex-end",
  },
}); 