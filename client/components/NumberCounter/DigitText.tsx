import React from 'react';
import {StyleSheet, TextProps} from 'react-native';
import Animated from 'react-native-reanimated';

const DigitText = ({
  style,
  fontSize,
  fontSizeMultiplier,
  ...props
}: TextProps & {
  fontSize: number;
  fontSizeMultiplier: number;
}) => {
  return (
    <Animated.Text
      style={[
        styles.digitText,
        style,
        {fontSize, lineHeight: fontSize * fontSizeMultiplier},
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  digitText: {
    textAlign: 'center',
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});
export default DigitText;
