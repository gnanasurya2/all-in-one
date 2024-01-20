import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Text from '../Text';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { state: authState, authContext } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileWrapper}>
        <Image source={require('../../assets/profile.jpeg')} style={styles.profileImage} />
        <Text style={{ fontSize: 16, color: 'white' }}>{authState.username}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        labelStyle={{
          fontSize: 16,
          color: 'white',
        }}
        label={'Logout'}
        icon={({ size }) => <MaterialIcons name="logout" size={size} color="white" />}
        onPress={() => {
          authContext.signOut();
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
    marginLeft: 16,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
});
