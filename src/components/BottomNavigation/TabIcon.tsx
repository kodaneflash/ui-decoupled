import React from "react";
import { Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";

type Props = {
  color: string;
  label: string;
  testID?: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const TabIconContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: ${p => p.theme.space[2]}px;
`;

export default function TabIcon({ Icon, label, color, testID }: Props) {
  return (
    <TabIconContainer testID={testID}>
      <Icon size={24} color={color} />
      <Text
        numberOfLines={1}
        fontWeight="semiBold"
        variant="tiny"
        textAlign="center"
        pt={2}
        color={color}
      >
        {label}
      </Text>
    </TabIconContainer>
  );
}