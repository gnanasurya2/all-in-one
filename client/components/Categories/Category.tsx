import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Text from '../Text';
import {FONT_SIZE, SURFACE_COLORS} from '../../constants/styles';

interface CategoryProps {
  value: string;
  onPress: () => void;
}

const Category = ({value, onPress}: CategoryProps) => {
  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      style={styles.wrapper}>
      <Text style={styles.title}>{value}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: SURFACE_COLORS.HIGHLIGHT,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZE.H1,
    fontWeight: '600',
  },
});
export default Category;
