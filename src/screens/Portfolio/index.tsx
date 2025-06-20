import React from 'react';
import { ScrollView } from 'react-native';
import { Flex, Text, Box } from '@ledgerhq/native-ui';
import styled from 'styled-components/native';
import { 
  CardMedium, 
  SettingsMedium, 
  WalletConnectMedium,
  NotificationsMedium
} from '@ledgerhq/native-ui/assets/icons';
import AccountRowLayout from '../../components/AccountRowLayout';
import GraphCard from '../../components/GraphCard';

// Tab button component
const TabButton = styled(Flex).attrs({
  paddingX: 4,
  paddingY: 2,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  mr: 3,
})<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? '#7C3AED' : '#2A2A2A'};
`;

const PortfolioScreen = () => {
  return (
    <Flex flex={1} backgroundColor="background.main">
      {/* Header */}
      <Flex 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="space-between" 
        px={6} 
        py={3}
        mt={2}
      >
        <Text variant="h4" fontWeight="semiBold" color="neutral.c100">
          Wallet
        </Text>
        <Flex flexDirection="row" alignItems="center">
          <Flex mr={6}>
            <CardMedium size={24} color="neutral.c100" />
          </Flex>
          <Flex mr={6}>
            <WalletConnectMedium size={24} color="neutral.c100" />
          </Flex>
          <Flex mr={6}>
            <NotificationsMedium size={24} color="neutral.c100" />
          </Flex>
          <SettingsMedium size={24} color="neutral.c100" />
        </Flex>
      </Flex>

      {/* Tabs */}
      <Flex flexDirection="row" px={6} py={4}>
        <TabButton isActive>
          <Text color="white" fontWeight="semiBold">Crypto</Text>
        </TabButton>
        <TabButton>
          <Text color="neutral.c70" fontWeight="semiBold">NFTs</Text>
        </TabButton>
        <TabButton>
          <Text color="neutral.c70" fontWeight="semiBold">Market</Text>
        </TabButton>
      </Flex>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Graph Card with Balance */}
        <GraphCard balance="$0.00" />

        {/* Assets List */}
        <Box>
          <AccountRowLayout 
            name="Bitcoin" 
            ticker="BTC"
            balance="0 BTC"
            iconBg="#F7931A" 
            iconLetter="₿" 
            onPress={() => {}}
          />
          <AccountRowLayout 
            name="Ethereum" 
            ticker="ETH"
            balance="0 ETH"
            iconBg="#627EEA" 
            iconLetter="♦" 
            onPress={() => {}}
          />
          <AccountRowLayout 
            name="Tether USD" 
            ticker="USDT"
            balance="0 USDT"
            iconBg="#26A17B" 
            iconLetter="₮" 
            onPress={() => {}}
          />
          <AccountRowLayout 
            name="XRP" 
            ticker="XRP"
            balance="0 XRP"
            iconBg="#0085C3" 
            iconLetter="✕" 
            onPress={() => {}}
          />
          <AccountRowLayout 
            name="Binance Smart Chain" 
            ticker="BNB"
            balance="0 BNB"
            iconBg="#F3BA2F" 
            iconLetter="◆" 
            onPress={() => {}}
          />
        </Box>
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <Flex 
        flexDirection="row" 
        justifyContent="space-around" 
        alignItems="center" 
        py={4}
        borderTopWidth={1}
        borderTopColor="neutral.c30"
      >
        <Flex alignItems="center">
          <Flex mb={1}>
            <Text fontSize="20px">💼</Text>
          </Flex>
          <Text variant="small" color="primary.c80">Wallet</Text>
        </Flex>
        <Flex alignItems="center">
          <Flex mb={1}>
            <Text fontSize="20px">📊</Text>
          </Flex>
          <Text variant="small" color="neutral.c70">Earn</Text>
        </Flex>
        <Flex 
          width={56} 
          height={56} 
          borderRadius={28} 
          backgroundColor="primary.c80" 
          alignItems="center" 
          justifyContent="center"
        >
          <Text fontSize="24px">↔️</Text>
        </Flex>
        <Flex alignItems="center">
          <Flex mb={1}>
            <Text fontSize="20px">🌐</Text>
          </Flex>
          <Text variant="small" color="neutral.c70">Discover</Text>
        </Flex>
        <Flex alignItems="center">
          <Flex mb={1}>
            <Text fontSize="20px">🔧</Text>
          </Flex>
          <Text variant="small" color="neutral.c70">My Ledger</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PortfolioScreen; 