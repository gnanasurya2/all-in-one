import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../components/Text';

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>coding in neo vim </Text>
      <Text>Expense tracker</Text>
      <Text>still trying out nvim</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: "red",
    fontSize: 16,
    textAlign: "center"
  }
});
export default HomeScreen;
