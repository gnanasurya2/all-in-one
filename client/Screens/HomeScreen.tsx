import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS} from '../constants/styles';
import Text from '../components/Text';
//@ts-ignore
import Search from '../assets/images/Search.svg';
import {RootStackParamList} from '../Navigation/MovieApp/MovieAppNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const HomeScreen = ({navigation}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            navigation.navigate('Search');
          }}>
          <Search />
        </Pressable>
      </View>
      <Text style={styles.text}>Finally it's working on a clean pc</Text>
      <Text style={styles.text2}>Home Screen is there</Text>
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
