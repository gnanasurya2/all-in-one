import React, {forwardRef, ForwardedRef} from 'react';
import {ImageStyle, StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle} from 'react-native';
import {FONT_FAMILY, FONT_SIZE, SURFACE_COLORS} from '../../constants/styles';
//@ts-ignore
import Search from '../../assets/images/Search.svg';

interface SearchInputProps extends Omit<TextInputProps, 'style' | 'ref'> {
  wrapperStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
const SearchInput = forwardRef(
  ({wrapperStyle, iconStyle, inputStyle, ...props}: SearchInputProps, ref: ForwardedRef<TextInput>) => {
    return (
      <View style={[styles.searchWrapper, wrapperStyle]}>
        <Search style={[styles.tinyLogo, iconStyle]} width={20} height={20} />
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Search"
          selectionColor={'white'}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 40,
    height: 40,
    color: 'white',
    bottom: 2,
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
