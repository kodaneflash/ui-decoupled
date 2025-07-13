import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Switch } from "@ledgerhq/native-ui";
import SettingsRow from "./SettingsRow";
import { useBiometricAuth } from "./RequestBiometricAuth";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function BiometricsRow() {
  const { privacy, setPrivacy } = usePortfolioData();
  const [validationPending, setValidationPending] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(
    privacy?.biometricsEnabled || validationPending,
  );

  const biometricsType = privacy?.biometricsType || "Face ID";

  const onValueChange = useCallback(
    async (biometricsEnabled: boolean) => {
      if (validationPending) return;
      setValidationPending(true);
      setBiometricsEnabled(biometricsEnabled);
    },
    [validationPending],
  );

  const onSuccess = useCallback(() => {
    setValidationPending(false);
    setPrivacy({
      ...privacy!,
      biometricsEnabled,
    });
  }, [biometricsEnabled, privacy, setPrivacy]);

  const onError = useCallback(
    (error?: Error) => {
      setValidationPending(false);
      setBiometricsEnabled((val: boolean) => !val);
      Alert.alert(
        "Authentication Failed", 
        `Authentication failed. Please try again.\n${String(error || "")}`
      );
    },
    [],
  );

  useBiometricAuth({
    disabled: !validationPending,
    onSuccess,
    onError,
  });

  // Reset the switch state if user directly disable password
  useEffect(() => {
    if (!privacy?.hasPassword && biometricsEnabled) {
      setBiometricsEnabled(false);
    }
  }, [privacy, biometricsEnabled]);

  return (
    <>
      {privacy?.biometricsType ? (
        <SettingsRow
          title={`Enable ${biometricsType}`}
          desc={`Use ${biometricsType} to unlock your wallet`}
          disabled={!privacy.hasPassword}
        >
          <Switch
            checked={biometricsEnabled}
            onChange={onValueChange}
            disabled={!privacy.hasPassword}
          />
        </SettingsRow>
      ) : null}
    </>
  );
} 