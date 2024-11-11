import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Item, {NumPadActions} from './Item';
import {SURFACE_COLORS} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type NumPadProps = {
  onChange: (action: number | NumPadActions) => void;
  isLoading: boolean;
};

const NumPad = ({onChange, isLoading}: NumPadProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Item value={1} onChange={onChange}>
          1
        </Item>
        <Item value={2} onChange={onChange}>
          2
        </Item>
        <Item value={3} onChange={onChange}>
          3
        </Item>
      </View>
      <View style={styles.row}>
        <Item value={4} onChange={onChange}>
          4
        </Item>
        <Item value={5} onChange={onChange}>
          5
        </Item>
        <Item value={6} onChange={onChange}>
          6
        </Item>
      </View>
      <View style={styles.row}>
        <Item value={7} onChange={onChange}>
          7
        </Item>
        <Item value={8} onChange={onChange}>
          8
        </Item>
        <Item value={9} onChange={onChange}>
          9
        </Item>
      </View>
      <View style={styles.row}>
        <Item
          value={NumPadActions.CLEAR}
          backgroundColor={SURFACE_COLORS.ERROR}
          onChange={onChange}>
          <MaterialIcons name="arrow-left" size={50} />
        </Item>
        <Item value={0} onChange={onChange}>
          0
        </Item>
        <Item
          value={NumPadActions.SAVE}
          backgroundColor={SURFACE_COLORS.SUCCESS}
          onChange={onChange}>
          {isLoading ? (
            <ActivityIndicator size={50} color="white" />
          ) : (
            <MaterialIcons name="check" size={50} />
          )}
        </Item>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 24,
  },
  row: {
    width: '80%',
    gap: 8,
    flexDirection: 'row',
  },
});
export default NumPad;
