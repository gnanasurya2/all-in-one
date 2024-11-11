import React from 'react';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

import Text from '../Text';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {FONT_SIZE, TEXT_COLORS} from '../../constants/styles';

type datePickerMode = 'date' | 'time';

type DateTimeSelectorProps = {
  date: Date;
  onChange: (date: Date) => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  pressableStyle?: StyleProp<ViewStyle>;
  dateTextStyle?: StyleProp<TextStyle>;
  dateTimePressableWrapperStyle?: StyleProp<ViewStyle>;
};

const DateTimeSelector = ({
  date,
  onChange,
  wrapperStyle = styles.dateTimeWrapper,
  pressableStyle = styles.datePressable,
  dateTextStyle = styles.dateText,
  dateTimePressableWrapperStyle = styles.dateTimePressableWrapper,
}: DateTimeSelectorProps) => {
  const showMode = (currentMode: datePickerMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, updatedDate) => {
        updatedDate && onChange(updatedDate);
      },
      mode: currentMode,
      is24Hour: false,
    });
  };
  return (
    <View style={wrapperStyle}>
      <View style={dateTimePressableWrapperStyle}>
        <Pressable onPress={() => showMode('date')} style={pressableStyle}>
          <Text style={dateTextStyle}>
            {date.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </Pressable>
        <Pressable onPress={() => showMode('time')} style={pressableStyle}>
          <Text style={dateTextStyle}>
            {date.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dateTimePressableWrapper: {flexDirection: 'row', justifyContent: 'flex-end'},
  datePressable: {
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  dateText: {fontSize: FONT_SIZE.H3, color: TEXT_COLORS.BODY_L2},
});

export default DateTimeSelector;
