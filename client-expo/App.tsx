/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import MainNavigator from './Navigation/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme } from '@react-navigation/native';
import { FONT_FAMILY, SURFACE_COLORS } from './constants/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthentication } from './hooks/useAuthentication';
import { AuthContext } from './context/AuthContext';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import addTokenInterceptor from './utils/interceptors';

//TODO: make env variables work.
axios.defaults.baseURL = 'http://localhost:1540';

const queryClient = new QueryClient();

function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
    [FONT_FAMILY.HELVETICA_ROUNDED]: require('./assets/fonts/HelveticaRoundedLTStd-Bd.otf'),
    [FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR]: require('./assets/fonts/GTWalsheimProRegular.ttf'),
    [FONT_FAMILY.GT_WALSHEIM_PRO_BOLD]: require('./assets/fonts/GTWalsheimProBold.ttf'),
  });

  const [state, dispatch] = useAuthentication();
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (state.token) {
      addTokenInterceptor(state.token);
    }
    return () => {
      axios.interceptors.request.clear();
    };
  }, [state.token]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = await getItemAsync('userToken');
      if (token) {
        dispatch({ type: 'RESTORE_TOKEN', token });
        return;
      }
      const userDetails = await getItemAsync('userDetails');
      if (userDetails) {
        await authContext.signIn(JSON.parse(userDetails));
      }
    };
    bootstrapAsync();

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { status } = error.response || {};
        if (status === 401) {
          await deleteItemAsync('userToken');
          dispatch({ type: 'SIGN_OUT' });
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const authContext = useMemo(
    () => ({
      createAccount: async ({ username, password }: { username: string; password: string }) => {
        const response = await axios.post<{
          username: string;
          id: number;
          token: string;
        }>('/user/create', {
          username,
          password,
        });
        await setItemAsync('userDetails', JSON.stringify({ username, password }));
        await setItemAsync('userToken', response.data.token);

        dispatch({ type: 'SIGN_IN', token: response.data.token });
      },
      signIn: async ({ username, password }: { username: string; password: string }) => {
        const response = await axios.post<{
          username: string;
          id: number;
          token: string;
        }>('/user/login', {
          username,
          password,
        });

        await setItemAsync('userDetails', JSON.stringify({ username, password }));
        await setItemAsync('userToken', response.data.token);

        dispatch({ type: 'SIGN_IN', token: response.data.token });
      },
      signOut: async () => {
        await deleteItemAsync('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  //NOTE: This is to solve the screen flickering issue when the navigation changes
  const themeColors = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: SURFACE_COLORS.PAGE },
  };

  if (!fontsLoaded) {
    return <></>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: SURFACE_COLORS.PAGE }} onLayout={onLayoutRootView}>
      <AuthContext.Provider value={{ state, authContext }}>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={styles.wrapper}>
            <NavigationContainer theme={themeColors}>
              <QueryClientProvider client={queryClient}>
                <MainNavigator />
              </QueryClientProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaView>
      </AuthContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default App;
