import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../Screens/Movies/HomeScreen';
import SearchScreen from '../../Screens/Movies/SearchScreen';
import MovieScreen from '../../Screens/Movies/MovieScreen';

export type MovieNavigatorStackParamList = {
  Home: undefined;
  Search: undefined;
  Movie: { movieId: string; type: string };
};

const Stack = createNativeStackNavigator<MovieNavigatorStackParamList>();

const MovieAppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Movie" component={MovieScreen} />
    </Stack.Navigator>
  );
};

export default MovieAppNavigator;
