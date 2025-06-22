/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StyleProvider from './src/components/StyleProvider';
import PortfolioScreen from './src/screens/Portfolio';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StyleProvider selectedPalette="dark">
        <StatusBar barStyle="light-content" backgroundColor="#131214" />
        <SafeAreaView style={{flex: 1, backgroundColor: '#131214'}}>
          <PortfolioScreen />
        </SafeAreaView>
      </StyleProvider>
    </SafeAreaProvider>
  );
}

export default App;
