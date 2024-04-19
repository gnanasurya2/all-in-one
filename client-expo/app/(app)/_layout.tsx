import axios from 'axios';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import Text from '../../components/Text';
import { useSession } from '../../context/AuthContext';
import { hello } from '../../modules/read-sms';
import addTokenInterceptor from '../../utils/interceptors';

export default function AppLayout() {
  const { isLoading, session, signOut } = useSession();

  useEffect(() => {
    console.log('calling native module function', hello(), process.env.EXPO_PUBLIC_API_URL);

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { status } = error.response || {};
        if (status === 401) {
          await signOut?.();
        }
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    if (session) {
      addTokenInterceptor(session);
    }
  }, [session]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </>
  );
}
