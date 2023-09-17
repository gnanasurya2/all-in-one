import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../Screens/HomeScreen';
import SearchScreen from '../../Screens/SearchScreen';

const Stack = createNativeStackNavigator();

const MovieAppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

export default MovieAppNavigator;
