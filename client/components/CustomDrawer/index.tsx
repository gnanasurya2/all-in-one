import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useSession } from '../../context/AuthContext';

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { signOut } = useSession();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        labelStyle={{
          fontSize: 16,
          color: 'white',
        }}
        label={'Logout'}
        icon={({ size }) => <Icon name="logout" size={size} color="white" />}
        onPress={() => {
          signOut?.();
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
