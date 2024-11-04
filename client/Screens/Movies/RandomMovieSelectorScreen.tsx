import React from 'react';
import {
  WatchlistMovieType,
  useGetWatchlistMovies,
} from '../../api/movies/getWatchlistMovies';
import Loader from '../../components/Loader';
import MovieItem from '../../components/MovieItem';
import {SURFACE_COLORS} from '../../constants/styles';
// import { router } from 'expo-router';
import {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
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
      translateX.value = ((flattenedData.length - 1) / 2) * width;
    }
  }, [data, translateX, width]);

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
          [halfItemValue * width, -halfItemValue * width],
        );
        translateX.value = halfItemValue * width;
        translateX.value = withTiming(interpolatedNumber, {
          duration: watchlistMovies.length * 150,
          easing: Easing.linear,
        });
      },
    );
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
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.WARNING,
  },
  randomWrapper: {
    flexDirection: 'row',
    transform: [{translateX: 0}],
  },
});

export default RandomMovieSeletorScreen;
