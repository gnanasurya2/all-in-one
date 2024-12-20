import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {FONT_FAMILY, SURFACE_COLORS} from '../../constants/styles';
import Day from './Day';
import Text from '../Text';
import {formattedExpense} from '@api/expenseTracker/getTrackedExpenses';

interface ExpenseCalenderProps {
  isOpen: boolean;
  handleClose: () => void;
  date: {month: number; year: number};
  changeMonth: (dir: 1 | -1) => void;
  data?: Array<formattedExpense>;
}

const ExpenseCalender = ({
  isOpen,
  handleClose,
  date,
  changeMonth,
  data,
}: ExpenseCalenderProps) => {
  const [isHidden, setIsHidden] = useState(true);
  const [days, setDays] = useState<Array<Array<null | number>>>([]);
  const [monthExpense, setMonthExpense] = useState<
    Record<string, {expense: number; income: number}>
  >({});

  const scale = useSharedValue(-700);

  const formattedDate = useMemo(
    () =>
      new Date(Date.UTC(date.year, date.month - 1)).toLocaleDateString(
        'en-IN',
        {
          month: 'long',
          year: 'numeric',
        },
      ),
    [date],
  );

  useEffect(() => {
    if (isOpen && data) {
      const newExpenseData: Record<string, {expense: number; income: number}> =
        {};
      for (let item of data) {
        if (newExpenseData[item.dayOfMonth]) {
          newExpenseData[item.dayOfMonth] = {
            expense: item.isIncome
              ? newExpenseData[item.dayOfMonth].expense
              : newExpenseData[item.dayOfMonth].expense + item.amount,
            income: item.isIncome
              ? newExpenseData[item.dayOfMonth].income + item.amount
              : newExpenseData[item.dayOfMonth].income,
          };
        } else {
          newExpenseData[item.dayOfMonth] = {
            expense: item.isIncome ? 0 : item.amount,
            income: item.isIncome ? item.amount : 0,
          };
        }
      }
      setMonthExpense(newExpenseData);
    }
  }, [data, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const numberOfDays = new Date(date.year, date.month, 0).getDate();
      const monArr = [];
      let curr = new Date(date.year, date.month - 1, 1).getDay(),
        weekArr = new Array(7).fill(null);
      for (let i = 1; i <= numberOfDays; i++) {
        if (curr === 0) {
          weekArr = new Array(7).fill(null);
        }
        weekArr[curr++] = i;
        if (curr === 7) {
          monArr.push(weekArr);
          curr = 0;
          weekArr = [];
        }
      }
      if (weekArr.length !== 0) {
        monArr.push(weekArr);
      }
      setDays(monArr);
    }
  }, [date, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsHidden(false);
    }
    scale.value = withTiming(isOpen ? 0 : -700, {duration: 500}, () => {
      runOnJS(setIsHidden)(!isOpen);
    });
  }, [isOpen, scale]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: scale.get()}],
    };
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <Animated.View style={[animatedStyles, styles.outerWrapper]}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleRow}>
          <Pressable
            style={styles.toggleIcon}
            onPress={() => changeMonth(-1)}
            hitSlop={16}>
            <MaterialIcon name="chevron-left" color={'white'} size={32} />
          </Pressable>
          <Text style={styles.day}>{formattedDate}</Text>
          <Pressable
            style={styles.toggleIcon}
            onPress={() => changeMonth(1)}
            hitSlop={16}>
            <MaterialIcon name="chevron-right" color={'white'} size={32} />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Text style={styles.day}>Su</Text>
          <Text style={styles.day}>Mo</Text>
          <Text style={styles.day}>Tu</Text>
          <Text style={styles.day}>We</Text>
          <Text style={styles.day}>Th</Text>
          <Text style={styles.day}>Fr</Text>
          <Text style={styles.day}>Sa</Text>
        </View>
        {days.map((week, idx) => (
          <View key={idx} style={styles.row}>
            {week.map((day, dayIdx) => (
              <Day key={dayIdx} day={day} data={monthExpense[day || 0]} />
            ))}
          </View>
        ))}
        <Pressable
          onPressIn={() => handleClose()}
          style={styles.closeButton}
          hitSlop={16}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    top: 10,
    zIndex: 1,
    marginHorizontal: 16,
    overflow: 'hidden',
    width: '100%',
  },
  contentWrapper: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: SURFACE_COLORS.MODAL,
  },
  toggleIcon: {
    width: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  day: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: SURFACE_COLORS.TERTIARY,
    elevation: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginVertical: 16,
  },
  closeText: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
  },
});
export default ExpenseCalender;
