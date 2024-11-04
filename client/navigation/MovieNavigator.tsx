import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../Screens/Movies/HomeScreen';
import SearchScreen from '../Screens/Movies/SearchScreen';
import MovieScreen from '../Screens/Movies/MovieScreen';
import SeriesUpdateScreen from '../Screens/Movies/SeriesUpdateScreen';
import ListsScreen from '../Screens/Movies/ListsScreen';
import CreateListScreen from '../Screens/Movies/CreateListScreen';
import WatchListScreen from '../Screens/Movies/WatchListScreen';
import RandomMovieSeletorScreen from '../Screens/Movies/RandomMovieSelectorScreen';
import ViewListsScreen from '../Screens/Movies/ViewListsScreen';
import CustomDrawer from '../components/CustomDrawer';
import { FONT_WEIGHT, SURFACE_COLORS } from '../constants/styles';

export type MovieDrawerParamList = {
  Home: undefined;
  Search: undefined;
  Movie: {
    id: string;
    type: string;
  };
  SeriesUpdate: {
    data: string;
    imdbId: string;
    title: string;
    poster: string;
  };
  Lists: undefined;
  CreateList: {
    listId?: number;
    title?: string;
    description?: string;
  };
  WatchList: undefined;
  RandomMovie: undefined;
  ViewList: {
    isSelect?: 'true' | 'false';
    imdbId: string;
    title: string;
    poster: string;
  };
};

const Drawer = createDrawerNavigator<MovieDrawerParamList>();

function MovieNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      defaultStatus="closed"
      backBehavior="history"
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
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ size }) => <MaterialIcons size={size} name="home" color={'white'} />,
        }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={{
          drawerLabel: 'Search',
          drawerIcon: ({ size }) => <MaterialIcons size={size} name="search" color={'white'} />,
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
        name="SeriesUpdate"
        component={SeriesUpdateScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="Lists"
        component={ListsScreen}
        options={{
          drawerLabel: 'Lists',
          drawerIcon: ({ size }) => <MaterialIcons size={size} name="list" color={'white'} />,
        }}
      />
      <Drawer.Screen
        name="CreateList"
        component={CreateListScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="WatchList"
        component={WatchListScreen}
        options={{
          drawerLabel: 'Watchlist',
          drawerIcon: ({ size }) => (
            <MaterialIcons size={size} name="watch-later" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="RandomMovie"
        component={RandomMovieSeletorScreen}
        options={{
          drawerLabel: 'Movie Selector',
          drawerIcon: ({ size }) => (
            <MaterialIcons size={size} name="movie-filter" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="ViewList"
        component={ViewListsScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default MovieNavigator;
