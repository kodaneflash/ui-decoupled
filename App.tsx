/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import StyleProvider from './src/components/StyleProvider';
import MainNavigator from './src/navigation/MainNavigator';
import { PriceProvider } from './src/context/PriceContext';
import { DiscreetModeProvider } from './src/context/DiscreetModeContext';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StyleProvider selectedPalette="dark">
          <DiscreetModeProvider>
            <PriceProvider refreshInterval={60000}>
              <StatusBar barStyle="light-content" backgroundColor="#131214" />
              <NavigationContainer>
                {/* Official React Navigation structure like Ledger Live Mobile */}
                <MainNavigator />
              </NavigationContainer>
            </PriceProvider>
          </DiscreetModeProvider>
        </StyleProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;