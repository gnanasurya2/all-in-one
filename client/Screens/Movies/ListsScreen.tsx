import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useMovieLists } from '../../api/movies/getMovieLists';
import AddButton from '../../components/AddButton';
import MovieList from '../../components/MovieList';
import Separator from '../../components/Separator';
import { SURFACE_COLORS } from '../../constants/styles';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieDrawerParamList } from '../../navigation/MovieNavigator';

const ListsScreen = ({ navigation }: DrawerScreenProps<MovieDrawerParamList, 'Lists'>) => {
  const { data, fetchNextPage } = useMovieLists();

  const movieLists = useMemo(() => data?.pages.flatMap((value) => value.response), [data]);

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
              navigation.navigate('CreateList', {
                listId: item.id,
                title: item.title,
                description: item.description,
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
      <AddButton
        onPress={() => {
          navigation.navigate('CreateList', {});
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
export default ListsScreen;
