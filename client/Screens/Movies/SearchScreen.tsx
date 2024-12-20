import {DrawerScreenProps} from '@react-navigation/drawer';
import {useSearchMovies} from '../../api/movies';
import Loader from '../../components/Loader';
import {MovieSearchResult} from '../../components/MovieSearchResult';
import SearchInput from '../../components/SearchInput';
import Separator from '../../components/Separator';
import {FONT_FAMILY, SURFACE_COLORS} from '../../constants/styles';
import {useDebounce} from '../../hooks/useDebounce';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import {MovieDrawerParamList} from '../../navigation/MovieNavigator';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecentlySearched, {
  RecentSearch,
} from '../../components/RecentlySearched';
import {useFocusEffect} from '@react-navigation/native';

const SearchScreen = ({
  navigation,
}: DrawerScreenProps<MovieDrawerParamList, 'Search'>) => {
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<Array<RecentSearch>>([]);
  const inputRef = useRef<TextInput | null>(null);
  const debouncedSearchText = useDebounce(searchText, 400).trim();

  const {data, fetchNextPage} = useSearchMovies({title: debouncedSearchText});

  const searchResults = useMemo(() => {
    return data?.pages.flatMap(value => value.Search) || [];
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      const getRecentSearchData = async () => {
        const recentData = await AsyncStorage.getItem('recent_searches');

        setRecentSearches(recentData ? JSON.parse(recentData) : []);
      };
      getRecentSearchData();
    }, []),
  );

  const updateRecentSearchData = async (data: RecentSearch) => {
    const map = new Map<string, RecentSearch>();

    for (let item of recentSearches) {
      map.set(item.id, item);
    }
    map.set(data.id, data);

    const newArr = [...map.values()]
      .slice(0, 20)
      .sort((a, b) => b.time - a.time);
    await AsyncStorage.setItem('recent_searches', JSON.stringify(newArr));
    setRecentSearches(newArr);
  };

  return (
    <View style={styles.wrapper}>
      <FocusAwareStatusBar
        backgroundColor={SURFACE_COLORS.PAGE}
        barStyle="light-content"
      />
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        ref={inputRef}
      />
      {!searchText ? (
        <View style={styles.searchWrapper}>
          <Text style={styles.title}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={item => item.id}
            style={styles.list}
            contentContainerStyle={styles.contentStyles}
            renderItem={({item}) => (
              <RecentlySearched
                data={item}
                onPress={async () => {
                  await updateRecentSearchData({
                    id: item.id,
                    type: item.type,
                    title: item.title,
                    time: Date.now(),
                  });
                  navigation.navigate('Movie', {id: item.id, type: item.type});
                  setSearchText('');
                }}
              />
            )}
          />
        </View>
      ) : !searchResults.length ? (
        <Loader />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({item}) => (
            <MovieSearchResult
              {...item}
              onPressHandler={async (id, type) => {
                await updateRecentSearchData({
                  id,
                  type,
                  title: item.Title,
                  time: Date.now(),
                });
                navigation.navigate('Movie', {id, type});
                setSearchText('');
              }}
            />
          )}
          ItemSeparatorComponent={Separator}
          keyExtractor={item => item.imdbID}
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
  searchWrapper: {
    flex: 1,
    paddingLeft: 16,
  },
  list: {flex: 1},
  contentStyles: {paddingBottom: 32},
  title: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    color: 'white',
    fontSize: 20,
    marginVertical: 8,
    maxWidth: 280,
  },
});
export default SearchScreen;
