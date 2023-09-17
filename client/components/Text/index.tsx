import React, {ReactNode} from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import {FONT_FAMILY} from '../../constants/styles';

interface CustomTextProps extends TextProps {
  children: ReactNode;
}
const CustomText: React.FC<CustomTextProps> = ({
  style,
  children,
  ...props
}: CustomTextProps) => {
  return (
    <Text style={[styles.textWrapper, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR,
  },
});

export default CustomText;
