import React, { useCallback } from "react";
import { Alert } from "react-native";
import { Switch, Flex } from "@ledgerhq/native-ui";
import SettingsRow from "./SettingsRow";
import BiometricsRow from "./BiometricsRow";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function AuthSecurityToggle() {
  const { privacy, setPrivacy } = usePortfolioData();

  const onPasswordToggle = useCallback((enabled: boolean) => {
    if (enabled) {
      // Enable password lock
      setPrivacy({
        ...privacy,
        hasPassword: true,
        biometricsEnabled: false, // Reset biometrics when password is enabled
      });
    } else {
      // Disable password lock
      Alert.alert(
        "Disable Password Lock",
        "Are you sure you want to disable password lock? This will also disable Face ID authentication.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Disable", 
            onPress: () => setPrivacy({
              ...privacy,
              hasPassword: false,
              biometricsEnabled: false,
            })
          },
        ]
      );
    }
  }, [privacy, setPrivacy]);

  const getPasswordDesc = () => {
    if (privacy?.biometricsType) {
      return `Secure your wallet with ${privacy.biometricsType} or passcode`;
    }
    return "Secure your wallet with a passcode";
  };

  return (
    <Flex>
      <SettingsRow
        title="Password Lock"
        desc={getPasswordDesc()}
      >
        <Switch
          checked={!!privacy?.hasPassword}
          onChange={onPasswordToggle}
        />
      </SettingsRow>
      <BiometricsRow />
    </Flex>
  );
} 