import {useAddTrackedMovie} from '../../api/movies/addWatchedMovie';
import {getMovieResponse, useGetMovies} from '../../api/movies/getMovies';
import {useUpdateTrackedMovie} from '../../api/movies/updateWatchedMovie';
import CustomButton from '../../components/Button';
import Loader from '../../components/Loader';
import {GRADIENT_COLORS, SURFACE_COLORS} from '../../constants/styles';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useQueryClient} from '@tanstack/react-query';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {movieStartTime} from '../../utils/movieStartTime';
import {ContentType} from '../../constants/enums';
import ContentDetails from '../../components/ContentDetails';
import SeriesSections from '../../components/SeriesSections';
import MovieBottomSheet, {
  datePickerMode,
} from '../../components/MovieBottomSheet';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {MovieDrawerParamList} from '../../navigation/MovieNavigator';
import LinearGradient from 'react-native-linear-gradient';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

const MovieScreen = ({
  navigation,
  route: {
    params: {id: movieId, type},
  },
}: DrawerScreenProps<MovieDrawerParamList, 'Movie'>) => {
  const [watched, setWatched] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchList, setWatchList] = useState(false);
  const [rewatch, setRewatch] = useState(false);
  const [watchDate, setWatchedDate] = useState(new Date());
  const [starRating, setStarRating] = useState(0);

  const {data} = useGetMovies({id: movieId, type});

  const {mutate, isSuccess} = useUpdateTrackedMovie({
    id: movieId,
    type,
    poster: data?.Poster || '',
  });
  const {refetch, isFetching} = useAddTrackedMovie({
    imdb_id: movieId,
    liked,
    watch_list: watchList,
    watched,
    rewatch,
    watched_date: watchDate.toISOString(),
    rating: starRating,
    year: parseInt(data?.Year || '0'),
    poster: data?.Poster || '',
    title: data?.Title || '',
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      setLiked(data.liked ?? false);
      setWatched(data.watched ?? false);
      setStarRating(data.rating ?? 0);
      setWatchedDate(
        new Date(data.watched_date ?? movieStartTime(data.Runtime)),
      );
      setWatchList(data.watch_list ?? false);
    }
  }, [data]);

  const gradientColor = useMemo(() => {
    const hash = movieId
      .split('')
      .reduce((prev, curr) => prev + curr.charCodeAt(0), 0);

    return GRADIENT_COLORS[hash % GRADIENT_COLORS.length];
  }, [movieId]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isSuccess) {
      bottomSheetModalRef.current?.close();
    }
  }, [isSuccess]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const showMode = (currentMode: datePickerMode) => {
    DateTimePickerAndroid.open({
      value: watchDate,
      onChange: (_, date) => {
        date && setWatchedDate(date);
      },
      mode: currentMode,
      is24Hour: false,
    });
  };

  return (
    <View style={styles.outerWrapper}>
      <FocusAwareStatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="light-content"
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={[`${gradientColor}FF`, `${gradientColor}00`]}
          style={styles.gradient}
        />
        <View style={styles.wrapper}>
          <>{data ? <ContentDetails data={data} /> : null}</>
          {data ? (
            <>
              {data.Type === ContentType.Series ? (
                <SeriesSections
                  numberOfSeasons={data.NumberOfSeasons}
                  imdbId={movieId}
                  title={data.Title}
                  poster={data.Poster}
                />
              ) : (
                <>
                  <CustomButton
                    onPress={handlePresentModalPress}
                    style={styles.reviewButton}
                    title="Rate, review, log"
                    startIcon="user-circle-o"
                    endIcon="ellipsis-h"
                    endIconStyle={styles.endIconStyle}
                  />
                  <BottomSheetModalProvider>
                    <MovieBottomSheet
                      ref={bottomSheetModalRef}
                      data={data}
                      watched={watched}
                      liked={liked}
                      watchList={watchList}
                      rewatch={rewatch}
                      starRating={starRating}
                      watchDate={watchDate}
                      isLoading={isFetching}
                      onWatchedChange={() => setWatched(prev => !prev)}
                      onLikedChange={() => setLiked(prev => !prev)}
                      onWatchListChange={() => setWatchList(prev => !prev)}
                      onRewatchChange={() => setRewatch(prev => !prev)}
                      onRatingChange={value => setStarRating(value)}
                      onChangeDateMode={mode => showMode(mode)}
                      onPressAddToList={() => {
                        navigation.navigate('ViewList', {
                          imdbId: movieId,
                          title: data.Title,
                          poster: data.Poster,
                        });
                      }}
                      onSaveHandler={async () => {
                        if (data.isLogged && !rewatch) {
                          mutate({
                            id: data.tracked_id,
                            imdb_id: movieId,
                            liked,
                            watched,
                            rating: starRating,
                            watch_list: watchList,
                            watched_date: watchDate.toISOString(),
                            title: data.Title,
                            type,
                          });
                        } else {
                          const response = await refetch();

                          if (response.data?.id) {
                            queryClient.setQueryData<getMovieResponse>(
                              ['getMovie', movieId, type],
                              oldData =>
                                oldData
                                  ? {
                                      ...oldData,
                                      ...response.data,
                                      isLogged: true,
                                    }
                                  : oldData,
                            );
                          }
                        }
                      }}
                    />
                  </BottomSheetModalProvider>
                </>
              )}
            </>
          ) : (
            <Loader />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    backgroundColor: SURFACE_COLORS.PAGE,
    flex: 1,
  },
  icon: {
    width: 50,
    height: 50,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gradient: {
    width: '100%',
    height: 200,
  },
  reviewButton: {
    width: '100%',
    marginVertical: 8,
    marginBottom: 24,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: SURFACE_COLORS.BACKDROP,
  },
  endIconStyle: {
    color: 'white',
    top: 4,
    marginLeft: 4,
  },
});

export default MovieScreen;
