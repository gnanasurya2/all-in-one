import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  BORDERS_COLORS,
  SURFACE_COLORS,
  TEXT_COLORS,
} from '../../constants/styles';
import PosterImage from '../PosterImage';
import Text from '../Text';
// import { MovieData } from '../../app/(app)/movies';
import {ContentType} from '../../constants/enums';
import {MovieData} from '../../Screens/Movies/HomeScreen';

type ITrackedMovieProps = MovieData & {
  onPressHandler: (id: string, type: ContentType) => void;
};
const TrackedMovie = ({onPressHandler, ...props}: ITrackedMovieProps) => {
  const currentRating = useMemo(() => {
    if (props.header) {
      return [];
    }
    const stars: Array<'star' | 'star-half'> = [];
    let newRating = props.rating;
    while (newRating >= 1) {
      stars.push('star');
      newRating--;
    }
    if (newRating === 0.5) {
      stars.push('star-half');
    }
    return stars;
  }, [props?.rating, props.header]);

  if (props.header) {
    return (
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={() => onPressHandler(props.id, props.type)}>
      <View style={styles.wrapper}>
        <View style={styles.dayView}>
          <Text style={styles.dayText}>{props.day}</Text>
        </View>
        <PosterImage url={props.poster} width={34} height={50} />
        <View
          style={[
            styles.contentWrapper,
            props.isLast ? {} : styles.titleViewBorder,
          ]}>
          <View style={styles.titleView}>
            <View style={styles.titleWrapper}>
              <Text style={styles.movieTitleText}>{props.title}</Text>
              <Text style={styles.yearText}>{props.year}</Text>
            </View>
            <View style={styles.starView}>
              {currentRating.map((value, index) => (
                <FontAwesome
                  name={value}
                  key={`${props.id}-${index.toString()}`}
                  size={12}
                  color={SURFACE_COLORS.SUCCESS}
                />
              ))}
              {props.liked && (
                <FontAwesome
                  name={'heart'}
                  size={10}
                  style={styles.likedIcon}
                />
              )}
              {props.rewatch ? (
                <MaterialCommunityIcons
                  name="repeat-variant"
                  size={16}
                  color={SURFACE_COLORS.BACKDROP}
                />
              ) : null}
              {props.type === 'series' ? (
                <Ionicons name="tv-sharp" size={16} style={styles.seriesIcon} />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: SURFACE_COLORS.HIGHLIGHT,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingLeft: 12,
  },
  wrapper: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 14,
  },
  contentWrapper: {flex: 1, height: 60, justifyContent: 'center'},
  dayView: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: BORDERS_COLORS.SECONDARY,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dayText: {
    fontWeight: '100',
    fontSize: 16,
    color: TEXT_COLORS.BODY_L2,
  },
  titleView: {
    marginLeft: 8,
    height: 50,
    justifyContent: 'center',
  },
  titleViewBorder: {
    marginLeft: 4,
    borderBottomWidth: 1,
    borderColor: BORDERS_COLORS.SECONDARY,
  },
  starView: {flexDirection: 'row', marginTop: 2, alignItems: 'center'},
  titleWrapper: {
    flexDirection: 'row',
    paddingRight: 8,
    justifyContent: 'space-between',
  },
  movieTitleText: {fontWeight: 'bold', flex: 1},
  yearText: {marginHorizontal: 8, color: TEXT_COLORS.BODY_L2},
  likedIcon: {
    marginHorizontal: 4,
    alignSelf: 'center',
    color: SURFACE_COLORS.BRIGHT_ORANGE,
  },
  seriesIcon: {
    alignSelf: 'center',
    marginHorizontal: 4,
    color: SURFACE_COLORS.INFORMATION,
  },
});
export default TrackedMovie;
