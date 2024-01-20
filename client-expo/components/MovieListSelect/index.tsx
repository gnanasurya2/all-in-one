import React from 'react';
import Text from '../Text';
import { Pressable, StyleSheet, View } from 'react-native';
import { FONT_FAMILY, FONT_WEIGHT, TEXT_COLORS } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';

type MovieListProps = {
  title: string;
  numberOfFilms: number;
  onPressHandler: () => void;
  isSelected: boolean;
};
const MovieListSelect = ({ title, numberOfFilms, onPressHandler, isSelected }: MovieListProps) => {
  return (
    <Pressable style={styles.wrapper} onPress={onPressHandler}>
      <View>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.numberStyles}>{numberOfFilms} films</Text>
      </View>

      {isSelected && <MaterialIcons name="check" color={TEXT_COLORS.BODY_L2} size={24} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    marginBottom: 4,
  },
  listTitle: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  numberStyles: {
    fontWeight: FONT_WEIGHT.LIGHT,
    color: TEXT_COLORS.BODY_L2,
    fontSize: 12,
  },
});
export default MovieListSelect;
