import React, { useContext } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import axios from 'axios';

interface IAuthContext {
  createAccount?: (props: { username: string; password: string }) => Promise<void>;
  signIn?: (props: { username: string; password: string }) => Promise<void>;
  signOut?: () => void;
  session: string | null;
  isLoading: boolean;
}

export const AuthContext = React.createContext<IAuthContext>({
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        createAccount: async ({ username, password }: { username: string; password: string }) => {
          const response = await axios.post<{
            username: string;
            id: number;
            token: string;
          }>('/user/create', {
            username,
            password,
          });

          setSession(response.data.token);
        },
        signIn: async ({ username, password }: { username: string; password: string }) => {
          console.log('base url', axios.defaults.baseURL);
          const response = await axios.post<{
            username: string;
            id: number;
            token: string;
          }>('/user/login', {
            username,
            password,
          });
          setSession(response.data.token);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
