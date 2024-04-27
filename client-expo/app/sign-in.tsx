import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as yup from 'yup';
import CustomButton from '../components/Button';
import Text from '../components/Text';
import { SURFACE_COLORS, TEXT_COLORS } from '../constants/styles';
import { useSession } from '../context/AuthContext';

const schema = yup
  .object({
    username: yup.string().required().min(5),
    password: yup.string().required(),
  })
  .required();

export default function SignIn() {
  const { signIn } = useSession();
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
      await signIn?.({ ...data });
      router.replace('/');
    } catch (err) {}

    setIsLoading(false);
  };
  return (
    <View style={styles.wrapper}>
      <Text>LoginScreen</Text>
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
      <Link href="/sign-up" asChild>
        <Pressable>
          <Text style={styles.signInText}>Don't have an account Sign up!</Text>
        </Pressable>
      </Link>
      <CustomButton title="Login" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
    </View>
  );
}

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
