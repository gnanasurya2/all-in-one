import React from 'react';
import MovieAppNavigator, { MovieNavigatorStackParamList } from './MovieApp/MovieAppNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import { NavigatorScreenParams } from '@react-navigation/native';
import ExpenseTrackerNavigator, {
  ExpenseTrackerNavigatorParamList,
} from './ExpenseTracker/ExpenseTrackerNavigator';

export type RootNavigatorParamList = {
  Home: undefined;
  Movies: NavigatorScreenParams<MovieNavigatorStackParamList>;
  ExpenseTracker: NavigatorScreenParams<ExpenseTrackerNavigatorParamList>;
};

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Movies" component={MovieAppNavigator} />
      <Stack.Screen name="ExpenseTracker" component={ExpenseTrackerNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
