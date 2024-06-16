import { useSearchMovies } from '@api/movies';
import Loader from '@components/Loader';
import { MovieSearchResult } from '@components/MovieSearchResult';
import SearchInput from '@components/SearchInput';
import Separator from '@components/Separator';
import { SURFACE_COLORS } from '@constants/styles';
import { useDebounce } from '@hooks/useDebounce';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput | null>(null);
  const debouncedSearchText = useDebounce(searchText, 400).trim();
  const router = useRouter();

  const { data, fetchNextPage } = useSearchMovies({ title: debouncedSearchText });
  useEffect(() => {
    // const unsubscribe = navigation.addListener('transitionEnd', () => {
    //   console.log('input ref', inputRef.current);
    //   inputRef.current?.focus();
    // });
    // return unsubscribe;
  }, []);

  const searchResults = useMemo(() => {
    return data?.pages.flatMap((value) => value.Search) || [];
  }, [data]);

  return (
    <View style={styles.wrapper}>
      <SearchInput value={searchText} onChangeText={setSearchText} ref={inputRef} />
      {searchText && !searchResults.length ? (
        <Loader />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <MovieSearchResult
              {...item}
              onPressHandler={(id, type) => {
                setSearchText('');
                console.log('data', id, type);
                router.push({
                  pathname: '/(app)/movies/movie',
                  params: {
                    id,
                    type,
                  },
                });
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
      )}
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
