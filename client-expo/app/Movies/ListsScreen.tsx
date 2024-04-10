import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MovieNavigatorDrawerParamList } from '../../Navigation/MovieApp/MovieSideBarNavigation';
import { useMovieLists } from '../../api/movies/getMovieLists';
import AddButton from '../../components/AddButton';
import MovieList from '../../components/MovieList';
import Separator from '../../components/Separator';
import Text from '../../components/Text';
import { SURFACE_COLORS } from '../../constants/styles';

const ListsScreen = ({
  navigation,
}: DrawerScreenProps<MovieNavigatorDrawerParamList, 'ListsHome'>) => {
  const { data, fetchNextPage } = useMovieLists();

  const addNewListHandler = () => {
    navigation.jumpTo('EditList', {});
  };

  const movieLists = useMemo(() => data?.pages.flatMap((value) => value.response), [data]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={movieLists}
        renderItem={({ item }) => (
          <MovieList
            description={item.data.description}
            title={item.data.list_name}
            numberOfFilms={0}
            posters={item.posters}
            onPressHandler={() => {
              navigation.navigate('ViewList', { listId: item.data.list_id });
            }}
            onPosterPressHandler={(id) => {
              navigation.navigate('Movie', { movieId: id, type: 'movie' });
            }}
          />
        )}
        ItemSeparatorComponent={() => <Separator style={{ marginHorizontal: 0 }} />}
        keyExtractor={(item) => item.data.list_id.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchNextPage();
        }}
      />
      <AddButton onPress={addNewListHandler} />
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
