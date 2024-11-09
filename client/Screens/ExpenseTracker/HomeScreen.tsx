import React, {useEffect, useMemo, useState} from 'react';
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
import {useGetTrackedExpenses} from '../../api/expenseTracker/getTrackedExpenses';
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

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<ExpenseTrackerParamList, 'Home'>) => {
  const [currentMonth, setCurrentMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const {data, isLoading} = useGetTrackedExpenses(currentMonth);
  const {mutateAsync: deleteExpenseAync} = useDeleteExpense(
    currentMonth.month,
    currentMonth.year,
  );

  useEffect(() => {
    NativeReadSms.requestSmsPermission();
    console.log(
      'has permission',
      NativeReadSms.hasSmsPermission(),
      NativeReadSms.readSms(1730797160275, ['CUBANK']),
    );
  }, []);

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

  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(setCurrentMonth)({
        month: currentMonth.month === 0 ? 12 : currentMonth.month - 1,
        year:
          currentMonth.month === 0 ? currentMonth.year - 1 : currentMonth.year,
      });
    });

  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      runOnJS(setCurrentMonth)({
        month: currentMonth.month === 12 ? 1 : currentMonth.month + 1,
        year:
          currentMonth.month === 12 ? currentMonth.year + 1 : currentMonth.year,
      });
    });

  const composed = Gesture.Simultaneous(rightGesture, leftGesture);

  return (
    <View style={styles.wrapper}>
      <FocusAwareStatusBar
        backgroundColor={SURFACE_COLORS.PAGE}
        barStyle="light-content"
      />
      <Text style={styles.text}>{formattedDate}</Text>
      <GestureDetector gesture={composed}>
        <View style={styles.textWrapper}>
          <View style={styles.rowWrapper}>
            <Text style={styles.text}>Expense: </Text>
            <NumberCounter
              value={data?.total_expense || 0}
              maxFontSize={40}
              fontSizeMultiplier={1.6}
              textStyle={{color: TEXT_COLORS.ERROR}}
            />
          </View>
          <View style={styles.rowWrapper}>
            <Text style={styles.text}>Income: </Text>
            <NumberCounter
              value={data?.total_income || 0}
              maxFontSize={40}
              fontSizeMultiplier={1.6}
              textStyle={{color: TEXT_COLORS.SUCCESS}}
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
          keyExtractor={({id}) => id.toString()}
          ListFooterComponent={<View style={styles.footer} />}
          renderItem={({item}) => (
            <Transcation
              {...item}
              onEditPressed={() =>
                navigation.navigate('Create', {data: {...item}})
              }
              onDeletePressed={async () => await deleteExpenseAync(item.id)}
            />
          )}
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
});
export default HomeScreen;
