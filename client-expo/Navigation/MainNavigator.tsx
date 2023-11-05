import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthenticationNavigator from './Authentication/AuthenticationNavigator';
import RootNavigator from './RootNavigator';

const MainNavigator = () => {
  const { state } = useContext(AuthContext);
  return state.isLoggedIn ? <RootNavigator /> : <AuthenticationNavigator />;
};

export default MainNavigator;
