import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../../Screens/Movies/HomeScreen';
import SearchScreen from '../../Screens/Movies/SearchScreen';
import { FONT_WEIGHT, SURFACE_COLORS } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawer from '../../components/CustomDrawer';
import WatchListScreen from '../../Screens/Movies/WatchListScreen';

export type MovieNavigatorDrawerParamList = {
  Home: undefined;
  Search: undefined;
  Movie: { movieId: string; type: string };
  WatchList: undefined;
};

const Drawer = createDrawerNavigator<MovieNavigatorDrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
