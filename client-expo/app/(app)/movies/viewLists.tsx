import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useMovieLists } from '@api/movies/getMovieLists';
import MovieList from '@components/MovieList';
import Separator from '@components/Separator';
import { SURFACE_COLORS } from '@constants/styles';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useAddMovieToList } from '@api/movies/addMovieToList';

const ViewListsScreen = () => {
  const { data, fetchNextPage } = useMovieLists();
  const router = useRouter();
  const { imdbId, title, poster } = useLocalSearchParams<{
    isSelect: 'true' | 'false';
    imdbId: string;
    title: string;
    poster: string;
  }>();

  const movieLists = useMemo(() => data?.pages.flatMap((value) => value.response), [data]);

  const mutateLists = useAddMovieToList();

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={movieLists}
        renderItem={({ item }) => (
          <MovieList
            description={item.description}
            title={item.title}
            numberOfFilms={10}
            onPressHandler={async () => {
              await mutateLists.mutateAsync({
                list_ids: [item.id],
                poster,
                imdb_id: imdbId,
                title,
              });
              router.back();
            }}
          />
        )}
        ItemSeparatorComponent={() => <Separator style={{ marginHorizontal: 0 }} />}
        keyExtractor={(item) => item.id.toString()}
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
    justifyContent: 'flex-start',
  },
});
export default ViewListsScreen;
