/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import MainNavigator from './Navigation/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default App;
