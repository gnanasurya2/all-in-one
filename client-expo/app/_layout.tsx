import { Slot, SplashScreen } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SessionProvider } from '../context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { FONT_FAMILY, SURFACE_COLORS } from '../constants/styles';
import { useCallback } from 'react';
import { requestSMSPermission, readLastSMS } from '../modules/read-sms';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const queryClient = new QueryClient();

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function Root() {
  const [fontsLoaded] = useFonts({
    [FONT_FAMILY.HELVETICA_ROUNDED]: require('../assets/fonts/HelveticaRoundedLTStd-Bd.otf'),
    [FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR]: require('../assets/fonts/GTWalsheimProRegular.ttf'),
    [FONT_FAMILY.GT_WALSHEIM_PRO_BOLD]: require('../assets/fonts/GTWalsheimProBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      requestSMSPermission();
      console.log('last Message', readLastSMS());
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: SURFACE_COLORS.PAGE }} onLayout={onLayoutRootView}>
      <GestureHandlerRootView style={styles.wrapper}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Slot />
          </QueryClientProvider>
        </SessionProvider>
      </GestureHandlerRootView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 40,
    flex: 1,
  },
});
