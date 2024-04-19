import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../components/Text';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS } from '../../constants/styles';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieNavigatorDrawerParamList } from '../../Navigation/MovieApp/MovieSideBarNavigation';
import { useMovieLists } from '../../api/movies/getMovieLists';
import Separator from '../../components/Separator';

import MovieListSelect from '../../components/MovieListSelect';
import { MaterialIcons } from '@expo/vector-icons';
import { useAddMovieToList } from '../../api/movies/addMovieToList';

const ListsSelectScreen = ({
  navigation,
  route: {
    params: { title, imdbId, poster },
  },
}: DrawerScreenProps<MovieNavigatorDrawerParamList, 'ListsSelect'>) => {
  const { data, fetchNextPage } = useMovieLists();
  const [selectedLists, setSelectedLists] = useState<Record<string, boolean>>({});
  //TODO: add a feature to create a list on the select screen
  //   const addNewListHandler = () => {
  //     navigation.push('ViewList', {});
  //   };

  const { mutateAsync } = useAddMovieToList();

  const movieLists = useMemo(() => {
    const flattened_data = data?.pages.flatMap((value) => value.response);
    let initialSelectedList: Record<string, boolean> = {};
    flattened_data?.forEach((item) => {
      initialSelectedList[item.data.list_id] = false;
    });

    setSelectedLists(initialSelectedList);
    return flattened_data;
  }, []);

  const addToListHandler = async () => {
    const listIdsToAddMovie = Object.keys(selectedLists)
      .filter((key) => selectedLists[key])
      .map((ele) => parseInt(ele));

    await mutateAsync({ list_ids: listIdsToAddMovie, title, imdb_id: imdbId, poster });
    navigation.navigate('Movie', { movieId: imdbId, type: 'movie' });
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigation.navigate('Movie', { movieId: imdbId, type: 'movie' });
          }}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerText}>Add to List</Text>
        </View>
        <Pressable onPress={addToListHandler}>
          <MaterialIcons name="check" size={24} color="white" />
        </Pressable>
      </View>
      <FlatList
        data={movieLists}
        renderItem={({ item }) => (
          <MovieListSelect
            title={item.data.list_name}
            numberOfFilms={0}
            isSelected={selectedLists?.[item.data.list_id]}
            onPressHandler={() => {
              setSelectedLists((prev) => ({
                ...prev,
                [item.data.list_id]: !prev?.[item.data.list_id],
              }));
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
      {/* <AddButton onPress={addNewListHandler} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.PAGE,
    justifyContent: 'flex-start',
  },
  header: {
    height: 60,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTextWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  headerText: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    fontSize: FONT_SIZE.H3,
  },
});
export default ListsSelectScreen;
