import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Transcation from '../../components/Transcation';
import {
  BORDERS_COLORS,
  FONT_FAMILY,
  SURFACE_COLORS,
  TEXT_COLORS,
} from '../../constants/styles';
import NativeReadSms from '../../specs/NativeReadSms';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ExpenseTrackerParamList} from '../../navigation/ExpenseTrackerNavigator';
import {
  formattedExpense,
  useGetTrackedExpenses,
} from '../../api/expenseTracker/getTrackedExpenses';
import Loader from '../../components/Loader';
import {useDeleteExpense} from '../../api/expenseTracker/deleteExpense';
import NumberCounter from '../../components/NumberCounter';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import ExpenseCalender from '../../components/ExpenseCalender';
import {changeMonth} from '../../utils/changeMonth';
import {parseSmsToExpense} from '../../utils/parseTransactionMessage';
import {useGetLastInsertedTimestamp} from '../../api/expenseTracker/getLastInsertedTimestamp';
import {useCreateNewExpense} from '../../api/expenseTracker/createNewExpense';

const FooterComponent = () => {
  return <View style={styles.footer} />;
};

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<ExpenseTrackerParamList, 'Home'>) => {
  const [currentMonth, setCurrentMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);

  const {data, isLoading} = useGetTrackedExpenses(currentMonth);
  const {data: lastInsertedTimestamp} = useGetLastInsertedTimestamp();
  const {mutateAsync: deleteExpenseAync} = useDeleteExpense(
    currentMonth.month,
    currentMonth.year,
  );
  const {mutate} = useCreateNewExpense();

  useEffect(() => {
    NativeReadSms.requestSmsPermission();
    if (lastInsertedTimestamp?.timestamp) {
      const smsData = NativeReadSms.readSms(
        new Date(lastInsertedTimestamp?.timestamp).getTime() + 1,
        ['HDFCBK-S'],
      );
      console.log('data', smsData.length);
      if (smsData.length > 0) {
        const formatedData = parseSmsToExpense(smsData);
        mutate({data: formatedData});
      }
    }
  }, [lastInsertedTimestamp?.timestamp, mutate]);

  const formattedDate = useMemo(
    () =>
      new Date(
        Date.UTC(currentMonth.year, currentMonth.month - 1),
      ).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      }),
    [currentMonth],
  );

  const composed = useMemo(() => {
    const rightGesture = Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => {
        runOnJS(setCurrentMonth)({
          month: currentMonth.month === 0 ? 12 : currentMonth.month - 1,
          year:
            currentMonth.month === 0
              ? currentMonth.year - 1
              : currentMonth.year,
        });
      });

    const leftGesture = Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => {
        runOnJS(setCurrentMonth)({
          month: currentMonth.month === 12 ? 1 : currentMonth.month + 1,
          year:
            currentMonth.month === 12
              ? currentMonth.year + 1
              : currentMonth.year,
        });
      });
    return Gesture.Simultaneous(rightGesture, leftGesture);
  }, [currentMonth]);

  const keyExtractor = useCallback(({id}: {id: number}) => id.toString(), []);

  const renderItem = useCallback(
    ({item}: {item: formattedExpense}) => (
      <Transcation
        {...item}
        onEditPressed={() => navigation.navigate('Create', {data: {...item}})}
        onDeletePressed={async () => await deleteExpenseAync(item.id)}
      />
    ),
    [deleteExpenseAync, navigation],
  );

  return (
    <View style={styles.wrapper}>
      <FocusAwareStatusBar
        backgroundColor={SURFACE_COLORS.PAGE}
        barStyle="light-content"
      />
      <Pressable
        onPressIn={() => {
          console.log('pressed');
          setIsCalenderOpen(true);
        }}>
        <Text style={styles.text}>{formattedDate}</Text>
      </Pressable>
      <ExpenseCalender
        isOpen={isCalenderOpen}
        date={currentMonth}
        data={data?.data}
        handleClose={() => setIsCalenderOpen(false)}
        changeMonth={dir => {
          setCurrentMonth(prev => changeMonth(prev, dir));
        }}
      />
      <GestureDetector gesture={composed}>
        <View style={styles.textWrapper}>
          <View style={styles.rowWrapper}>
            <Text style={styles.text}>Expense: </Text>
            <NumberCounter
              value={data?.total_expense || 0}
              maxFontSize={40}
              fontSizeMultiplier={1.6}
              textStyle={styles.errorText}
            />
          </View>
          <View style={styles.rowWrapper}>
            <Text style={styles.text}>Income: </Text>
            <NumberCounter
              value={data?.total_income || 0}
              maxFontSize={40}
              fontSizeMultiplier={1.6}
              textStyle={styles.successText}
            />
          </View>
        </View>
      </GestureDetector>
      <Pressable
        style={styles.createButton}
        onPress={() => {
          navigation.navigate('Create', {});
        }}>
        <MaterialIcons name="add" size={40} color={'white'} />
      </Pressable>
      {!isLoading ? (
        <FlatList
          data={data?.data}
          style={styles.list}
          keyExtractor={keyExtractor}
          ListFooterComponent={FooterComponent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.PAGE,
  },
  textWrapper: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: BORDERS_COLORS.SECONDARY,
    width: '100%',
  },
  list: {flex: 1, width: '100%', padding: 16},
  createButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: SURFACE_COLORS.SUCCESS,
    borderRadius: 50,
    padding: 6,
    margin: 16,
    zIndex: 2,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
  },
  footer: {marginBottom: 16},
  errorText: {color: TEXT_COLORS.ERROR},
  successText: {color: TEXT_COLORS.SUCCESS},
});
export default HomeScreen;
