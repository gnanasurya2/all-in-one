import React, { useContext } from 'react';
import MovieAppNavigator from './MovieApp/MovieAppNavigator';
import { AuthContext } from '../context/AuthContext';
import AuthenticationNavigator from './Authentication/AuthenticationNavigator';

const MainNavigator = () => {
  const { state } = useContext(AuthContext);
  return state.isLoggedIn ? <MovieAppNavigator /> : <AuthenticationNavigator />;
};

export default MainNavigator;
