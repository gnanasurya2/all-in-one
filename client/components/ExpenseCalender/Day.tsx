import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../Text';
import {SURFACE_COLORS} from '../../constants/styles';
import {formatAmount} from '../../utils/formatAmount';

interface DayProps {
  day: number | null;
  data?: {expense: number; income: number};
}
const Day = ({day, data}: DayProps) => {
  const heightData = useMemo(() => {
    if (data?.expense || data?.income) {
      const incomePercentage =
        (data.income / (data.expense + data.income)) * 30;
      return {
        income: incomePercentage + 10,
        incomeText: formatAmount(data.income),
        expense: 30 - incomePercentage + 10,
        expenseText: formatAmount(data.expense),
      } as const;
    }
    return {
      income: '0%',
      incomeText: '0',
      expense: '0%',
      expenseText: '0',
    } as const;
  }, [data]);

  if (day === null) {
    return (
      <View
        style={[styles.wrapper, {backgroundColor: SURFACE_COLORS.DISABLED}]}
      />
    );
  }

  return (
    <View style={[styles.wrapper]}>
      <View
        style={{
          height: heightData.expense,
          backgroundColor: SURFACE_COLORS.ERROR_TRANSLUECENT,
        }}>
        <Text style={styles.amountText}>{heightData.expenseText}</Text>
      </View>
      <View
        style={{
          height: heightData.income,
          backgroundColor: SURFACE_COLORS.SUCCESS_TRANSLUECENT,
          justifyContent: 'flex-end',
        }}>
        <Text style={styles.amountText}>{heightData.incomeText}</Text>
      </View>
      <Text style={styles.text}>{day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.HIGHLIGHT,
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
  },
  amountText: {
    fontSize: 10,
    textAlign: 'center',
  },
});
export default Day;
