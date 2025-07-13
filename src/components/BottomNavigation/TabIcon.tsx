import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import LText from "../LText";

type Props = {
  color: string;
  label: string;
  testID?: string;
  onPress?: () => void;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const TabIconContainer = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: ${p => p.theme.space[2]}px;
`;

export default function TabIcon({ Icon, label, color, testID, onPress }: Props) {
  return (
    <TabIconContainer testID={testID} onPress={onPress}>
      <Icon size={24} color={color} />
      <View style={{ marginTop: 8 }}>
        <LText
          numberOfLines={1}
          semiBold
          style={{ 
            fontSize: 12, 
            color: color, 
            textAlign: "center" 
          }}
        >
          {label}
        </LText>
      </View>
    </TabIconContainer>
  );
}