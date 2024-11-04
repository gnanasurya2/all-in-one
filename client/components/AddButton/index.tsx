import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SURFACE_COLORS } from '../../constants/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <Icon name="add" color={'white'} size={36} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: SURFACE_COLORS.SUCCESS,
    padding: 12,
    borderRadius: 100,
    position: 'absolute',
    bottom: 20,
    elevation: 10,
    right: 24,
  },
});
export default AddButton;
