/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import MainNavigator from './Navigation/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import axios from 'axios';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {DefaultTheme} from '@react-navigation/native';
import {FONT_FAMILY, SURFACE_COLORS} from './constants/styles';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

//TODO: make env variables work.
axios.defaults.baseURL = 'http://localhost:1540';

const queryClient = new QueryClient();

function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
    [FONT_FAMILY.HELVETICA_ROUNDED]: require('./assets/fonts/HelveticaRoundedLTStd-Bd.otf'),
    [FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR]: require('./assets/fonts/GTWalsheimProRegular.ttf'),
    [FONT_FAMILY.GT_WALSHEIM_PRO_BOLD]: require('./assets/fonts/GTWalsheimProBold.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <></>;
  }

  //NOTE: This is to solve the screen flickering issue when the navigation changes
  const themeColors = {...DefaultTheme, colors: {...DefaultTheme.colors, background: SURFACE_COLORS.PAGE}};

  return (
    <View style={{flex: 1, backgroundColor: SURFACE_COLORS.PAGE}} onLayout={onLayoutRootView}>
      <SafeAreaView style={{flex: 1}}>
        <GestureHandlerRootView style={styles.wrapper}>
          <NavigationContainer theme={themeColors}>
            <QueryClientProvider client={queryClient}>
              <MainNavigator />
            </QueryClientProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default App;
