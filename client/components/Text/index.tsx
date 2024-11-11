import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import {FONT_FAMILY} from '../../constants/styles';

const CustomText: React.FC<TextProps> = ({
  style,
  children,
  ...props
}: TextProps) => {
  return (
    <Text style={[styles.textWrapper, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR,
    color: 'white',
  },
});

export default CustomText;
