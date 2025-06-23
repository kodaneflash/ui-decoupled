/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import StyleProvider from './src/components/StyleProvider';
import MainNavigator from './src/navigation/MainNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StyleProvider selectedPalette="dark">
        <StatusBar barStyle="light-content" backgroundColor="#131214" />
        <NavigationContainer>
          {/* Official React Navigation structure like Ledger Live Mobile */}
          <MainNavigator />
        </NavigationContainer>
      </StyleProvider>
    </SafeAreaProvider>
  );
}

export default App;