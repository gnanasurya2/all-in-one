import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../components/Text';

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Text>Expense tracker</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
