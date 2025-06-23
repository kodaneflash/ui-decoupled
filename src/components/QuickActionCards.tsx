import React from "react";
import { Flex, Text, IconsLegacy, Box } from "@ledgerhq/native-ui";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import styled from "styled-components/native";

// Quick Action data matching Ledger Live specifications
const QUICK_ACTIONS_DATA = [
  {
    id: 'buy',
    icon: IconsLegacy.PlusMedium,
    label: 'Buy',
    disabled: false,
  },
  {
    id: 'swap', 
    icon: IconsLegacy.BuyCryptoMedium,
    label: 'Swap',
    disabled: false,
  },
  {
    id: 'send',
    icon: IconsLegacy.ArrowTopMedium, 
    label: 'Send',
    disabled: false,
  },
  {
    id: 'receive',
    icon: IconsLegacy.ArrowBottomMedium,
    label: 'Receive', 
    disabled: false,
  },
  {
    id: 'earn',
    icon: IconsLegacy.CoinsMedium,
    label: 'Earn',
    disabled: false,
  },
];

// Styled button matching QuickActionButton from Ledger Live exactly
const StyledQuickActionButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  height: 59px;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii[2]}px;
  padding: ${({ theme }) => `${theme.space[3]}px ${theme.space[2]}px`};
  background-color: ${({ disabled, theme }) => 
    disabled ? 'transparent' : theme.colors.neutral.c20};
  ${({ disabled, theme }) => 
    disabled ? `border: 1px solid ${theme.colors.neutral.c30};` : ''}
`;

const StyledText = styled(Text)`
  overflow: hidden;
  max-width: 100%;
`;

interface QuickActionCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  disabled: boolean;
  onPress?: () => void;
}

function QuickActionCard({ icon: IconComponent, label, disabled, onPress }: QuickActionCardProps) {
  return (
    <View style={{ flex: 1, marginHorizontal: 6 }}>
      <StyledQuickActionButton 
        onPress={onPress}
        disabled={disabled}
      >
        <IconComponent 
          size={20} 
          color={disabled ? "neutral.c50" : "neutral.c100"} 
        />
        <Flex mt={2}>
          <StyledText 
            numberOfLines={1}
            fontSize={12}
            color={disabled ? "neutral.c50" : "neutral.c100"} 
            fontWeight="semiBold"
          >
            {label}
          </StyledText>
        </Flex>
      </StyledQuickActionButton>
    </View>
  );
}

function QuickActionCards() {
  return (
    <Flex 
      flexDirection="row" 
      justifyContent="center"
      alignItems="center"
      px={5}
      style={{ position: 'relative', top: 10 }}
    >
        {QUICK_ACTIONS_DATA.map((action) => (
          <QuickActionCard
            key={action.id}
            icon={action.icon}
            label={action.label}
            disabled={action.disabled}
            onPress={() => {
              // Static implementation - no functionality required
              console.log(`Pressed ${action.label}`);
            }}
          />
        ))}
    </Flex>
  );
}

export default React.memo(QuickActionCards); 