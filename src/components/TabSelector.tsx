import React, { useState, useEffect } from "react";
import { Pressable, LayoutChangeEvent } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import styled from "styled-components/native";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";

const Container = styled(Flex)`
  height: 100%;
  justify-content: space-between;
  flex-direction: row;
  position: relative;
`;

const AnimatedBackground = styled(Animated.View)<{ $radius: number }>`
  position: absolute;
  height: 100%;
  border-radius: ${({ $radius }) => $radius}px;
  background-color: ${({ theme }) => theme.colors.opacityDefault?.c05 || 'rgba(255, 255, 255, 0.05)'};
`;

const Tab = styled(Flex)<{ $radius: number }>`
  flex: 1;
  padding: 4px;
  border-radius: ${({ $radius }) => $radius}px;
  align-items: center;
  justify-content: center;
`;

interface TabSelectorProps<T extends string> {
  labels: { id: T; value: string }[];
  initialTab?: T;
  onToggle: (value: T) => void;
  filledVariant?: boolean;
}

export default function TabSelector<T extends string>({
  labels,
  initialTab,
  onToggle,
  filledVariant = false,
}: TabSelectorProps<T>): JSX.Element {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const initialIndex = initialTab ? labels.findIndex((l) => l.id === initialTab) : 0;
  const translateX = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    if (containerWidth > 0) {
      translateX.value = (containerWidth / labels.length) * initialIndex;
    }
  }, [containerWidth, labels.length, initialIndex, translateX]);

  const handlePress = (id: T, index: number) => {
    setSelectedIndex(index);
    translateX.value = (containerWidth / labels.length) * index;
    if (selectedIndex !== index) onToggle(id);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(translateX.value, { duration: 250 }) }],
      width: containerWidth / labels.length,
    };
  });

  const boxStyles = filledVariant
    ? {
        bg: "neutral.c30" as const,
      }
    : {
        p: 2 as const,
        border: 1 as const,
        borderColor: "opacityDefault.c10" as const,
      };
  const tabRadius = filledVariant ? 12 : 8;

  return (
    <Box
      height="100%"
      width="100%"
      borderRadius={12}
      bg={boxStyles.bg}
      p={boxStyles.p}
      border={boxStyles.border}
      borderColor={boxStyles.borderColor}
    >
      <Container onLayout={handleLayout}>
        <AnimatedBackground style={animatedStyle} $radius={tabRadius} />
        {labels.map((label, index) => (
          <Pressable
            hitSlop={6}
            key={label.id}
            onPress={() => handlePress(label.id, index)}
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: pressed && selectedIndex !== index ? 0.5 : 1,
              flex: 1,
            })}
          >
            <Tab $radius={tabRadius}>
              <Text fontSize={14} fontWeight="semiBold" numberOfLines={1}>
                {label.value}
              </Text>
            </Tab>
          </Pressable>
        ))}
      </Container>
    </Box>
  );
} 