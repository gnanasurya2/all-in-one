import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { SURFACE_COLORS } from '../../constants/styles';
import SearchInput from '../../components/SearchInput';
import { useSearchMovies } from '../../api/movies';
import { useDebounce } from '../../hooks/useDebounce';
import { MovieSearchResult } from '../../components/MovieSearchResult';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MovieNavigatorStackParamList } from '../../Navigation/MovieApp/MovieAppNavigator';
import Separator from '../../components/Separator';

const SearchScreen = ({
  navigation,
}: NativeStackScreenProps<MovieNavigatorStackParamList, 'Search'>) => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput | null>(null);
  const debouncedSearchText = useDebounce(searchText, 400).trim();

  const { data, fetchNextPage } = useSearchMovies({ title: debouncedSearchText });
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchResults = useMemo(() => {
    return data?.pages.flatMap((value) => value.Search) || [];
  }, [data]);

  return (
    <View style={styles.wrapper}>
      <SearchInput value={searchText} onChangeText={setSearchText} ref={inputRef} />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <MovieSearchResult
            {...item}
            onPressHandler={(id, type) => {
              navigation.push('Movie', { movieId: id, type });
            }}
          />
        )}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={(item) => item.imdbID}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchNextPage();
        }}
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
