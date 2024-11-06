import React from 'react';
import {
  WatchlistMovieType,
  useGetWatchlistMovies,
} from '../../api/movies/getWatchlistMovies';
import Loader from '../../components/Loader';
import MovieItem from '../../components/MovieItem';
import {SURFACE_COLORS} from '../../constants/styles';
import {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {MovieDrawerParamList} from '../../navigation/MovieNavigator';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {ContentType} from '../../constants/enums';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

const MOVIE_FRAME_TIME = 100;

const RandomMovieSeletorScreen = ({
  navigation,
}: DrawerScreenProps<MovieDrawerParamList, 'RandomMovie'>) => {
  const {data, isLoading} = useGetWatchlistMovies({page_size: 32});
  const [watchlistMovies, setWatchlistMovies] = useState<
    Array<WatchlistMovieType>
  >([]);

  const translateX = useSharedValue(0);

  const {width} = useWindowDimensions();

  useEffect(() => {
    if (data?.pages) {
      const flattenedData = data.pages.flatMap(value => value.response, [data]);
      setWatchlistMovies(flattenedData);
    }
  }, [data, width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const spinPressHandler = () => {
    if (watchlistMovies.length === 1) {
      return 1;
    }

    const currentIndex = Math.round(Math.abs(translateX.value) / width);
    let randomIndex = Math.floor(Math.random() * watchlistMovies.length);

    console.log('change', currentIndex, randomIndex);

    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * watchlistMovies.length);
    }

    if (currentIndex < randomIndex) {
      translateX.value = withTiming(-randomIndex * width, {
        duration: (randomIndex - currentIndex) * MOVIE_FRAME_TIME,
        easing: Easing.linear,
      });
    } else {
      translateX.value = withSequence(
        withTiming(-(watchlistMovies.length * width), {
          duration: (watchlistMovies.length - currentIndex) * MOVIE_FRAME_TIME,
          easing: Easing.linear,
        }),
        withTiming(0, {duration: 0, easing: Easing.steps(1)}),
        withTiming(-randomIndex * width, {
          duration: randomIndex * MOVIE_FRAME_TIME,
          easing: Easing.linear,
        }),
      );
    }
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => runOnJS(spinPressHandler)());

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={styles.wrapper}>
        <FocusAwareStatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle="light-content"
        />
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Animated.View style={[styles.randomWrapper, animatedStyle]}>
              {watchlistMovies.map(item => (
                <MovieItem
                  title={item.title}
                  poster={item.poster}
                  key={item.imdb_id}
                  onPressHandler={() => {
                    navigation.navigate('Movie', {
                      id: item.imdb_id,
                      type: ContentType.Movies,
                    });
                  }}
                />
              ))}
            </Animated.View>
          </>
        )}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.PAGE,
  },
  randomWrapper: {
    flexDirection: 'row',
    transform: [{translateX: 0}],
  },
});

export default RandomMovieSeletorScreen;
