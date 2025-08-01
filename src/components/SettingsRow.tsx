import React, { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Box, Checkbox, Flex, Text, Tag, Icons } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import Touchable from "./Touchable";

const StyledRowContainer = styled(Flex)<{
  compact?: boolean;
  hasBorderTop?: boolean;
}>`
  border-bottom-color: ${p => p.theme.colors.neutral.c40};
  border-bottom-width: ${p => (p.compact ? 0 : 1)}px;
  ${p =>
    p.hasBorderTop
      ? `
  border-top-color: ${p.theme.colors.neutral.c40};
  border-top-width: ${p.compact ? 0 : 1}px;
`
      : ``}
`;

const StyledTouchableRow = styled(Touchable)<{
  compact?: boolean;
  disabled?: boolean;
}>`
  background-color: ${p => p.theme.colors.background.main};
  padding: ${p => p.theme.space[p.compact ? 6 : 7]}px ${p => p.theme.space[6]}px;
  flex-direction: row;
  align-items: center;

  ${p => p.disabled && "opacity: 0.6;"}
`;

function SettingsRow({
  onPress,
  onLongPress,
  onHelpPress,
  title,
  titleStyle,
  titleContainerStyle,
  subtitle,
  style,
  desc,
  selected,
  arrowRight,
  iconLeft,
  centeredIcon,
  children,
  noTextDesc,
  event,
  eventProperties,
  compact,
  label,
  testID,
  hasBorderTop,
  disabled,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  onHelpPress?: () => void;
  title: ReactNode;
  subtitle?: string;
  titleStyle?: StyleProp<TextStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  desc?: ReactNode;
  selected?: boolean;
  arrowRight?: boolean;
  iconLeft?: React.ReactNode;
  centeredIcon?: boolean;
  children?: ReactNode;
  noTextDesc?: boolean;
  event?: string;
  eventProperties?: Record<string, unknown>;
  compact?: boolean;
  label?: string;
  hasBorderTop?: boolean;
  testID?: string;
  disabled?: boolean;
}) {
  let title$ = (
    <Flex flexDirection={"row"} alignItems={"center"} style={titleContainerStyle}>
      <Flex flexDirection={"row"} alignItems={"center"}>
        <Text variant={"large"} fontWeight={"semiBold"} color={"neutral.c100"} style={[titleStyle]}>
          {title}
        </Text>
        {label ? <Tag ml={3}>{label}</Tag> : null}
      </Flex>
      {subtitle && (
        <Text variant={"body"} fontWeight={"medium"} color={"neutral.c70"} ml={3}>
          {subtitle}
        </Text>
      )}
      {!!onHelpPress && (
        <Box marginLeft={3}>
          <Icons.Information size={"M"} color={"neutral.c80"} />
        </Box>
      )}
    </Flex>
  );

  if (onHelpPress) {
    title$ = <Touchable onPress={onHelpPress}>{title$}</Touchable>;
  }

  return (
    <StyledRowContainer hasBorderTop={hasBorderTop} compact={compact}>
      <StyledTouchableRow
        onPress={onPress}
        onLongPress={onLongPress}
        event={event}
        eventProperties={eventProperties}
        style={style}
        compact={compact}
        testID={testID}
        disabled={disabled}
      >
        {iconLeft && (
          <Flex paddingRight={6} justifyContent={centeredIcon ? "center" : undefined}>
            {iconLeft}
          </Flex>
        )}
        <Box flexShrink={1} paddingRight={6} marginRight={"auto"}>
          {title$}
          {desc && !noTextDesc && (
            <Text variant={"body"} fontWeight={"medium"} color={"neutral.c70"}>
              {desc}
            </Text>
          )}
          {desc && noTextDesc && desc}
        </Box>
        <Box
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          flexShrink={0}
          maxWidth={"50%"}
        >
          {children}
          {arrowRight ? (
            <Box marginLeft={4}>
              <Icons.ChevronRight size={"M"} color={"neutral.c70"} />
            </Box>
          ) : selected ? (
            <Box marginRight={4}>
              <Checkbox checked={true} />
            </Box>
          ) : null}
        </Box>
      </StyledTouchableRow>
    </StyledRowContainer>
  );
}

export default SettingsRow; 