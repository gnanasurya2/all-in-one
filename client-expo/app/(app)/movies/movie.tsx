import { useAddTrackedMovie } from '@api/movies/addWatchedMovie';
import { getMovieResponse, useGetMovies } from '@api/movies/getMovies';
import { useUpdateTrackedMovie } from '@api/movies/updateWatchedMovie';
import CustomButton from '@components/Button';
import Loader from '@components/Loader';
import StarRating from '@components/StarRating';
import Text from '@components/Text';
import {
  BORDERS_COLORS,
  FONT_SIZE,
  GRADIENT_COLORS,
  SURFACE_COLORS,
  TEXT_COLORS,
} from '@constants/styles';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { movieStartTime } from '../../../utils/movieStartTime';
import { ContentType } from '@constants/enums';
import ContentDetails from '@components/ContentDetails';
import SeriesSections from '@components/SeriesSections';

type datePickerMode = 'date' | 'time';

const MovieScreen = () => {
  const [watched, setWatched] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchList, setWatchList] = useState(false);
  const [rewatch, setRewatch] = useState(false);
  const [watchDate, setWatchedDate] = useState(new Date());
  const [starRating, setStarRating] = useState(0);
  const { id: movieId = '', type = ContentType.Movies } = useLocalSearchParams<{
    id: string;
    type: ContentType;
  }>();
  const { data, isLoading } = useGetMovies({ id: movieId, type });

  const { mutate, isSuccess } = useUpdateTrackedMovie({
    id: movieId,
    type,
    poster: data?.Poster || '',
  });
  const { refetch, isFetching } = useAddTrackedMovie({
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
      setWatchedDate(new Date(data.watched_date ?? movieStartTime(data.Runtime)));
      setWatchList(data.watch_list ?? false);
    }
  }, [data]);

  const gradientColor = useMemo(() => {
    const hash = movieId.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0);

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
      <Pressable
        style={styles.iconWrapper}
        onPress={() => {
          router.back();
        }}
      >
        <FontAwesome5 name="chevron-left" size={24} color="white" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={[`${gradientColor}FF`, `${gradientColor}00`]}
          style={styles.gradient}
        />
        <View style={styles.wrapper}>
          {data ? (
            <>
              <ContentDetails data={data} />
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
                    <View style={styles.container}>
                      <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={[500]}
                        handleIndicatorStyle={{
                          backgroundColor: 'white',
                        }}
                        handleStyle={styles.handleStyle}
                      >
                        <View style={styles.contentContainer}>
                          <View style={styles.titleContainer}>
                            <Text style={styles.modalTitle}>{data.Title}</Text>
                            <Text style={styles.modalSubTitle}>{data.Year}</Text>
                          </View>
                          <View style={styles.iconsContainer}>
                            <View style={styles.iconTextWrapper}>
                              <Ionicons
                                name={watched ? 'eye-sharp' : 'eye-outline'}
                                size={60}
                                color={watched ? SURFACE_COLORS.SUCCESS : SURFACE_COLORS.BACKDROP}
                                onPress={() => setWatched((prev) => !prev)}
                              />
                              <Text style={styles.iconText}>{watched ? 'Watched' : 'Watch'}</Text>
                            </View>
                            <View style={styles.iconTextWrapper}>
                              <Ionicons
                                name={liked ? 'heart' : 'heart-outline'}
                                size={60}
                                color={liked ? SURFACE_COLORS.WARNING : SURFACE_COLORS.BACKDROP}
                                onPress={() => setLiked((prev) => !prev)}
                              />
                              <Text style={styles.iconText}>{liked ? 'Liked' : 'Like'}</Text>
                            </View>
                            {!data.watched ? (
                              <View style={styles.iconTextWrapper}>
                                <MaterialCommunityIcons
                                  name={watchList ? 'clock-minus' : 'clock-plus-outline'}
                                  size={60}
                                  color={
                                    watchList ? SURFACE_COLORS.INFORMATION : SURFACE_COLORS.BACKDROP
                                  }
                                  onPress={() => setWatchList((prev) => !prev)}
                                />
                                <Text style={styles.iconText}>Watchlist</Text>
                              </View>
                            ) : (
                              <View style={styles.iconTextWrapper}>
                                <MaterialCommunityIcons
                                  name={'repeat'}
                                  size={60}
                                  color={
                                    rewatch ? SURFACE_COLORS.INFORMATION : SURFACE_COLORS.BACKDROP
                                  }
                                  onPress={() => setRewatch((prev) => !prev)}
                                />
                                <Text style={styles.iconText}>Rewatch</Text>
                              </View>
                            )}
                          </View>
                          <StarRating
                            onChange={(value) => setStarRating(value)}
                            value={starRating}
                          />
                          <View style={styles.dateTimeWrapper}>
                            <Text style={styles.dateTimeText}>Date</Text>
                            <View style={styles.dateTimePressableWrapper}>
                              <Pressable
                                onPress={() => showMode('date')}
                                style={styles.datePressable}
                              >
                                <Text style={styles.dateText}>
                                  {watchDate.toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </Text>
                              </Pressable>
                              <Pressable
                                onPress={() => showMode('time')}
                                style={styles.datePressable}
                              >
                                <Text style={styles.dateText}>
                                  {watchDate.toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                          <Pressable
                            style={styles.listWrapper}
                            onPress={() => {
                              router.push({
                                pathname: '/(app)/movies/viewLists',
                                params: {
                                  imdbId: movieId,
                                  title: data.Title,
                                  poster: data.Poster,
                                },
                              });
                            }}
                          >
                            <MaterialIcons name="add" color={TEXT_COLORS.BODY_L2} size={24} />
                            <Text style={styles.listText}>Add to lists</Text>
                          </Pressable>
                          <CustomButton
                            title={data.isLogged ? 'update' : 'save'}
                            style={styles.saveButton}
                            isLoading={isFetching}
                            disabled={isFetching}
                            onPress={async () => {
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
                                    (oldData) =>
                                      oldData
                                        ? {
                                            ...oldData,
                                            ...response.data,
                                            isLogged: true,
                                          }
                                        : oldData
                                  );
                                }
                              }
                            }}
                          />
                        </View>
                      </BottomSheetModal>
                    </View>
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
  iconWrapper: {
    position: 'absolute',
    padding: 8,
    zIndex: 10,
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
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: SURFACE_COLORS.BACKDROP,
  },
  endIconStyle: {
    color: 'black',
    top: 4,
    marginLeft: 4,
  },
  container: {
    flex: 1,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.MODAL,
  },
  handleStyle: {
    backgroundColor: SURFACE_COLORS.MODAL,
    borderWidth: 0,
    borderColor: SURFACE_COLORS.MODAL,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  modalTitle: {
    marginLeft: 8,
    fontSize: FONT_SIZE.H3,
  },
  modalSubTitle: {
    marginLeft: 8,
    fontSize: FONT_SIZE.H5,
    color: TEXT_COLORS.BODY_L2,
  },
  titleContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderBottomColor: BORDERS_COLORS.PRIMARY,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS_COLORS.PRIMARY,
  },
  iconTextWrapper: {
    alignItems: 'center',
    width: 80,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '200',
    color: SURFACE_COLORS.BACKDROP,
  },
  saveButton: { alignSelf: 'center', paddingVertical: 12, borderRadius: 8, marginVertical: 16 },
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: BORDERS_COLORS.PRIMARY,
  },
  dateTimePressableWrapper: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  datePressable: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  dateTimeText: { fontSize: FONT_SIZE.H3, color: 'white', marginLeft: 12 },
  dateText: { fontSize: FONT_SIZE.H3, color: TEXT_COLORS.BODY_L2 },
  listWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderColor: BORDERS_COLORS.PRIMARY,
  },
  listText: {
    color: TEXT_COLORS.BODY_L2,
    marginLeft: 4,
    fontSize: 16,
  },
});

export default MovieScreen;
