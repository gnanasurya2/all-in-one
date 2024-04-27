import CustomDrawer from '@components/CustomDrawer';
import { FONT_WEIGHT, SURFACE_COLORS } from '@constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

export default function MovieLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
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
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons size={size} name="home" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="search"
        options={{
          drawerLabel: 'Search',
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons size={size} name="search" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="watch-list"
        options={{
          drawerLabel: 'Watchlist',
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons size={size} name="watch-later" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="movie"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="random"
        options={{
          drawerLabel: 'Movie Selector',
          drawerIcon: ({ size }) => (
            <MaterialIcons size={size} name="movie-filter" color={'white'} />
          ),
        }}
      />
      <Drawer.Screen
        name="lists"
        options={{
          drawerLabel: 'Lists',
          drawerIcon: ({ size }) => <MaterialIcons size={size} name="list" color={'white'} />,
        }}
      />
      <Drawer.Screen
        name="createLists"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
      <Drawer.Screen
        name="viewLists"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer>
  );
}
