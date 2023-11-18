import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../Screens/Movies/HomeScreen';
import SearchScreen from '../../Screens/Movies/SearchScreen';
import MovieScreen from '../../Screens/Movies/MovieScreen';
import DrawerNavigator, { MovieNavigatorDrawerParamList } from './MovieSideBarNavigation';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type MovieNavigatorStackParamList = {
  Home: DrawerScreenProps<MovieNavigatorDrawerParamList>;
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
      <Stack.Screen name="Home" component={DrawerNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Movie" component={MovieScreen} />
    </Stack.Navigator>
  );
};

export default MovieAppNavigator;
