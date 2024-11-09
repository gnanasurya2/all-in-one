import {SURFACE_COLORS, TEXT_COLORS} from '../../constants/styles';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

interface CategoriesProps {
  selectedCategory: string;
  onChange: (id: string) => void;
  onPress: () => void;
}

const Categories = ({selectedCategory, onPress}: CategoriesProps) => {
  return (
    <>
      <Pressable style={styles.wrapper} onPress={onPress}>
        <Text style={styles.text}>{selectedCategory}</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: SURFACE_COLORS.MODAL,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: TEXT_COLORS.HEADING,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
});
export default Categories;
