import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  BORDERS_COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  GRADIENT_COLORS,
  SURFACE_COLORS,
  TEXT_COLORS,
} from '../../constants/styles';
import Text from '../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MovieNavigatorStackParamList } from '../../Navigation/MovieApp/MovieAppNavigator';
import { getMovieResponse, useGetMovies } from '../../api/movies/getMovies';
import PosterImage from '../../components/PosterImage';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import StarRating from '../../components/StarRating';
import ShowMore from '../../components/ShowMoreComponent';
import CustomButton from '../../components/Button';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAddTrackedMovie } from '../../api/movies/addWatchedMovie';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useUpdateTrackedMovie } from '../../api/movies/updateWatchedMovie';
import { useQueryClient } from '@tanstack/react-query';

type datePickerMode = 'date' | 'time';

const MovieScreen = ({
  navigation,
  route: {
    params: { movieId, type },
  },
}: NativeStackScreenProps<MovieNavigatorStackParamList, 'Movie'>) => {
  const [watched, setWatched] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchList, setWatchList] = useState(false);
  const [watchDate, setWatchedDate] = useState(new Date());
  const [starRating, setStarRating] = useState(0);
  const { data } = useGetMovies({ id: movieId, type });

  const { mutate } = useUpdateTrackedMovie({ id: movieId, type });
  const {
    data: trackMovieData,
    refetch,
    isFetching,
  } = useAddTrackedMovie({
    imdb_id: movieId,
    liked,
    watch_list: watchList,
    watched,
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
      setWatchedDate(new Date(data.watched_date ?? new Date()));
      setWatchList(data.watch_list ?? false);
    }
  }, [data]);

  const gradientColor = useMemo(() => {
    const hash = movieId.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0);

    return GRADIENT_COLORS[hash % GRADIENT_COLORS.length];
  }, [movieId]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
    <>
      <Pressable
        style={styles.iconWrapper}
        onPress={() => {
          navigation.goBack();
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
              <View style={styles.header}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{data.Title}</Text>
                  <View style={styles.metaDataWrapper}>
                    <Text style={styles.directedByTitle}>DIRECTED BY</Text>
                    <Text style={styles.directorText}>{data.Director}</Text>
                    <Text>
                      {data.Year} {data.Runtime}
                    </Text>
                  </View>
                </View>
                <PosterImage url={data.Poster} width={100} height={148} />
              </View>
              <ShowMore textLimit={250} style={styles.plotText}>
                {data.Plot}
              </ShowMore>
              <Text>{data.Actors.join(',  ')}</Text>
              <Text style={styles.ratingText}>Rating {data.imdbRating}</Text>
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
                    snapPoints={[430]}
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
                        <View style={styles.iconTextWrapper}>
                          <MaterialCommunityIcons
                            name={watchList ? 'clock-minus' : 'clock-plus-outline'}
                            size={60}
                            color={watchList ? SURFACE_COLORS.INFORMATION : SURFACE_COLORS.BACKDROP}
                            onPress={() => setWatchList((prev) => !prev)}
                          />
                          <Text style={styles.iconText}>Watchlist</Text>
                        </View>
                      </View>
                      <StarRating onChange={(value) => setStarRating(value)} value={starRating} />
                      <View style={styles.dateTimeWrapper}>
                        <Text style={styles.dateTimeText}>Date</Text>
                        <View style={styles.dateTimePressableWrapper}>
                          <Pressable onPress={() => showMode('date')} style={styles.datePressable}>
                            <Text style={styles.dateText}>
                              {watchDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </Text>
                          </Pressable>
                          <Pressable onPress={() => showMode('time')} style={styles.datePressable}>
                            <Text style={styles.dateText}>
                              {watchDate.toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                      <CustomButton
                        title={data.isLogged ? 'update' : 'save'}
                        style={styles.saveButton}
                        isLoading={isFetching}
                        disabled={isFetching}
                        onPress={async () => {
                          if (data.isLogged) {
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
          ) : (
            <Text>loading...</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    padding: 8,
    zIndex: 10,
  },
  icon: {
    width: 50,
    height: 50,
    stroke: 'white',
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.H1,
    color: TEXT_COLORS.HEADING,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    textTransform: 'capitalize',
  },
  metaDataWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  directedByTitle: {
    fontSize: FONT_SIZE.H5,
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  directorText: {
    fontSize: FONT_SIZE.H5,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  plotText: {
    marginVertical: 8,
    fontSize: FONT_SIZE.H4,
    color: TEXT_COLORS.BODY_L2,
  },
  ratingText: {
    fontSize: 40,
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
});

export default MovieScreen;
