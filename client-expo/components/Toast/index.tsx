import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../Text';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS } from '../../constants/styles';

type ToastProps = {
  children: string;
  toastValue: boolean;
  setToastValue: React.Dispatch<React.SetStateAction<boolean>>;
};
const Toast = ({ children, toastValue, setToastValue }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => setToastValue(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [toastValue]);
  return (
    toastValue && (
      <View style={styles.toastWrapper}>
        <Text style={styles.toastText}>{children}</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    borderRadius: 12,
    backgroundColor: '#ff5b00',
  },
  toastText: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    fontSize: FONT_SIZE.H3,
    textAlign: 'center',
  },
});
export default Toast;
