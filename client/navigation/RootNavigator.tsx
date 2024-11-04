import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../Screens/Authentication/SignInScreen';
import SignUpScreen from '../Screens/Authentication/SignUpScreen';
import HomeScreen from '../Screens/HomeScreen';
import MovieNavigator from './MovieNavigator';
import { addTokenInterceptor, removeRequestInterceptor } from '../utils/interceptors';
import ExpenseTrackerNavigator from './ExpenseTrackerNavigator';
import SplashScreen from '../Screens/SplashScreen';
import { useSession } from '../context/AuthContext';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  MovieRoot: undefined;
  ExpenseTrackerRoot: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { session, isLoading } = useSession();
  useEffect(() => {
    if (session) {
      addTokenInterceptor(session);
    }
    return () => {
      removeRequestInterceptor();
    };
  }, [session]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      {session === null || session?.length === 0 ? (
        <Stack.Group>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MovieRoot" component={MovieNavigator} />
          <Stack.Screen name="ExpenseTrackerRoot" component={ExpenseTrackerNavigator} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
