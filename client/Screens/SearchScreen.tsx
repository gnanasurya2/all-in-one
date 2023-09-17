import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {SURFACE_COLORS} from '../constants/styles';
import SearchInput from '../components/SearchInput';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <View style={styles.wrapper}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        ref={inputRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: SURFACE_COLORS.PAGE,
  },
});
export default SearchScreen;
