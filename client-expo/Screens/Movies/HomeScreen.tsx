import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import { FontAwesome5 } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useGetTrackedMovies } from '../../api/movies/getTrackedMovies';
import TrackedMovie from '../../components/TrackedMovie';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';
import { readLastNSMS } from '../../modules/read-sms';
import { MovieNavigatorDrawerParamList } from '../../Navigation/MovieApp/MovieSideBarNavigation';

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
    }
  | { header: true; title: string; id: string; isLast: boolean };
const HomeScreen = ({ navigation }: DrawerScreenProps<MovieNavigatorDrawerParamList, 'Home'>) => {
  const [moviesData, setMoviesData] = useState<Array<MovieData>>([]);
  const [headerIndices, setHeaderIndices] = useState<Array<number>>([0]);

  const { data, fetchNextPage, refetch } = useGetTrackedMovies({ page_size: 15 });

  useEffect(() => {
    console.log(
      'read last n messages',
      JSON.stringify(
        readLastNSMS(100).filter(
          (ele) => /^[A-Z]{2}-PAYTMB$/.test(ele.address) && /Received|sent/i.test(ele.body)
        ),
        undefined,
        2
      )
    );
  }, []);

  useRefreshOnFocus(refetch);
  useEffect(() => {
    if (data?.pages) {
      const headerIndices: Array<number> = [1],
        result: Array<MovieData> = [];
      let lastMonth = '';
      data.pages
        .flatMap((value) => value.response, [data])
        .forEach((value, index) => {
          const watchedDate = new Date(value.watched_date),
            currentMonth = watchedDate.toLocaleDateString('en-IN', { month: 'long' }).toUpperCase();
          if (lastMonth !== currentMonth) {
            if (index) {
              headerIndices.push(result.length + 1);
              result[result.length - 1].isLast = true;
            }
            const generatedId = Math.random().toString();
            result.push({
              header: true,
              title: `${currentMonth} ${watchedDate.getFullYear()}`,
              id: generatedId,
              isLast: false,
            });
            lastMonth = currentMonth;
          }
          result.push({
            header: false,
            title: value.title,
            year: value.year,
            rating: value.rating,
            id: value.imdb_id,
            poster: value.poster,
            day: watchedDate.getDate(),
            liked: value.liked,
            isLast: false,
          });
        });
      setHeaderIndices(headerIndices);
      setMoviesData(result);
    }
  }, [data]);
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <FontAwesome5 name="bars" size={24} color="white" />
        </Pressable>
        <Pressable
          hitSlop={10}
          onPress={() => {
            navigation.jumpTo('Search');
          }}
        >
          <FontAwesome5 name="search" size={24} color="white" />
        </Pressable>
      </View>
      <FlatList
        data={moviesData}
        stickyHeaderIndices={headerIndices}
        ListHeaderComponent={() => null}
        renderItem={({ item }) => (
          <TrackedMovie
            {...item}
            key={item.id}
            onPressHandler={(id) => navigation.navigate('Movie', { movieId: id, type: 'movie' })}
          />
        )}
        keyExtractor={(item) => item.id}
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
});
export default HomeScreen;
