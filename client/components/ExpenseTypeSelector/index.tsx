import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Text from '../Text';
import {Pressable, StyleSheet} from 'react-native';
import {SURFACE_COLORS, TEXT_COLORS} from '../../constants/styles';

const FONT_SIZE = 28;
export enum ExpensesType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

interface ExpenseTypeSelectorProps {
  value: ExpensesType;
  onChange: (value: ExpensesType) => void;
}

const ExpenseTypeSelector = ({value, onChange}: ExpenseTypeSelectorProps) => {
  const yValue = useSharedValue(-30);

  useEffect(() => {
    yValue.value = withSpring(
      value === ExpensesType.EXPENSE ? 0 : -FONT_SIZE * 1.6,
      {damping: 10},
    );
  }, [value, yValue]);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: yValue.get()}],
    };
  });

  const onPressHandler = () => {
    onChange(
      value === ExpensesType.INCOME
        ? ExpensesType.EXPENSE
        : ExpensesType.INCOME,
    );
  };

  return (
    <Pressable style={styles.wrapper} onPress={onPressHandler}>
      <Animated.View style={[animatedStyles]}>
        <Text style={styles.expenseText}>Expenses</Text>
        <Text style={styles.incomeText}>Income</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: SURFACE_COLORS.MODAL,
    borderRadius: 8,
    height: FONT_SIZE * 1.6,
    overflow: 'hidden',
    flex: 1,
  },
  expenseText: {
    color: TEXT_COLORS.ERROR,
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: FONT_SIZE * 1.6,
  },
  incomeText: {
    color: TEXT_COLORS.SUCCESS,
    fontSize: FONT_SIZE,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: FONT_SIZE * 1.6,
  },
});
export default ExpenseTypeSelector;
