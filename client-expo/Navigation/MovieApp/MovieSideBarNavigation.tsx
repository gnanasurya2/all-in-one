import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../../Screens/Movies/HomeScreen';
import SearchScreen from '../../Screens/Movies/SearchScreen';
import { FONT_WEIGHT, SURFACE_COLORS } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawer from '../../components/CustomDrawer';
import WatchListScreen from '../../Screens/Movies/WatchListScreen';
import MovieScreen from '../../Screens/Movies/MovieScreen';
import ListsScreen from '../../Screens/Movies/ListsScreen';
import ListAddScreen from '../../Screens/Movies/ListAddScreen';
import ListsSelectScreen from '../../Screens/Movies/ListSelectScreen';
import ListViewScreen from '../../Screens/Movies/ListViewScreen';
import RandomMovieSeletorScreen from '../../Screens/Movies/RandomMovieSelectorScreen';

export type MovieNavigatorDrawerParamList = {
  Home: undefined;
  Search: undefined;
  Movie: { movieId: string; type: string };
  WatchList: undefined;
  ListsHome: undefined;
  EditList: { listId?: number };
  ViewList: { listId?: number };
  ListsSelect: { title: string; imdbId: string; poster: string };
  MovieSelector: undefined;
};

const Drawer = createDrawerNavigator<MovieNavigatorDrawerParamList>();

const MovieDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      backBehavior="history"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {
          fontSize: 16,
          color: 'white',
          fontWeight: FONT_WEIGHT.SEMI_BOLD,
        },
        drawerStyle: {
          backgroundColor: SURFACE_COLORS.MODAL,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons size={size} name="home" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons size={size} name="search" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="WatchList"
        component={WatchListScreen}
        options={{
          drawerLabel: 'Watchlist',
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons size={size} name="watch-later" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="ListsHome"
        component={ListsScreen}
        options={{
          drawerLabel: 'Lists',
          drawerIcon: ({ size }) => <MaterialIcons size={size} name="list-alt" color={'white'} />,
        }}
      />
      <Drawer.Screen
        name="ViewList"
        component={ListViewScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="EditList"
        component={ListAddScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="ListsSelect"
        component={ListsSelectScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="Movie"
        component={MovieScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="MovieSelector"
        component={RandomMovieSeletorScreen}
        options={{
          drawerLabel: 'Movie Selector',
          drawerIcon: ({ size }) => (
            <MaterialIcons size={size} name="movie-filter" color={'white'} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default MovieDrawerNavigator;
// <Stack.Screen name="ListsHome" component={ListsScreen} />
// <Stack.Screen name="ViewList" component={ListAddScreen} />
// <Stack.Screen name="ListsSelect" component={ListsSelectScreen} />
