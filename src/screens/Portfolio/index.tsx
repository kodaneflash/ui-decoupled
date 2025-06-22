import React from 'react';
import { Animated } from 'react-native';
import { Flex, Text, Box } from '@ledgerhq/native-ui';
import styled from 'styled-components/native';
import CreditCard from '@ledgerhq/icons-ui/native/CreditCard';
import Settings from '@ledgerhq/icons-ui/native/Settings';
import Wallet from '@ledgerhq/icons-ui/native/Wallet';
import BellNotification from '@ledgerhq/icons-ui/native/BellNotification';
import GraphCard from '../../components/GraphCard';
import WalletTabBackgroundGradient from '../../components/WalletTabBackgroundGradient';
import PortfolioAssetsContainer from '../../components/PortfolioAssetsContainer';

// Tab button component with proper React Native CSS
const TabButton = styled(Flex).attrs<{ isActive?: boolean }>(({ isActive }) => ({
  paddingX: 4,
  paddingY: 2,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  mr: 3,
  backgroundColor: isActive ? '#7C3AED' : '#2A2A2A',
}))<{ isActive?: boolean }>``;

const PortfolioScreen = () => {
  // Scroll tracking for gradient animation (Real Ledger Live behavior)
  const scrollY = new Animated.Value(0);
  const headerHeight = 200;

  return (
    <Flex flex={1} backgroundColor="background.main">
      {/* Background Gradient with scroll-responsive animation */}
      <WalletTabBackgroundGradient scrollY={scrollY} headerHeight={headerHeight} />
      
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
            <CreditCard size="M" color="neutral.c100" />
          </Flex>
          <Flex mr={6}>
            <Wallet size="M" color="neutral.c100" />
          </Flex>
          <Flex mr={6}>
            <BellNotification size="M" color="neutral.c100" />
          </Flex>
          <Settings size="M" color="neutral.c100" />
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

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Graph Card with Balance */}
        <GraphCard areAccountsEmpty={false} />

        {/* Portfolio Assets Container with Assets/Accounts Toggle */}
        <PortfolioAssetsContainer initialTab="Assets" />
      </Animated.ScrollView>

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