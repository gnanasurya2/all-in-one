import { FONT_FAMILY, SURFACE_COLORS } from '../constants/styles';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Text from '../components/Text';

const SplashScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>All In One</Text>
      <Image source={require('../assets/icon.png')} style={styles.iconImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.PAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
  },
  iconImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginTop: 32,
  },
});

export default SplashScreen;
