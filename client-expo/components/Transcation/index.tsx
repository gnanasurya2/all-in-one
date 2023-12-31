import React, { useEffect, useMemo } from 'react';
import Text from '../Text';
import { StyleSheet, Pressable, View } from 'react-native';
import { BORDERS_COLORS, FONT_FAMILY, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import RightSwipeActions from './RightSwipeAction';
interface TranscationProps {
  isIncome: boolean;
  title: string;
  date: number;
  amount: number;
  category: string;
}

const Transcation = ({ isIncome, title, date, amount, category }: TranscationProps) => {
  const [formattedDate, formattedTime, formattedAmount] = useMemo(() => {
    const finaldate = new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    });
    const formattedTime = new Date(date)
      .toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit' })
      .toUpperCase();
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
    return [finaldate, formattedTime, formattedAmount];
  }, [date, amount]);

  const isHideBorderRadius = useSharedValue(false);

  const animatedBorderRadius = useAnimatedStyle(() => ({
    borderBottomLeftRadius: isHideBorderRadius.value ? 0 : 12,
    borderTopLeftRadius: isHideBorderRadius.value ? 0 : 12,
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedBorderRadius]}>
      <Swipeable
        renderRightActions={(progress, dragX) => {
          return <RightSwipeActions progress={progress} dragX={dragX} />;
        }}
        onSwipeableOpenStartDrag={() => {
          isHideBorderRadius.value = true;
        }}
        onSwipeableClose={() => {
          isHideBorderRadius.value = false;
        }}
      >
        <Pressable style={{ backgroundColor: SURFACE_COLORS.PAGE, borderRadius: 12 }}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.dateWrapper}>
              <Text style={styles.dateText}>{formattedDate},</Text>
              <Text style={styles.dateText}> {formattedTime}</Text>
            </View>
          </View>
          <View style={styles.transcationWrapper}>
            <Text style={[styles.money, isIncome ? styles.incomeText : styles.expenseText]}>
              {isIncome ? '+' : '-'} {formattedAmount}
            </Text>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    color: TEXT_COLORS.BODY_L2,
    fontWeight: '500',
  },
  titleWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS_COLORS.SECONDARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateWrapper: {
    flexDirection: 'row',
    fontWeight: '500',
    fontSize: 16,
  },
  dateText: {
    color: TEXT_COLORS.BODY_L2,
  },
  transcationWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  money: {
    color: TEXT_COLORS.SUCCESS,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    fontSize: 24,
  },
  incomeText: {
    color: TEXT_COLORS.SUCCESS,
  },
  expenseText: {
    color: TEXT_COLORS.ERROR,
  },
  category: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: SURFACE_COLORS.TERTIARY,
  },
  categoryText: {
    color: TEXT_COLORS.HEADING,
    fontSize: 14,
  },
  wrapper: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    borderColor: BORDERS_COLORS.SECONDARY,
    backgroundColor: SURFACE_COLORS.PAGE,
  },
});
export default Transcation;
