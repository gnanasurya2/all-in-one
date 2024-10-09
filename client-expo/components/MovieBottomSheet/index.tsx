import { getMovieResponse } from '@api/movies/getMovies';
import CustomButton from '@components/Button';
import StarRating from '@components/StarRating';
import Text from '@components/Text';
import { BORDERS_COLORS, FONT_SIZE, SURFACE_COLORS, TEXT_COLORS } from '@constants/styles';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
export type datePickerMode = 'date' | 'time';
type MovieBottomSheetProps = {
  data: getMovieResponse;
  watched: boolean;
  liked: boolean;
  watchList: boolean;
  rewatch: boolean;
  starRating: number;
  watchDate: Date;
  isLoading: boolean;
  onWatchedChange: () => void;
  onLikedChange: () => void;
  onWatchListChange: () => void;
  onRewatchChange: () => void;
  onRatingChange: (value: number) => void;
  onChangeDateMode: (mode: datePickerMode) => void;
  onPressAddToList: () => void;
  onSaveHandler: () => void;
};
const MovieBottomSheet = React.forwardRef<BottomSheetModalMethods, MovieBottomSheetProps>(
  (
    {
      data,
      liked,
      watched,
      watchList,
      rewatch,
      starRating,
      watchDate,
      isLoading,
      onWatchedChange,
      onLikedChange,
      onWatchListChange,
      onRewatchChange,
      onRatingChange,
      onChangeDateMode,
      onPressAddToList,
      onSaveHandler,
    },
    ref
  ) => {
    return (
      <View style={styles.container}>
        <BottomSheetModal
          ref={ref}
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
                  onPress={onWatchedChange}
                />
                <Text style={styles.iconText}>{watched ? 'Watched' : 'Watch'}</Text>
              </View>
              <View style={styles.iconTextWrapper}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={60}
                  color={liked ? SURFACE_COLORS.WARNING : SURFACE_COLORS.BACKDROP}
                  onPress={onLikedChange}
                />
                <Text style={styles.iconText}>{liked ? 'Liked' : 'Like'}</Text>
              </View>
              {!data.watched ? (
                <View style={styles.iconTextWrapper}>
                  <MaterialCommunityIcons
                    name={watchList ? 'clock-minus' : 'clock-plus-outline'}
                    size={60}
                    color={watchList ? SURFACE_COLORS.INFORMATION : SURFACE_COLORS.BACKDROP}
                    onPress={onWatchListChange}
                  />
                  <Text style={styles.iconText}>Watchlist</Text>
                </View>
              ) : (
                <View style={styles.iconTextWrapper}>
                  <MaterialCommunityIcons
                    name={'repeat'}
                    size={60}
                    color={rewatch ? SURFACE_COLORS.INFORMATION : SURFACE_COLORS.BACKDROP}
                    onPress={onRewatchChange}
                  />
                  <Text style={styles.iconText}>Rewatch</Text>
                </View>
              )}
            </View>
            <StarRating onChange={onRatingChange} value={starRating} />
            <View style={styles.dateTimeWrapper}>
              <Text style={styles.dateTimeText}>Date</Text>
              <View style={styles.dateTimePressableWrapper}>
                <Pressable onPress={() => onChangeDateMode('date')} style={styles.datePressable}>
                  <Text style={styles.dateText}>
                    {watchDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </Pressable>
                <Pressable onPress={() => onChangeDateMode('time')} style={styles.datePressable}>
                  <Text style={styles.dateText}>
                    {watchDate.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Pressable>
              </View>
            </View>
            <Pressable style={styles.listWrapper} onPress={onPressAddToList}>
              <MaterialIcons name="add" color={TEXT_COLORS.BODY_L2} size={24} />
              <Text style={styles.listText}>Add to lists</Text>
            </Pressable>
            <CustomButton
              title={data.isLogged ? 'update' : 'save'}
              style={styles.saveButton}
              isLoading={isLoading}
              disabled={isLoading}
              onPress={onSaveHandler}
            />
          </View>
        </BottomSheetModal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
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

export default MovieBottomSheet;
