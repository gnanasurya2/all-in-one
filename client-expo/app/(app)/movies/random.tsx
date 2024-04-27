import { WatchlistMovieType, useGetWatchlistMovies } from '@api/movies/getWatchlistMovies';
import Loader from '@components/Loader';
import MovieItem from '@components/MovieItem';
import Text from '@components/Text';
import { SURFACE_COLORS } from '@constants/styles';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const RandomMovieSeletorScreen = () => {
  const { data, isLoading } = useGetWatchlistMovies({ page_size: 32 });
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
    let halfItemValue = (watchlistMovies.length - 1) / 2;
    translateX.value = halfItemValue * width;
    translateX.value = withRepeat(
      withTiming(-translateX.value, {
        duration: watchlistMovies.length * 150,
        easing: Easing.linear,
      }),
      1,
      false,
      () => {
        const interpolatedNumber = interpolate(
          Math.floor(Math.random() * watchlistMovies.length),
          [0, watchlistMovies.length - 1],
          [halfItemValue * width, -halfItemValue * width]
        );
        translateX.value = halfItemValue * width;
        translateX.value = withTiming(interpolatedNumber, {
          duration: watchlistMovies.length * 150,
          easing: Easing.linear,
        });
      }
    );
  };

  return (
    <View style={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Animated.View style={[styles.randomWrapper, animatedStyle]}>
            {watchlistMovies.map((item) => (
              <MovieItem
                title={item.title}
                poster={item.poster}
                key={item.imdb_id}
                onPressHandler={() => {
                  router.push({
                    pathname: '/(app)/movies/movie',
                    params: {
                      id: item.imdb_id,
                    },
                  });
                }}
              />
            ))}
          </Animated.View>
          <View style={styles.bottomWrapper}>
            <Pressable style={styles.buttonWrapper} onPress={spinPressHandler}>
              <Text style={styles.buttonText}> Spin </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.PAGE,
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
