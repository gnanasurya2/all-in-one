import React, {forwardRef, ForwardedRef} from 'react';
import {ImageStyle, StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle} from 'react-native';
import {FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS} from '../../constants/styles';
import {FontAwesome5} from '@expo/vector-icons';

interface SearchInputProps extends Omit<TextInputProps, 'style' | 'ref'> {
  wrapperStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
const SearchInput = forwardRef(
  ({wrapperStyle, iconStyle, inputStyle, ...props}: SearchInputProps, ref: ForwardedRef<TextInput>) => {
    return (
      <View style={[styles.searchWrapper, wrapperStyle]}>
        <FontAwesome5 style={[styles.icon, iconStyle]} name="search" size={20} color="white" />
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Search"
          selectionColor={'white'}
          placeholderTextColor={'white'}
          cursorColor={TEXT_COLORS.HIGHLIGHT}
          {...props}
          ref={ref}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: SURFACE_COLORS.HIGHLIGHT,
    borderRadius: 8,
    paddingHorizontal: 6,
    margin: 16,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_REGULAR,
    color: 'white',
    fontSize: FONT_SIZE.H5,
    fontWeight: '400',
  },
});
export default SearchInput;
