import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { AuthenticationStackParamList } from '../../Navigation/Authentication/AuthenticationNavigator';
import Text from '../../components/Text';
import { SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomButton from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';

const schema = yup
  .object({
    username: yup.string().required().min(5),
    password: yup.string().required(),
  })
  .required();

const SignUpScreen = ({
  navigation,
}: NativeStackScreenProps<AuthenticationStackParamList, 'Login'>) => {
  const { authContext } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      await authContext.createAccount({ ...data });
    } catch (err) {
      console.log('error', err);
    }

    setIsLoading(false);
  };
  return (
    (<View style={styles.wrapper}>
      <Text>SignUp Screen</Text>
      <Controller
        control={control}
        name="username"
        rules={{
          minLength: {
            value: 4,
            message: 'UserName should be atleast 5 characters',
          },
          pattern: {
            value: /^[a-zA-Z0-9_-]{5,20}$/,
            message: 'Special characters are not allowed',
          },
          required: true,
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="UserName"
            cursorColor={TEXT_COLORS.INFORMATION}
            value={value}
            onBlur={onBlur}
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onChange}
          />
        )}
      />
      <Text style={styles.errorText}>{errors.username?.message}</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            style={styles.textInput}
            cursorColor={TEXT_COLORS.INFORMATION}
            placeholder="Password"
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>This is required</Text>}
      <Pressable
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.signInText}>Already have an account Login!</Text>
      </Pressable>
      <CustomButton title="Login" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
    </View>)
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: TEXT_COLORS.HIGHLIGHT,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: TEXT_COLORS.ERROR,
  },
  textInput: {
    height: 40,
    width: '90%',

    backgroundColor: SURFACE_COLORS.BACKDROP,
    margin: 12,
    padding: 10,
    borderRadius: 8,
  },
});

export default SignUpScreen;
