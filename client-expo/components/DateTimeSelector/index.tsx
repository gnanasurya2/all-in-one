import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import Text from '@components/Text';
import { Pressable, StyleSheet, View } from 'react-native';
import { BORDERS_COLORS, FONT_SIZE, TEXT_COLORS } from '@constants/styles';

type datePickerMode = 'date' | 'time';

const DateTimeSelector = () => {
  const [watchDate, setWatchedDate] = useState(new Date());
  const showMode = (currentMode: datePickerMode) => {
    DateTimePickerAndroid.open({
      value: watchDate,
      onChange: (_, date) => {
        date && setWatchedDate(date);
      },
      mode: currentMode,
      is24Hour: false,
    });
  };
  return (
    <View style={styles.dateTimeWrapper}>
      <View style={styles.dateTimePressableWrapper}>
        <Pressable onPress={() => showMode('date')} style={styles.datePressable}>
          <Text style={styles.dateText}>
            {watchDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </Pressable>
        <Pressable onPress={() => showMode('time')} style={styles.datePressable}>
          <Text style={styles.dateText}>
            {watchDate.toLocaleTimeString('en-IN', {
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
  dateTimePressableWrapper: { flexDirection: 'row', justifyContent: 'flex-end' },
  datePressable: {
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  dateTimeText: { fontSize: FONT_SIZE.H3, color: 'white', marginLeft: 12 },
  dateText: { fontSize: FONT_SIZE.H3, color: TEXT_COLORS.BODY_L2 },
});

export default DateTimeSelector;
