import React, { useCallback } from "react";
import { Flex, Text, IconsLegacy } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import Notifications from "../../icons/Notifications";
import DiscreetModeButton from "../../components/DiscreetModeButton";
import Touchable from "../../components/Touchable";

interface PortfolioHeaderProps {
  hidePortfolio?: boolean;
}

function PortfolioHeader({ hidePortfolio = false }: PortfolioHeaderProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const onSettingsButtonPress = useCallback(() => {
    // Navigate to Settings stack navigator - exact Ledger Live Mobile pattern
    (navigation as any).navigate("Settings");
  }, [navigation]);

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={3}>
      <Flex flexDirection="row" alignItems="center" mr={3} flexShrink={1} flexGrow={1}>
        <Flex mr={3}>
          <Text
            variant="h4"
            fontWeight="semiBold"
            color="neutral.c100"
            numberOfLines={2}
          >
            Wallet
          </Text>
        </Flex>
        {!hidePortfolio && <DiscreetModeButton size={20} />}
      </Flex>
      <Flex flexDirection="row">
        <Flex mr={7}>
          <IconsLegacy.CardMedium size={24} color="neutral.c100" />
        </Flex>

        <Flex mr={7}>
          <IconsLegacy.WalletConnectMedium size={24} color="neutral.c100" />
        </Flex>

        <Flex mr={7}>
          <Notifications
            size={24}
            color={colors.neutral.c100}
            dotColor={colors.error.c40}
            isOn={false}
          />
        </Flex>
        <Touchable onPress={onSettingsButtonPress} testID="settings-icon">
          <IconsLegacy.SettingsMedium size={24} color="neutral.c100" />
        </Touchable>
      </Flex>
    </Flex>
  );
}

export default PortfolioHeader; 