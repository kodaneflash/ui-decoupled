import React from 'react';
import { Animated } from 'react-native';
import { Flex, Text, Box, IconsLegacy } from '@ledgerhq/native-ui';
import styled from 'styled-components/native';
import Notifications from '../../icons/Notifications';
import GraphCard from '../../components/GraphCard';
import WalletTabBackgroundGradient from '../../components/WalletTabBackgroundGradient';
import PortfolioAssetsContainer from '../../components/PortfolioAssetsContainer';
import { useTheme } from 'styled-components/native';

// Official Ledger Live Tab Button - Exact replica
const StyledTouchableOpacity = styled.TouchableOpacity`
  height: 32px;
  justify-content: center;
  margin-right: ${p => p.theme.space[4]}px;
`;

interface TabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const Tab = ({ label, isActive, onPress }: TabProps) => {
  return (
    <StyledTouchableOpacity onPress={onPress}>
      <Box 
        borderRadius={2} 
        px={4}
        backgroundColor={isActive ? '#897DD7' : '#504A62'}
        position="absolute"
        top={0}
        height="100%"
        width="100%"
      />
      <Box borderRadius={2} px={4}>
        <Text 
          fontWeight="semiBold" 
          variant="body" 
          fontSize="14px"
          color="neutral.c100"
        >
          {label}
        </Text>
      </Box>
    </StyledTouchableOpacity>
  );
};

const PortfolioScreen = () => {
  // Scroll tracking for gradient animation (Real Ledger Live behavior)
  const scrollY = new Animated.Value(0);
  const headerHeight = 200;
  const { colors } = useTheme();

  return (
    <Flex flex={1} backgroundColor="background.main">
      {/* Background Gradient with scroll-responsive animation */}
      <WalletTabBackgroundGradient scrollY={scrollY} headerHeight={headerHeight} />
      
      {/* Header - Exact replica of Ledger Live Mobile Portfolio Header */}
      <Flex 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="space-between" 
        py={3}
        px={6}
      >
        {/* Left Section: Title */}
        <Flex flexDirection="row" alignItems="center" mr={3} flex={1}>
          <Text
            variant="h4"
            fontWeight="semiBold"
            color="neutral.c100"
            numberOfLines={2}
          >
            Wallet
          </Text>
        </Flex>
        
        {/* Right Section: Four Action Icons */}
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

      {/* Tabs - Exact replica of Ledger Live Mobile WalletTabNavigatorTabBar */}
      <Flex px={6} py={2} justifyContent="flex-end">
        <Flex flexDirection="row">
          <Tab label="Crypto" isActive={true} onPress={() => {}} />
          <Tab label="Market" isActive={false} onPress={() => {}} />
        </Flex>
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