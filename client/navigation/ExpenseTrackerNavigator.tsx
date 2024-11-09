import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Screens/ExpenseTracker/HomeScreen';
import CreateExpenseScreen from '../Screens/ExpenseTracker/CreateExpenseScreen';

export type ExpenseTrackerParamList = {
  Home: undefined;
  Create: {
    data?: {
      id: number;
      isIncome: boolean;
      title: string;
      date: number;
      amount: number;
      category: string;
    };
  };
};

const Stack = createNativeStackNavigator<ExpenseTrackerParamList>();

function ExpenseTrackerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Create" component={CreateExpenseScreen} />
    </Stack.Navigator>
  );
}

export default ExpenseTrackerNavigator;
