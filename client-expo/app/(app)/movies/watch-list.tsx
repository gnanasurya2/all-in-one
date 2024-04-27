import { WatchlistMovieType, useGetWatchlistMovies } from '@api/movies/getWatchlistMovies';
import Text from '@components/Text';
import WatchlistMovie from '@components/WatchlistMovie';
import { FONT_FAMILY, SURFACE_COLORS, TEXT_COLORS } from '@constants/styles';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useRefreshOnFocus } from '@hooks/useRefreshOnFocus';
import { router } from 'expo-router';

const WatchListScreen = () => {
  const { data, fetchNextPage, refetch } = useGetWatchlistMovies({ page_size: 32 });
  const [watchlistMovies, setWatchlistMovies] = useState<Array<WatchlistMovieType>>([]);

  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (data?.pages) {
      setWatchlistMovies(data.pages.flatMap((value) => value.response, [data]));
    }
  }, [data]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerText}>Watchlist</Text>
      </View>
      <FlatList
        data={watchlistMovies}
        style={{ flex: 1, width: '100%' }}
        numColumns={4}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        renderItem={({ item }) => (
          <WatchlistMovie
            poster={item.poster}
            id={item.imdb_id}
            onPresshandler={(id) => {
              router.push({
                pathname: '/(app)/movies/movie',
                params: {
                  id,
                },
              });
            }}
          />
        )}
        keyExtractor={(item) => item.imdb_id}
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
    backgroundColor: SURFACE_COLORS.PAGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default WatchListScreen;
