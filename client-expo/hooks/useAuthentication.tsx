import React, { useReducer } from 'react';
type AuthenticationData = {
  isLoggedIn: boolean;
  token: string | null;
  username?: string;
};

type AuthenticationActions =
  | { type: 'SIGN_IN'; token: string; username: string }
  | { type: 'SIGN_OUT' }
  | { type: 'RESTORE_TOKEN'; token: string };

const authenticationReducer = (
  state: AuthenticationData,
  action: AuthenticationActions
): AuthenticationData => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.token,
        isLoggedIn: true,
      };
    case 'SIGN_IN':
      return {
        ...state,
        token: action.token,
        username: action.username,
        isLoggedIn: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        token: null,
        isLoggedIn: false,
      };
  }
};

export function useAuthentication() {
  const [state, dispatch] = useReducer(authenticationReducer, { isLoggedIn: false, token: null });
  return [state, dispatch] as const;
}
