import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../components/Text';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS } from '../../constants/styles';

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Link
        href={'/(app)/movies'}
        asChild
        style={[styles.chipWrapper, { backgroundColor: '#FF6B6B' }]}
      >
        <Pressable>
          <Text style={styles.content}>Movies</Text>
        </Pressable>
      </Link>
      <Link
        href={'/(app)/expense'}
        asChild
        style={[styles.chipWrapper, { backgroundColor: '#0b8a4b' }]}
      >
        <Pressable>
          <Text style={styles.content}>Expense tracker</Text>
        </Pressable>
      </Link>
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
    paddingVertical: 16,
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
