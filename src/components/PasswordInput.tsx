import React, { useState, useCallback } from "react";
import { View, StyleSheet, TextInput, TextInputProps } from "react-native";
import { Icons } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import Touchable from "./Touchable";
import getFontStyle from "./LText/getFontStyle";

type Props = {
  secureTextEntry: boolean;
  onChange: (_: string) => void;
  onSubmit: () => void;
  toggleSecureTextEntry: () => void;
  placeholder: string;
  autoFocus?: boolean;
  inline?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: Error | null;
  password?: string;
  testID?: TextInputProps["testID"];
};

const getBorderColor = (
  isInline: boolean,
  isFocused: boolean,
  error: Error | null | undefined,
  colors: any,
) => {
  if (isInline) return undefined;
  if (!isFocused) return undefined;
  return error ? colors.alert : colors.live;
};

const PasswordInput = ({
  autoFocus,
  error,
  secureTextEntry,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  toggleSecureTextEntry,
  placeholder,
  inline,
  password,
  testID,
}: Props) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (onFocus) onFocus();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (onBlur) onBlur();
  }, [onBlur]);

  const borderColor = getBorderColor(!!inline, isFocused, error, colors);

  const touchableEvent = secureTextEntry
    ? "PasswordInputToggleUnsecure"
    : "PasswordInputToggleSecure";

  return (
    <View
      style={[
        styles.container,
        !inline && {
          ...styles.nonInlineContainer,
          backgroundColor: colors.background?.main || colors.card || "#1A1A1A",
          borderColor: colors.neutral?.c30 || colors.lightFog || "#333",
          ...(borderColor ? { borderColor } : {}),
        },
      ]}
    >
      <TextInput
        allowFontScaling={false}
        autoFocus={autoFocus}
        style={[
          styles.input,
          getFontStyle({ semiBold: true }),
          inline && styles.inlineTextInput,
          { color: colors.neutral?.c100 || colors.darkBlue || "#FFF" },
        ]}
        placeholder={placeholder}
        placeholderTextColor={error ? colors.alert || "#FF6B6B" : colors.neutral?.c70 || colors.fog || "#666"}
        returnKeyType="done"
        blurOnSubmit={false}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        secureTextEntry={secureTextEntry}
        textContentType="password"
        autoCorrect={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={password}
        testID={testID}
      />
      <TouchableIcon
        touchableEvent={touchableEvent}
        onPress={toggleSecureTextEntry}
        secureTextEntry={secureTextEntry}
        colors={colors}
      />
    </View>
  );
};

export default PasswordInput;

interface TouchableIconProps {
  touchableEvent: string;
  onPress: () => void;
  secureTextEntry: boolean;
  colors: any;
}

const TouchableIcon = ({
  touchableEvent,
  onPress,
  secureTextEntry,
  colors,
}: TouchableIconProps) => {
  return (
    <Touchable event={touchableEvent} style={styles.iconInput} onPress={onPress}>
      {secureTextEntry ? (
        <Icons.Eye size="S" color={colors.neutral?.c70 || colors.grey || "#666"} />
      ) : (
        <Icons.EyeCross size="S" color={colors.neutral?.c70 || colors.grey || "#666"} />
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 4,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  nonInlineContainer: {
    borderWidth: 1,
  },
  inlineTextInput: {
    fontSize: 20,
  },
  input: {
    fontSize: 16,
    height: 48,
    flex: 1,
  },
  iconInput: {
    justifyContent: "center",
    marginRight: 16,
  },
}); 