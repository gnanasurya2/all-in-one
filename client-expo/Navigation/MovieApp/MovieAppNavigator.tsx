import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../../Screens/Movies/SearchScreen';
import MovieScreen from '../../Screens/Movies/MovieScreen';
import DrawerNavigator, { MovieNavigatorDrawerParamList } from './MovieSideBarNavigation';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type MovieNavigatorStackParamList = {
  MoviesHome: DrawerScreenProps<MovieNavigatorDrawerParamList>;
  Search: undefined;
  Movie: { movieId: string; type: string };
};

const Stack = createNativeStackNavigator<MovieNavigatorStackParamList>();

const MovieAppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MoviesHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MoviesHome" component={DrawerNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Movie" component={MovieScreen} />
    </Stack.Navigator>
  );
};

export default MovieAppNavigator;
