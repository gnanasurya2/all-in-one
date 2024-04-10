import React from 'react';
import { StyleSheet, View } from 'react-native';
import Transcation from '@components/Transcation';
import Carousel from '@components/Carousel';
import { SURFACE_COLORS } from '../../../constants/styles';

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <View style={{ height: 190 }}>
        <Carousel />
      </View>
      <Transcation
        isIncome={false}
        title="Burger King"
        date={1700419164658}
        amount={1200}
        category="Food & Drinks"
      />
      <Transcation
        isIncome={true}
        title="Salary"
        date={1700418154658}
        amount={87439}
        category="Income"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: SURFACE_COLORS.PAGE,
  },
});
export default HomeScreen;
