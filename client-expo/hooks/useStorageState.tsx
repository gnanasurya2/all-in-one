import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useReducer, useState } from 'react';

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    SecureStore.setItem(key, value);
  }
}

export function useStorageState(
  key: string
): [[boolean, string | null], (value: string | null) => Promise<void>] {
  const [state, setState] = useState<[boolean, string | null]>([true, null]);

  useEffect(() => {
    setState([false, SecureStore.getItem(key)]);
  }, [key]);

  const setValue = useCallback(
    async (value: string | null) => {
      await setStorageItemAsync(key, value);
      setState([false, value]);
    },
    [key]
  );

  return [state, setValue];
}
