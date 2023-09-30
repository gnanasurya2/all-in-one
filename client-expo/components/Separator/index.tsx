import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {SURFACE_COLORS} from '../../constants/styles';

const Separator = ({style}: ViewProps) => {
  return <View style={[stlyes.separator, style]} />;
};

const stlyes = StyleSheet.create({
  separator: {
    marginHorizontal: 16,
    borderBottomColor: SURFACE_COLORS.HIGHLIGHT,
    borderBottomWidth: 1,
  },
});

export default Separator;
