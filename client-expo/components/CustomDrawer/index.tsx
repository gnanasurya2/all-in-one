import { MaterialIcons } from '@expo/vector-icons';
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
        icon={({ size }) => <MaterialIcons name="logout" size={size} color="white" />}
        onPress={() => {
          signOut?.();
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
