import React, {useEffect, useMemo} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import DigitText from './DigitText';
import {StyleProp, TextStyle} from 'react-native';

const Digit = ({
  value,
  fontSize,
  index,
  fontSizeMultiplier,
  textStyle,
}: {
  value: number;
  fontSize: number;
  index: number;
  fontSizeMultiplier: number;
  textStyle: StyleProp<TextStyle>;
}) => {
  const translateY = useSharedValue(0);
  const digits = useMemo(() => [...new Array(10).keys()], []);

  useEffect(() => {
    translateY.value = withDelay(
      index * 10,
      withSpring(-value * fontSize * fontSizeMultiplier, {damping: 200}),
    );
  }, [value, translateY, fontSize, index, fontSizeMultiplier]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.get(),
        },
      ],
    };
  });
  return (
    <Animated.View style={animatedStyles}>
      {digits.map(ele => (
        <DigitText
          key={ele}
          fontSize={fontSize}
          fontSizeMultiplier={fontSizeMultiplier}
          style={textStyle}>
          {ele}
        </DigitText>
      ))}
    </Animated.View>
  );
};

export default Digit;
