import React, {useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Text from '../components/Text';
import {FONT_FAMILY, FONT_SIZE, SURFACE_COLORS} from '../constants/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import axios from 'axios';
import {useSession} from '../context/AuthContext';

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const {signOut} = useSession();

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        const {status} = error.response || {};
        if (status === 401) {
          signOut?.();
        }
        return Promise.reject(error);
      },
    );
  }, [signOut]);
  return (
    <View style={styles.wrapper}>
      <FocusAwareStatusBar
        backgroundColor={SURFACE_COLORS.PAGE}
        barStyle="light-content"
      />
      <Pressable
        style={[styles.chipWrapper, styles.coralRed]}
        onPress={() => navigation.navigate('MovieRoot')}>
        <Text style={styles.content}>Movies</Text>
      </Pressable>
      <Pressable
        style={[styles.chipWrapper, styles.springGreen]}
        onPress={() => navigation.navigate('ExpenseTrackerRoot')}>
        <Text style={styles.content}>Expense tracker</Text>
      </Pressable>
    </View>
  );
};

// #FF6B6B (Coral Red)
// #FFC300 (Vivid Yellow)
// #FF85A2 (Light Pink)
// #0b8a4b (Spring Green)
// #FFA500 (Orange)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: SURFACE_COLORS.PAGE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  chipWrapper: {
    backgroundColor: '#FFA500',
    flexBasis: '42%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  content: {
    fontSize: FONT_SIZE.H1,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    textAlign: 'center',
  },
  coralRed: {backgroundColor: '#FF6B6B'},
  springGreen: {backgroundColor: '#0b8a4b'},
});

export default HomeScreen;
