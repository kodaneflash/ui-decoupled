import React from "react";
import { Flex, Text, IconsLegacy } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import Notifications from "../../icons/Notifications";
import DiscreetModeButton from "../../components/DiscreetModeButton";

interface PortfolioHeaderProps {
  hidePortfolio?: boolean;
}

function PortfolioHeader({ hidePortfolio = false }: PortfolioHeaderProps) {
  const { colors } = useTheme();

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={3}>
      <Flex flexDirection="row" alignItems="center" mr={3} flexShrink={1} flexGrow={1}>
        <Text
          variant="h4"
          fontWeight="semiBold"
          color="neutral.c100"
          flexGrow={0}
          flexShrink={1}
          textAlign="center"
          mr={3}
          numberOfLines={2}
        >
          Wallet
        </Text>
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
        <IconsLegacy.SettingsMedium size={24} color="neutral.c100" />
      </Flex>
    </Flex>
  );
}

export default PortfolioHeader; 