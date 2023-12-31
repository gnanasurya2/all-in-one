import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../../Screens/ExpenseTracker/HomeScreen';

export type ExpenseTrackerNavigatorParamList = {
  ExpenseHome: undefined;
};

const Stack = createNativeStackNavigator<ExpenseTrackerNavigatorParamList>();

const ExpenseTrackerNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ExpenseHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExpenseHome" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default ExpenseTrackerNavigator;
