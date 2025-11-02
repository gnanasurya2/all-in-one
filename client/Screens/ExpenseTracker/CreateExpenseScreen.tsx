import NumberCounter from '../../components/NumberCounter';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import {
  FONT_FAMILY,
  FONT_SIZE,
  SURFACE_COLORS,
  TEXT_COLORS,
} from '../../constants/styles';
import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, StyleSheet, TextInput, View} from 'react-native';
import NumPad from '../../components/NumPad';
import {NumPadActions} from '../../components/NumPad/Item';
import ExpenseTypeSelector, {
  ExpensesType,
} from '../../components/ExpenseTypeSelector';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import Categories from '../../components/Categories';
import {useGetCategories} from '../../api/expenseTracker/getCategories';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Category from '../../components/Categories/Category';
import AddNewCategory from '../../components/Categories/AddNewCategory';
import DateTimeSelector from '../../components/DateTimeSelector';
import {useCreateNewExpense} from '../../api/expenseTracker/createNewExpense';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ExpenseTrackerParamList} from '../../navigation/ExpenseTrackerNavigator';
import {useUpdateExpense} from '../../api/expenseTracker/updateExpense';

interface ExpenseUI {
  amount: number;
  createdAt: Date;
  category: string;
  type: ExpensesType;
  name: string;
}

const CreateExpenseScreen = ({
  navigation,
  route: {
    params: {data},
  },
}: NativeStackScreenProps<ExpenseTrackerParamList, 'Create'>) => {
  const [expense, setExpense] = useState<ExpenseUI>({
    amount: 0,
    createdAt: new Date(),
    category: '',
    type: ExpensesType.EXPENSE,
    name: '',
  });

  useEffect(() => {
    if (data) {
      setExpense({
        amount: data.amount,
        createdAt: new Date(data.date),
        type: data.isIncome ? ExpensesType.INCOME : ExpensesType.EXPENSE,
        name: data.title,
        category: data.category,
      });
    }
  }, [data]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {data: categoriesData} = useGetCategories();
  const {mutateAsync, isPending} = useCreateNewExpense();
  const {mutateAsync: mutateExpenseAsync, isPending: isUpdatePending} =
    useUpdateExpense();

  const changeHandler = async (value: number | NumPadActions) => {
    switch (value) {
      case NumPadActions.CLEAR:
        setExpense(prev => ({...prev, amount: Math.floor(prev.amount / 10)}));
        break;
      case NumPadActions.SAVE:
        const newExpense = {
          amount: expense.amount,
          created_at: Math.floor(expense.createdAt.getTime() / 1000),
          name: expense.name,
          category_id:
            categoriesData?.data.find(val => val.name === expense.category)
              ?.id || 1,
          type: expense.type,
        };
        if (data?.id) {
          await mutateExpenseAsync({...newExpense, id: data.id});
        } else {
          await mutateAsync({data: [newExpense]});
        }

        navigation.navigate('Home');
        break;
      default:
        setExpense(prev => ({...prev, amount: prev.amount * 10 + value}));
    }
  };

  const progress = useDerivedValue(() =>
    withSpring(expense.type === ExpensesType.INCOME ? 0 : 1, {damping: 10}),
  );

  const animatedColorStyles = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [TEXT_COLORS.SUCCESS, TEXT_COLORS.ERROR],
      ),
    };
  });

  return (
    <View style={styles.wrapper}>
      <FocusAwareStatusBar
        backgroundColor={SURFACE_COLORS.PAGE}
        barStyle="light-content"
      />
      <View style={styles.counterWrapper}>
        <NumberCounter
          value={expense.amount}
          maxFontSize={90}
          fontSizeMultiplier={1.6}
          textStyle={animatedColorStyles}
        />
      </View>
      <View style={styles.settingsWrapper}>
        <ExpenseTypeSelector
          value={expense.type}
          onChange={type => setExpense(prev => ({...prev, type}))}
        />
        <Categories
          onChange={category => setExpense(prev => ({...prev, category}))}
          onPress={() => bottomSheetRef?.current?.present()}
          selectedCategory={expense.category}
        />
      </View>
      <View style={styles.settingsWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Description"
          cursorColor={'white'}
          placeholderTextColor={'white'}
          value={expense.name}
          onChangeText={name => setExpense(prev => ({...prev, name}))}
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <DateTimeSelector
          date={expense.createdAt}
          onChange={date => setExpense(prev => ({...prev, createdAt: date}))}
          wrapperStyle={styles.dateTimeWrapper}
          pressableStyle={{}}
          dateTextStyle={styles.dateTimeText}
          dateTimePressableWrapperStyle={styles.textWrapper}
        />
      </View>
      <NumPad
        onChange={changeHandler}
        isLoading={isPending || isUpdatePending}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          enableDynamicSizing={false}
          snapPoints={['100%']}
          handleStyle={styles.handleStyle}>
          <View style={styles.sheetWrapper}>
            {categoriesData?.data?.map(ele => (
              <Category
                value={ele.name}
                onPress={() => {
                  setExpense(prev => ({...prev, category: ele.name}));
                  bottomSheetRef?.current?.close();
                }}
              />
            ))}
            <AddNewCategory />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: SURFACE_COLORS.PAGE,
    justifyContent: 'center',
    minWidth: 80,
  },
  counterWrapper: {
    flex: 1,
    minHeight: 180,
    justifyContent: 'center',
  },
  title: {
    color: TEXT_COLORS.ACTION,
    fontSize: FONT_SIZE.H1,
  },
  textInput: {
    backgroundColor: SURFACE_COLORS.MODAL,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR,
    fontSize: 24,
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    color: 'white',
    flex: 1,
  },
  settingsWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 8,
  },
  handleStyle: {
    backgroundColor: SURFACE_COLORS.MODAL,
    borderWidth: 0,
    borderColor: SURFACE_COLORS.MODAL,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  sheetWrapper: {
    backgroundColor: SURFACE_COLORS.MODAL,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 8,
  },
  dateTimeWrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.MODAL,
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR,
    marginRight: 8,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default CreateExpenseScreen;
