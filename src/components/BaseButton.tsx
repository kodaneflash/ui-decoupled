import React, { useCallback, memo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Button } from "@ledgerhq/native-ui";
import type { ButtonProps } from "@ledgerhq/native-ui/components/cta/Button/index";

const inferType = (type?: string): ButtonProps["type"] => {
  switch (type) {
    case "primary":
    case "lightPrimary":
      return "shade";
    case "alert":
      return "error";
    case "negativePrimary":
    case "secondary":
    case "lightSecondary":
    case "darkSecondary":
    case "greySecondary":
    case "tertiary":
      return "main";
    default:
      return (type as ButtonProps["type"]) || "default";
  }
};

export interface BaseButtonProps extends Omit<ButtonProps, "type"> {
  title?: React.ReactNode | string;
  onPress?: () => void;
  pending?: boolean;
  disabled?: boolean;
  IconLeft?: React.ComponentType<{ size?: number; color?: string }>;
  IconRight?: React.ComponentType<{ size?: number; color?: string }>;
  containerStyle?: StyleProp<ViewStyle>;
  type?: string;
  event?: string;
  eventProperties?: Record<string, unknown>;
  testID?: string;
  isFocused?: boolean;
  useTouchable?: boolean;
}

type Props = BaseButtonProps & {
  useTouchable?: boolean;
  isFocused?: boolean;
};

export function BaseButton({
  title,
  onPress,
  Icon,
  IconLeft,
  IconRight,
  iconPosition,
  disabled,
  useTouchable,
  event,
  eventProperties,
  type,
  outline,
  containerStyle,
  children,
  isFocused,
  ...otherProps
}: Props) {
  const onPressHandler = useCallback(async () => {
    if (!onPress) return;
    if (event) {
      // In a real implementation, this would call analytics tracking
      console.log("Button analytics:", event, eventProperties);
    }
    onPress();
  }, [event, eventProperties, onPress]);

  const isDisabled = disabled || !onPress;

  const containerSpecificProps = useTouchable ? {} : { enabled: !isDisabled };

  function getTestID() {
    if (isDisabled || !isFocused) return undefined;
    if (otherProps.testID) return otherProps.testID;

    switch (type) {
      case "primary":
      case "main":
        return "proceed-button";
      default:
        return event;
    }
  }

  const testID = getTestID();

  const ButtonIcon = Icon ?? IconRight ?? IconLeft;
  const buttonIconPosition = iconPosition ?? (IconRight && "right") ?? (IconLeft && "left");

  return (
    <Button
      type={inferType(type)}
      onPress={isDisabled ? undefined : onPressHandler}
      Icon={ButtonIcon}
      iconPosition={buttonIconPosition}
      outline={outline}
      {...containerSpecificProps}
      {...otherProps}
      testID={testID}
      style={containerStyle}
      disabled={isDisabled}
    >
      {title || children || null}
    </Button>
  );
}

export default memo<BaseButtonProps>(BaseButton); 