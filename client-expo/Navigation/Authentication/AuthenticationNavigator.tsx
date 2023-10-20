import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../Screens/Authentication/LoginScreen';
import SignUpScreen from '../../Screens/Authentication/SignUpScreen';

export type AuthenticationStackParamList = {
  Login: undefined;
  SignUp: undefined;
};
const Stack = createNativeStackNavigator<AuthenticationStackParamList>();

const AuthenticationNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={SignUpScreen} name="SignUp" />
    </Stack.Navigator>
  );
};

export default AuthenticationNavigator;
