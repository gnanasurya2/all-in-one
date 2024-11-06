import React, {useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useMovieLists} from '../../api/movies/getMovieLists';
import MovieList from '../../components/MovieList';
import Separator from '../../components/Separator';
import {SURFACE_COLORS} from '../../constants/styles';
import {useAddMovieToList} from '../../api/movies/addMovieToList';
import {MovieDrawerParamList} from '../../navigation/MovieNavigator';
import {DrawerScreenProps} from '@react-navigation/drawer';

const ViewListsScreen = ({
  navigation,
  route: {
    params: {imdbId, title, poster},
  },
}: DrawerScreenProps<MovieDrawerParamList, 'ViewList'>) => {
  const {data, fetchNextPage} = useMovieLists();

  const movieLists = useMemo(
    () => data?.pages.flatMap(value => value.response),
    [data],
  );

  const mutateLists = useAddMovieToList();

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={movieLists}
        renderItem={({item}) => (
          <MovieList
            description={item.description}
            title={item.title}
            numberOfFilms={item.number_of_items}
            onPressHandler={async () => {
              await mutateLists.mutateAsync({
                list_ids: [item.id],
                poster,
                imdb_id: imdbId,
                title,
              });
              navigation.goBack();
            }}
          />
        )}
        ItemSeparatorComponent={() => (
          <Separator style={{marginHorizontal: 0}} />
        )}
        keyExtractor={item => item.id.toString()}
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
