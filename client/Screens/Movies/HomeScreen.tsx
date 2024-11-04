import { useGetTrackedMovies } from '../../api/movies/getTrackedMovies';
import TrackedMovie from '../../components/TrackedMovie';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import MenuButton from '../../components/MenuButton';
import { ContentType } from '../../constants/enums';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieDrawerParamList } from '../../navigation/MovieNavigator';
import Loader from '../../components/Loader';

export type MovieData =
  | {
      header: false;
      title: string;
      year: number;
      rating: number;
      day: number;
      id: string;
      poster: string;
      liked: boolean;
      isLast: boolean;
      rewatch: boolean;
      type: ContentType;
      key: string;
    }
  | { header: true; title: string; key: string; isLast: boolean };

const HomeScreen = ({ navigation }: DrawerScreenProps<MovieDrawerParamList, 'Home'>) => {
  const [moviesData, setMoviesData] = useState<Array<MovieData>>([]);
  const [headerIndices, setHeaderIndices] = useState<Array<number>>([0]);
  //   const router = useRouter();

  const { data, fetchNextPage, refetch, hasNextPage } = useGetTrackedMovies({ page_size: 15 });

  useRefreshOnFocus(refetch);
  useEffect(() => {
    if (data?.pages) {
      const updatedHeaderIndices: Array<number> = [1],
        result: Array<MovieData> = [];
      let lastMonth = '';
      data.pages
        .flatMap((value) => value.response, [data])
        .forEach((value, index) => {
          const watchedDate = new Date(value.watched_date),
            currentMonth = watchedDate.toLocaleDateString('en-IN', { month: 'long' }).toUpperCase();
          if (lastMonth !== currentMonth) {
            if (index) {
              updatedHeaderIndices.push(result.length + 1);
              result[result.length - 1].isLast = true;
            }
            const generatedId = Math.random().toString();
            result.push({
              header: true,
              title: `${currentMonth} ${watchedDate.getFullYear()}`,
              key: generatedId,
              isLast: false,
            });
            lastMonth = currentMonth;
          }
          result.push({
            header: false,
            title: value.title,
            year: value.year,
            rating: value.rating,
            //TODO: send actual id from db
            key: `${value.imdb_id}_${watchedDate.getTime()}_${result.length}`,
            id: value.imdb_id,
            poster: value.poster,
            day: watchedDate.getDate(),
            liked: value.liked,
            isLast: false,
            rewatch: value.rewatch,
            type: value.type,
          });
        });
      setHeaderIndices(updatedHeaderIndices);
      setMoviesData(result);
    }
  }, [data]);
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <MenuButton />
        <Pressable hitSlop={10} onPress={() => navigation.navigate('Search')}>
          <FontAwesome5 name="search" size={24} color="white" />
        </Pressable>
      </View>
      <FlatList
        data={moviesData}
        stickyHeaderIndices={headerIndices}
        ListHeaderComponent={() => null}
        ListFooterComponent={() =>
          hasNextPage ? (
            <View style={styles.loaderView}>
              <Loader />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TrackedMovie
            {...item}
            key={item.key}
            onPressHandler={(id, type) => {
              navigation.navigate('Movie', { id, type });
            }}
          />
        )}
        keyExtractor={(item) => item.key}
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
    justifyContent: 'flex-start',
    backgroundColor: SURFACE_COLORS.PAGE,
  },
  header: {
    height: 60,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  text: {
    color: TEXT_COLORS.SUCCESS,
    fontSize: FONT_SIZE.H1,
  },
  text2: {
    color: TEXT_COLORS.ERROR,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    fontSize: FONT_SIZE.H1,
  },
  loaderView: {
    height: 60,
  },
});
export default HomeScreen;
