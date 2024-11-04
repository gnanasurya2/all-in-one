import React from 'react';
import { SURFACE_COLORS, TEXT_COLORS, FONT_FAMILY } from '../../constants/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../Text';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-back-ios" size={24} color="white" />
      </Pressable>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  headerText: {
    color: TEXT_COLORS.HEADING,
    fontSize: 18,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    marginLeft: 16,
  },
});

export default Header;
