/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import MainNavigator from './Navigation/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import axios from 'axios';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {DefaultTheme} from '@react-navigation/native';
import {SURFACE_COLORS} from './constants/styles';

//TODO: make env variables work.
axios.defaults.baseURL = 'http://localhost:1540';

const queryClient = new QueryClient();

function App(): JSX.Element {
  //NOTE: This is to solve the screen flickering issue when the navigation changes
  const themeColors = {...DefaultTheme, colors: {...DefaultTheme.colors, background: SURFACE_COLORS.PAGE}};
  return (
    <NavigationContainer theme={themeColors}>
      <QueryClientProvider client={queryClient}>
        <MainNavigator />
      </QueryClientProvider>
    </NavigationContainer>
  );
}

export default App;
