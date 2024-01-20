import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import { NavigatorScreenParams } from '@react-navigation/native';
import ExpenseTrackerNavigator, {
  ExpenseTrackerNavigatorParamList,
} from './ExpenseTracker/ExpenseTrackerNavigator';
import MovieDrawerNavigator, {
  MovieNavigatorDrawerParamList,
} from './MovieApp/MovieSideBarNavigation';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type RootNavigatorParamList = {
  Home: undefined;
  Movies: DrawerScreenProps<MovieNavigatorDrawerParamList>;
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
      <Stack.Screen name="Movies" component={MovieDrawerNavigator} />
      <Stack.Screen name="ExpenseTracker" component={ExpenseTrackerNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
