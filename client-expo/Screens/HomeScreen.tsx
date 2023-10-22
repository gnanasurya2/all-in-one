import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '../constants/styles';

import { RootStackParamList } from '../Navigation/MovieApp/MovieAppNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { useGetTrackedMovies } from '../api/movies/getTrackedMovies';
import TrackedMovie from '../components/TrackedMovie';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import CustomButton from '../components/Button';

export type MovieData =
  | {
      header: false;
      title: string;
      year: number;
      rating: number;
      day: number;
      id: string;
      poster: string;
      isLast: boolean;
    }
  | { header: true; title: string; id: string; isLast: boolean };
const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const { authContext } = useContext(AuthContext);
  const [moviesData, setMoviesData] = useState<Array<MovieData>>([]);
  const [headerIndices, setHeaderIndices] = useState<Array<number>>([0]);

  const { data, fetchNextPage, refetch } = useGetTrackedMovies({ page_size: 15 });
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
            result.push({
              header: true,
              title: `${currentMonth} ${watchedDate.getFullYear()}`,
              id: Math.random().toString(),
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
            navigation.navigate('Search');
          }}
        >
          <FontAwesome5 name="search" size={18} color="white" />
        </Pressable>
      </View>
      <CustomButton
        title="Logout"
        onPress={() => {
          authContext.signOut();
        }}
      />
      <FlatList
        data={moviesData}
        stickyHeaderIndices={headerIndices}
        ListHeaderComponent={() => null}
        renderItem={({ item }) => (
          <TrackedMovie
            {...item}
            onPressHandler={(id) => navigation.push('Movie', { movieId: id, type: 'movie' })}
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
    height: 50,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
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
