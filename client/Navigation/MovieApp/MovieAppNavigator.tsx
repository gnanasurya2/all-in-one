import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../Screens/HomeScreen';
import SearchScreen from '../../Screens/SearchScreen';
import MovieScreen from '../../Screens/MovieScreen';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Movie: {movieId: string; type: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MovieAppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Movie" component={MovieScreen} />
    </Stack.Navigator>
  );
};

export default MovieAppNavigator;
