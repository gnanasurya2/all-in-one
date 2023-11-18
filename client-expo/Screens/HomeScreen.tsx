import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../components/Text';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS } from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from '../Navigation/RootNavigator';

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootNavigatorParamList, 'Home'>) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.chipWrapper, { backgroundColor: '#FF6B6B' }]}
        onPress={() => {
          navigation.navigate('Movies', { screen: 'Home' } as any);
        }}
      >
        <Text style={styles.content}>Movies</Text>
      </Pressable>
      <Pressable
        style={[styles.chipWrapper, { backgroundColor: '#0b8a4b' }]}
        onPress={() => {
          navigation.navigate('ExpenseTracker', { screen: 'Home' });
        }}
      >
        <Text style={styles.content}>Expense tracker</Text>
      </Pressable>
    </View>
  );
};

// #FF6B6B (Coral Red)
// #FFC300 (Vivid Yellow)
// #FF85A2 (Light Pink)
// #0b8a4b (Spring Green)
// #FFA500 (Orange)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: SURFACE_COLORS.PAGE,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  chipWrapper: {
    backgroundColor: '#FFA500',
    flexBasis: '42%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  content: {
    fontSize: FONT_SIZE.H2,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    textAlign: 'center',
  },
});

export default HomeScreen;
