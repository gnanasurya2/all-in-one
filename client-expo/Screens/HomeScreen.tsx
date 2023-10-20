import React, { useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '../constants/styles';
import Text from '../components/Text';
import { RootStackParamList } from '../Navigation/MovieApp/MovieAppNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomButton from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const { authContext } = useContext(AuthContext);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            navigation.navigate('Search');
          }}
        >
          <FontAwesome5 name="search" size={18} color="white" />
        </Pressable>
      </View>
      <CustomButton
        title="Logout"
        onPress={() => {
          authContext.signOut();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: SURFACE_COLORS.PAGE,
  },
  header: {
    height: 50,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  text: {
    color: TEXT_COLORS.SUCCESS,
    fontSize: FONT_SIZE.H1,
  },
  text2: {
    color: TEXT_COLORS.ERROR,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    fontSize: FONT_SIZE.H1,
  },
});
export default HomeScreen;
