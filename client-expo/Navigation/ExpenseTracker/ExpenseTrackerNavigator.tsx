import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../../Screens/ExpenseTracker/HomeScreen';

export type ExpenseTrackerNavigatorParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<ExpenseTrackerNavigatorParamList>();

const ExpenseTrackerNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default ExpenseTrackerNavigator;
