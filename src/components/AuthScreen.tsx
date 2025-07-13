import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flex, Logos, Icons, Text, Button } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import LText from "./LText";
import BiometricsIcon from "./BiometricsIcon";
import Touchable from "./Touchable";
import { Privacy } from "../hooks/auth.hooks";
import { useAuthSubmit } from "../hooks/auth.hooks";
import PoweredByLedger from "../screens/Settings/PoweredByLedger";
import PasswordInput from "./PasswordInput";
import QueuedDrawer from "./QueuedDrawer";
import HardResetModal from "./HardResetModal";
import { BaseButton } from "./BaseButton";
import { AUTH_STRINGS, RESET_STRINGS } from "../constants/authStrings";

interface Props {
  privacy: Privacy;
  unlock: () => void;
  lock: () => void;
  biometricsError: Error | null | undefined;
}

// Use official Ledger PasswordInput component

const NormalHeader = () => {
  const { colors } = useTheme();

  return (
    <Flex alignItems="center" justifyContent="center">
      <Logos.LedgerLiveAltRegular color={colors.neutral?.c100 || "#FFF"} width={50} height={50} />
      <LText semiBold secondary style={styles.title}>
        {AUTH_STRINGS.unlock.title}
      </LText>
      <LText style={styles.description} color="grey">
        {AUTH_STRINGS.unlock.desc}
      </LText>
    </Flex>
  );
};

const FailBiometrics = ({ privacy, lock }: { privacy: Privacy; lock: () => void }) => {
  const { colors } = useTheme();

  return (
    <View>
      <TouchableWithoutFeedback onPress={lock}>
        <View style={styles.iconStyle}>
          <BiometricsIcon
            biometricsType={privacy.biometricsType}
            failed={true}
            color={colors.alert || "#FF6B6B"}
            size={80}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.textContainer}>
        <LText semiBold secondary style={styles.failedTitle}>
          {AUTH_STRINGS.failed.biometrics.title}
        </LText>
        <LText style={styles.failedDescription} color="grey">
          {AUTH_STRINGS.failed.biometrics.description}
        </LText>
      </View>
    </View>
  );
};

const FormFooter = ({
  inputFocused,
  passwordEmpty,
  onSubmit,
  passwordError,
  onPress,
}: {
  inputFocused: boolean;
  passwordEmpty: boolean;
  onSubmit: () => void;
  passwordError: Error | null | undefined;
  onPress: () => void;
}) => {
  return inputFocused ? (
    <BaseButton
      event="SubmitUnlock"
      title={AUTH_STRINGS.unlock.login}
      type="primary"
      onPress={onSubmit}
      containerStyle={styles.buttonContainer}
      disabled={!!passwordError || passwordEmpty}
      isFocused
      useTouchable
    />
  ) : (
    <Touchable event="ForgetPassword" onPress={onPress}>
      <LText semiBold style={styles.link} color="live">
        {AUTH_STRINGS.unlock.forgotPassword}
      </LText>
    </Touchable>
  );
};

const AuthScreen: React.FC<Props> = ({ privacy, biometricsError, lock, unlock }) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<Error | null>(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const { submit } = useAuthSubmit({
    password,
    unlock,
    setPasswordError,
    setPassword,
  });

  const onChangeInput = useCallback((text: string) => {
    setPassword(text);
    setPasswordError(null);
  }, []);

  const onSubmitInput = useCallback(() => {
    submit();
  }, [submit]);

  const onFocusInput = useCallback(() => {
    setPasswordFocused(true);
  }, []);

  const onBlurInput = useCallback(() => {
    setPasswordFocused(false);
  }, []);

  const toggleSecureTextEntry = useCallback(() => {
    setSecureTextEntry(!secureTextEntry);
  }, [secureTextEntry]);

  const onCloseModal = useCallback(() => {
    setIsModalOpened(false);
  }, []);

  const onOpenModal = useCallback(() => {
    setIsModalOpened(true);
  }, []);

  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background?.main || "#000" }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Flex flex={1} justifyContent="space-between">
          <Flex flex={1} px={16} justifyContent="center">
            <Flex alignItems="center" mt={32} mb={24}>
              {biometricsError ? (
                <FailBiometrics lock={lock} privacy={privacy} />
              ) : (
                <NormalHeader />
              )}
            </Flex>

            <PasswordInput
              error={passwordError}
              onChange={onChangeInput}
              onSubmit={onSubmitInput}
              toggleSecureTextEntry={toggleSecureTextEntry}
              secureTextEntry={secureTextEntry}
              placeholder={AUTH_STRINGS.unlock.inputPlaceholder}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
              password={password}
              testID="password-text-input"
            />

            {passwordError && (
              <LText style={styles.errorStyle}>
                {passwordError.message}
              </LText>
            )}

            <FormFooter
              inputFocused={passwordFocused}
              onSubmit={onSubmitInput}
              passwordError={passwordError}
              passwordEmpty={!password}
              onPress={onOpenModal}
            />
          </Flex>

          {!passwordFocused && (
            <Flex pb={16} pointerEvents="none">
              <PoweredByLedger />
            </Flex>
          )}
        </Flex>

        <QueuedDrawer isRequestingToBeOpened={isModalOpened} onClose={onCloseModal}>
          <HardResetModal />
        </QueuedDrawer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 16,
  },
  description: {
    textAlign: "center",
  },
  iconStyle: {
    alignSelf: "center",
  },
  textContainer: {
    marginTop: 16,
  },
  failedTitle: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  failedDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  errorStyle: {
    color: "red",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  link: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
    textAlign: "center",
  },
  buttonContainer: {
    marginHorizontal: 16,
  },
});

export default AuthScreen; 