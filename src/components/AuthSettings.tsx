import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Switch,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flex, Text, Button } from "@ledgerhq/native-ui";
import BiometricsIcon from "./BiometricsIcon";
import { Privacy } from "../hooks/auth.hooks";
import { useBiometricAuth } from "./RequestBiometricAuth";
import Touchable from "./Touchable";
import * as Keychain from "react-native-keychain";
import { AUTH_STRINGS, SETTINGS_STRINGS } from "../constants/authStrings";

interface Props {
  privacy: Privacy | null | undefined;
  setPrivacy: (privacy: Privacy) => void;
}

const AuthSettings: React.FC<Props> = ({ privacy, setPrivacy }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationPending, setValidationPending] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(
    privacy?.biometricsEnabled || false,
  );

  const savePassword = useCallback(async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters");
      return;
    }

    try {
      await Keychain.setGenericPassword("ledger", password);
      setPrivacy({
        hasPassword: true,
        biometricsType: privacy?.biometricsType || "FaceID",
        biometricsEnabled: false,
      });
      setShowPasswordModal(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      Alert.alert("Error", "Could not save password");
    }
  }, [password, confirmPassword, privacy, setPrivacy]);

  const removePassword = useCallback(async () => {
    Alert.alert(
      "Remove Password",
      "Are you sure you want to remove password protection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await Keychain.resetGenericPassword();
              setPrivacy({
                hasPassword: false,
                biometricsType: privacy?.biometricsType || "FaceID",
                biometricsEnabled: false,
              });
              setBiometricsEnabled(false);
            } catch (err) {
              Alert.alert("Error", "Could not remove password");
            }
          },
        },
      ]
    );
  }, [privacy, setPrivacy]);

  const onPasswordToggle = useCallback(() => {
    if (privacy?.hasPassword) {
      removePassword();
    } else {
      setShowPasswordModal(true);
    }
  }, [privacy?.hasPassword, removePassword]);

  const onBiometricsSuccess = useCallback(() => {
    setValidationPending(false);
    setPrivacy({
      ...privacy!,
      biometricsEnabled: biometricsEnabled,
    });
  }, [privacy, biometricsEnabled, setPrivacy]);

  const onBiometricsError = useCallback((error?: Error) => {
    setValidationPending(false);
    setBiometricsEnabled(prev => !prev);
    Alert.alert(AUTH_STRINGS.failed.title, error?.message || AUTH_STRINGS.failed.denied);
  }, []);

  const onBiometricsToggle = useCallback(() => {
    if (!privacy?.hasPassword) {
      Alert.alert("Password Required", "Please set up password lock first");
      return;
    }

    const newValue = !biometricsEnabled;
    setBiometricsEnabled(newValue);
    setValidationPending(true);
  }, [privacy?.hasPassword, biometricsEnabled]);

  useBiometricAuth({
    disabled: !validationPending,
    onSuccess: onBiometricsSuccess,
    onError: onBiometricsError,
  });

  const getPasswordDesc = () =>
    privacy?.biometricsType
      ? SETTINGS_STRINGS.display.passwordDescBioCompat
      : SETTINGS_STRINGS.display.passwordDesc;

  return (
    <SafeAreaView style={styles.container}>
      <Flex flex={1} p={16}>
        <Text variant="h4" style={styles.title}>Authentication Settings</Text>

        <View style={styles.settingRow}>
          <Flex flex={1} mr={16}>
            <Text variant="large" fontWeight="semiBold" style={styles.settingTitle}>
              {SETTINGS_STRINGS.display.password}
            </Text>
            <Text variant="body" color="neutral.c70" style={styles.settingDescription}>
              {getPasswordDesc()}
            </Text>
          </Flex>
          <Switch
            value={!!privacy?.hasPassword}
            onValueChange={onPasswordToggle}
            testID="password-settings-switch"
          />
        </View>

        {privacy?.biometricsType && (
          <View style={styles.settingRow}>
            <Flex flex={1} mr={16}>
              <Flex flexDirection="row" alignItems="center" mb={4}>
                <BiometricsIcon
                  biometricsType={privacy.biometricsType}
                  size={24}
                  color="#FFF"
                />
                <Text variant="large" fontWeight="semiBold" style={styles.settingTitle}>
                  {AUTH_STRINGS.enableBiometrics.title}
                </Text>
              </Flex>
              <Text variant="body" color="neutral.c70" style={styles.settingDescription}>
                {AUTH_STRINGS.enableBiometrics.desc}
              </Text>
            </Flex>
            <Switch
              value={biometricsEnabled}
              onValueChange={onBiometricsToggle}
              disabled={!privacy?.hasPassword}
            />
          </View>
        )}

        <Modal
          visible={showPasswordModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <Flex flex={1} p={16} justifyContent="center">
              <Text variant="h4" style={{ textAlign: "center", marginBottom: 32 }}>
                {AUTH_STRINGS.addPassword.title}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder={AUTH_STRINGS.addPassword.placeholder}
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoFocus
              />
              
              <TextInput
                style={styles.input}
                placeholder={AUTH_STRINGS.confirmPassword.placeholder}
                placeholderTextColor="#666"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              
              <Flex flexDirection="row" mt={16} style={styles.modalButtons}>
                <Flex flex={1} mr={8}>
                  <Button
                    type="default"
                    onPress={() => {
                      setShowPasswordModal(false);
                      setPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </Flex>
                
                <Flex flex={1} ml={8}>
                  <Button
                    type="main"
                    onPress={savePassword}
                    disabled={!password || !confirmPassword}
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </SafeAreaView>
        </Modal>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  title: {
    color: "#FFF",
    marginBottom: 32,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  settingTitle: {
    color: "#FFF",
    marginBottom: 4,
  },
  settingDescription: {
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 16,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    gap: 16,
  },
});

export default AuthSettings; 