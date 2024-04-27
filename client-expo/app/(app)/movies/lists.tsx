import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useMovieLists } from '@api/movies/getMovieLists';
import AddButton from '@components/AddButton';
import MovieList from '@components/MovieList';
import Separator from '@components/Separator';
import { SURFACE_COLORS } from '@constants/styles';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useAddMovieToList } from '@api/movies/addMovieToList';

const ListsScreen = () => {
  const { data, fetchNextPage } = useMovieLists();
  const router = useRouter();

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
            numberOfFilms={item.number_of_items}
            onPressHandler={async () => {
              router.push({
                pathname: '/(app)/movies/createLists',
                params: {
                  listId: item.id,
                  title: item.title,
                  description: item.description,
                },
              });
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
      <AddButton onPress={() => router.push('/(app)/movies/createLists')} />
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
export default ListsScreen;
