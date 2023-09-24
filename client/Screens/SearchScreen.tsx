import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, TextInput, FlatList} from 'react-native';
import {SURFACE_COLORS} from '../constants/styles';
import SearchInput from '../components/SearchInput';
import searchMovies, {SerchMovieResult} from '../api/movies';
import {useDebounce} from '../hooks/useDebounce';
import {MovieSearchResult} from '../components/MovieSearchResult';
import {Separator} from '../components/Separator';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const inputRef = useRef<TextInput | null>(null);
  const debouncedSearchText = useDebounce(searchText, 400);
  const [searchResult, setSearchResult] = useState<Array<SerchMovieResult>>([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchText) {
      //TODO: Convert this to react query.
      searchMovies({title: debouncedSearchText, page: pageNumber}).then(({data}) => {
        setSearchResult(prev => [...prev, ...data.Search]);
      });
    }
  }, [debouncedSearchText, pageNumber]);

  return (
    <View style={styles.wrapper}>
      <SearchInput value={searchText} onChangeText={setSearchText} ref={inputRef} />
      <FlatList
        data={searchResult}
        renderItem={({item}) => <MovieSearchResult {...item} onPressHandler={id => console.log('item clicked', id)} />}
        ItemSeparatorComponent={({item}) => <Separator />}
        keyExtractor={item => item.imdbID}
        onEndReached={() => {
          setPageNumber(prev => prev + 1);
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
