import React, {memo, useState} from 'react';
import {StyleProp, StyleSheet, TextStyle, View} from 'react-native';
import Digit from './Digit';
import DigitText from './DigitText';
import {Text} from 'react-native';

interface NumberCounterProps {
  value: number;
  maxFontSize: number;
  fontSizeMultiplier: number;
  textStyle: StyleProp<TextStyle>;
}

const NumberCounter = ({
  value,
  maxFontSize,
  fontSizeMultiplier,
  textStyle,
}: NumberCounterProps) => {
  const currenyValue = Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value);
  const numberLists = currenyValue.toString().split('');
  const [fontSize, setFontSize] = useState(maxFontSize);
  return (
    <>
      <Text
        style={[styles.sampleText, {fontSize: maxFontSize}]}
        numberOfLines={1}
        adjustsFontSizeToFit
        onTextLayout={event => {
          setFontSize(event.nativeEvent.lines[0].ascender - 5);
        }}>
        {currenyValue}
      </Text>
      <View style={[styles.wrapper, {height: fontSize * fontSizeMultiplier}]}>
        {numberLists.map((num, idx) =>
          !isNaN(parseInt(num, 10)) ? (
            <Digit
              key={idx}
              value={parseInt(num, 10)}
              fontSize={fontSize}
              fontSizeMultiplier={fontSizeMultiplier}
              index={idx}
              textStyle={textStyle}
            />
          ) : (
            <DigitText
              fontSize={fontSize}
              fontSizeMultiplier={fontSizeMultiplier}
              key={idx}
              style={styles.numberData}>
              {num}
            </DigitText>
          ),
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  numberData: {
    color: 'white',
    opacity: 0.6,
  },
  sampleText: {
    fontWeight: '900',
    position: 'absolute',
    paddingHorizontal: 4,
    top: 10000,
  },
});

export default memo(NumberCounter);
