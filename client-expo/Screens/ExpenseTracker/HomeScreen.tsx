import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../components/Text';
import Transcation from '../../components/Transcation';

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Expense tracker</Text>
      <Transcation isIncome={false} title='Burger King' date={1700419164658} amount={1200} category='Food & Drinks' />
      <Transcation isIncome={true} title='Salary' date={1700418154658} amount={87439} category='Income' />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  text: {
    color: "red",
    fontSize: 24,
    textAlign: "center"
  }
});
export default HomeScreen;
