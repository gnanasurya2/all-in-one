/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { SURFACE_COLORS } from './constants/styles';
import { StyleSheet } from 'react-native';
import { SessionProvider, useSession } from './context/AuthContext';
import 'react-native-gesture-handler';
// process.env.EXPO_PUBLIC_API_URL
axios.defaults.baseURL = __DEV__ ? 'http://localhost:1540' : 'https://allinone.gnanasurya.com';
if (__DEV__) {
  require('./ReactotronConfig');
}
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const { signOut } = useSession();

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { status } = error.response || {};
        if (status === 401) {
          signOut?.();
        }
        return Promise.reject(error);
      }
    );
  }, [signOut]);

  return (
    <GestureHandlerRootView style={styles.screen}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: SURFACE_COLORS.PAGE, flex: 1 },
});
export default App;
