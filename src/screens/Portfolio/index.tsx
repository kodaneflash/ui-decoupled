import React, { useState } from 'react';
import { Animated, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { Flex, Text, Box } from '@ledgerhq/native-ui';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import GraphCard from '../../components/GraphCard';
import WalletTabBackgroundGradient from '../../components/WalletTabBackgroundGradient';
import PortfolioAssetsContainer from '../../components/PortfolioAssetsContainer';
import PortfolioHeader from './Header';
import { useTheme } from 'styled-components/native';
import { withDiscreetMode } from '../../context/DiscreetModeContext';

// Custom Tab Button Component - Exact Ledger Live Replica
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton = ({ label, isActive, onPress }: TabButtonProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        height: 32,
        justifyContent: 'center',
        marginRight: 16, // theme.space[4] = 16px
      }}
    >
      {/* Inactive background - semi-transparent white */}
      <Box
        position="absolute"
        top={0}
        height="100%"
        width="100%"
        backgroundColor={isActive ? "transparent" : "rgba(255, 255, 255, 0.08)"}
        borderRadius={2}
      />
      
      {/* Active background - primary purple */}
      <Box
        position="absolute"
        top={0}
        height="100%"
        width="100%"
        backgroundColor={isActive ? "primary.c70" : "transparent"}
        borderRadius={2}
      />
      
      {/* Text content */}
      <Box borderRadius={2} px={4}>
        <Text 
          fontWeight="semiBold" 
          variant="body" 
          color="neutral.c100"
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

// Portfolio Content Component
const PortfolioContent = ({ scrollY }: { scrollY: Animated.Value }) => {
  const headerHeight = 48; // Fixed header height matching ledger-live-mobile
  
  return (
    <Animated.ScrollView 
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      contentContainerStyle={{
        paddingTop: headerHeight + 40, // Space for fixed header + tabs
        minHeight: Dimensions.get("window").height + (StatusBar.currentHeight || 0),
      }}
    >
      <GraphCard areAccountsEmpty={false} />
      <PortfolioAssetsContainer initialTab="Assets" />
    </Animated.ScrollView>
  );
};

// Market Content Component (placeholder)
const MarketContent = ({ scrollY }: { scrollY: Animated.Value }) => {
  const headerHeight = 48; // Fixed header height matching ledger-live-mobile
  
  return (
    <Animated.ScrollView 
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      contentContainerStyle={{
        paddingTop: headerHeight + 40,
        minHeight: Dimensions.get("window").height,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text color="neutral.c100" variant="h4">Market Content</Text>
      <Box mt={4}>
        <Text color="neutral.c70">Coming Soon</Text>
      </Box>
    </Animated.ScrollView>
  );
};

const PortfolioScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = new Animated.Value(0);
  const headerHeight = 48; // Fixed header height matching ledger-live-mobile (NOT animated)
  const [activeTab, setActiveTab] = useState<'Crypto' | 'Market'>('Crypto');

  // Tab positioning constants - adjust these for fine-tuning
  const TAB_VERTICAL_OFFSET = 4; // Positive moves down, negative moves up

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <Box flex={1} backgroundColor="background.main">
        {/* Background Gradient */}
        <WalletTabBackgroundGradient scrollY={scrollY} headerHeight={headerHeight} />
        
        {/* Main Content Area */}
        <Box flex={1}>
          {/* Fixed Header - Matches ledger-live-mobile behavior exactly */}
          <Box
            position="absolute"
            top={insets.top}
            left={0}
            right={0}
            height={headerHeight}
            zIndex={20}
            px={6}
            justifyContent="flex-end"
          >
            <PortfolioHeader hidePortfolio={false} />
          </Box>

          {/* Fixed Tab Bar - Positioned Below Header */}
          <Flex
            position="absolute"
            top={insets.top + headerHeight}
            left={0}
            right={0}
            height={40}
            flexDirection="row"
            px={6}
            zIndex={10}
            backgroundColor="transparent"
            style={{ transform: [{ translateY: TAB_VERTICAL_OFFSET }] }}
          >
            <TabButton 
              label="Crypto" 
              isActive={activeTab === 'Crypto'} 
              onPress={() => setActiveTab('Crypto')} 
            />
            <TabButton 
              label="Market" 
              isActive={activeTab === 'Market'} 
              onPress={() => setActiveTab('Market')} 
            />
          </Flex>

          {/* Tab Content */}
          {activeTab === 'Crypto' ? (
            <PortfolioContent scrollY={scrollY} />
          ) : (
            <MarketContent scrollY={scrollY} />
          )}
        </Box>

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
      </Box>
    </SafeAreaView>
  );
};

export default withDiscreetMode(PortfolioScreen); 