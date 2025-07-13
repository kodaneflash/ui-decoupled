import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "styled-components/native";
import { Flex, Text, Icons } from "@ledgerhq/native-ui";
import LText from "./LText";

// Exact replica of Ledger Live Mobile HardResetModal
function HardResetModal() {
  const { colors } = useTheme();
  
  return (
    <Flex alignItems="center" px={6} py={4}>
      {/* Trash Icon in Circle */}
      <View 
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.alert ? `${colors.alert}20` : "#FF6B6B20",
          }
        ]}
      >
        <Icons.Trash size="M" color={colors.alert || "#FF6B6B"} />
      </View>

      {/* Description */}
      <LText style={styles.description} color="neutral.c70">
        Please uninstall then reinstall the app on your phone to delete Ledger Live data, including accounts and settings.
      </LText>

      {/* Warning Alert */}
      <View 
        style={[
          styles.warningContainer,
          {
            backgroundColor: colors.warning ? `${colors.warning}10` : "#FFA50010",
            borderColor: colors.warning ? `${colors.warning}30` : "#FFA50030",
          }
        ]}
      >
        <LText style={styles.warningText} color="warning">
          Resetting Ledger Live will erase your swap transaction history for all your accounts.
        </LText>
      </View>
    </Flex>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  warningContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "stretch",
  },
  warningText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

// eslint-disable-next-line @typescript-eslint/ban-types
export default memo<{}>(HardResetModal); 