import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import Text from '../../components/Text';
import { FONT_FAMILY, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import { WatchlistMovieType, useGetWatchlistMovies } from '../../api/movies/getWatchlistMovies';
import WatchlistMovie from '../../components/WatchlistMovie';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieNavigatorDrawerParamList } from '../../Navigation/MovieApp/MovieSideBarNavigation';
import { MaterialIcons } from '@expo/vector-icons';

const WatchListScreen = ({
  navigation,
}: DrawerScreenProps<MovieNavigatorDrawerParamList, 'WatchList'>) => {
  const { data, fetchNextPage } = useGetWatchlistMovies({ page_size: 32 });
  const [watchlistMovies, setWatchlistMovies] = useState<Array<WatchlistMovieType>>([]);

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
            navigation.goBack();
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
              navigation.navigate('Movie', {
                movieId: id,
                type: 'movie',
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
