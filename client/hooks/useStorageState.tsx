import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as KeyChain from 'react-native-keychain';
import { useCallback, useEffect, useState } from 'react';

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await AsyncStorage.removeItem(key);
    // await KeyChain.resetGenericPassword();
  } else {
    await AsyncStorage.setItem(key, value);
    // await KeyChain.setGenericPassword(key, value);
  }
}

export function useStorageState(
  key: string
): [[boolean, string | null], (value: string | null) => Promise<void>] {
  const [state, setState] = useState<[boolean, string | null]>([true, null]);

  useEffect(() => {
    async function getData() {
      const data = await AsyncStorage.getItem(key);
      // const data = await KeyChain.getGenericPassword();
      if (data) {
        setState([false, data]);
        // setState([false, data.password]);
      } else {
        setState([false, '']);
      }
    }
    getData();
  }, [key]);

  const setValue = useCallback(
    async (value: string | null) => {
      await AsyncStorage.setItem(key, value || '');
      // await KeyChain.setGenericPassword(key, value || '');
      setState([false, value]);
    },
    [key]
  );

  return [state, setValue];
}
