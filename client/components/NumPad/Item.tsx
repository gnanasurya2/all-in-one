import React from 'react';
import {StyleSheet, Pressable, Vibration} from 'react-native';
import Text from '../Text';
import {SURFACE_COLORS} from '../../constants/styles';

export enum NumPadActions {
  CLEAR = 'CLEAR',
  SAVE = 'SAVE',
}

interface ItemProps {
  children: React.ReactNode;
  backgroundColor?: string;
  value: number | NumPadActions;
  onChange: (action: number | NumPadActions) => void;
}

const Item = ({
  children,
  backgroundColor = SURFACE_COLORS.INFORMATION,
  value,
  onChange,
}: ItemProps) => {
  return (
    <Pressable
      style={[styles.wrapper, {backgroundColor}]}
      onPress={() => {
        Vibration.vibrate(1);
        onChange(value);
      }}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  text: {
    fontSize: 50,
    textAlign: 'center',
  },
});

export default Item;
