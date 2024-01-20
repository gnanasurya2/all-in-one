import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import Text from '../../components/Text';
import { WatchlistMovieType, useGetWatchlistMovies } from '../../api/movies/getWatchlistMovies';
import { useEffect, useState } from 'react';
import MovieItem from '../../components/MovieItem';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { SURFACE_COLORS } from '../../constants/styles';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieNavigatorDrawerParamList } from '../../Navigation/MovieApp/MovieSideBarNavigation';

const RandomMovieSeletorScreen = ({
  navigation,
}: DrawerScreenProps<MovieNavigatorDrawerParamList, 'MovieSelector'>) => {
  const { data } = useGetWatchlistMovies({ page_size: 32 });
  const [watchlistMovies, setWatchlistMovies] = useState<Array<WatchlistMovieType>>([]);
  const translateX = useSharedValue(0);

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (data?.pages) {
      const flattenedData = data.pages.flatMap((value) => value.response, [data]);
      setWatchlistMovies(flattenedData);
      translateX.value = ((flattenedData.length - 1) / 2) * width;
    }
  }, [data]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, [watchlistMovies.length]);

  const spinPressHandler = () => {
    translateX.value = (width * (watchlistMovies.length - 1)) / 2;
    translateX.value = withRepeat(
      withTiming(-translateX.value, {
        duration: watchlistMovies.length * 150,
        easing: Easing.linear,
      }),
      2,
      false,
      () => {
        const interpolatedNumber = interpolate(
          Math.floor(Math.random() * watchlistMovies.length),
          [0, watchlistMovies.length - 1],
          [2.5 * width, -2.5 * width]
        );
        translateX.value = (width * (watchlistMovies.length - 1)) / 2;
        translateX.value = withTiming(interpolatedNumber, {
          duration: watchlistMovies.length * 150,
          easing: Easing.linear,
        });
      }
    );
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.randomWrapper, animatedStyle]}>
        {watchlistMovies.map((item) => (
          <MovieItem
            title={item.title}
            poster={item.poster}
            key={item.imdb_id}
            onPressHandler={() => {
              navigation.navigate('Movie', { movieId: item.imdb_id, type: 'movie' });
            }}
          />
        ))}
      </Animated.View>
      <View style={styles.bottomWrapper}>
        <Pressable style={styles.buttonWrapper} onPress={spinPressHandler}>
          <Text style={styles.buttonText}> Spin </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomWrapper: {
    flexDirection: 'row',
    transform: [{ translateX: 0 }],
  },
  bottomWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonWrapper: {
    backgroundColor: SURFACE_COLORS.SUCCESS,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default RandomMovieSeletorScreen;
