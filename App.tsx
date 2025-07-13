/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StyleProvider from './src/components/StyleProvider';
import { DiscreetModeProvider } from './src/context/DiscreetModeContext';
import { PortfolioDataProvider, usePortfolioData } from './src/context/PortfolioDataContext';
import { PriceProvider } from './src/context/PriceContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';
import MainNavigator from './src/navigation/MainNavigator';
import AuthPass from './src/context/AuthPass';

// Auth wrapper that connects PortfolioDataContext privacy to AuthPass
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { privacy, setPrivacy } = usePortfolioData();
  
  return (
    <AuthPass
      privacy={privacy}
      setPrivacy={setPrivacy}
      isPasswordLockBlocked={false}
      closeAllDrawers={() => {}}
    >
      {children}
    </AuthPass>
  );
};

// Main App Component
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <StyleProvider selectedPalette="dark">
            <DiscreetModeProvider>
              <PortfolioDataProvider>
                <PriceProvider>
                  <AuthWrapper>
                    <NavigationContainer>
                      <MainNavigator />
                    </NavigationContainer>
                  </AuthWrapper>
                </PriceProvider>
              </PortfolioDataProvider>
            </DiscreetModeProvider>
          </StyleProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
};

export default App;