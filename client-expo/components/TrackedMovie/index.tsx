import { FontAwesome } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MovieData } from '../../Screens/Movies/HomeScreen';
import { BORDERS_COLORS, SURFACE_COLORS, TEXT_COLORS } from '../../constants/styles';
import PosterImage from '../PosterImage';
import Text from '../Text';

type ITrackedMovieProps = MovieData & {
  onPressHandler: (id: string) => void;
};
const TrackedMovie = ({ onPressHandler, ...props }: ITrackedMovieProps) => {
  if (props.header) {
    return (
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    );
  }
  const rating = useMemo(() => {
    const stars: Array<'star' | 'star-half'> = [];
    let rating = props.rating;
    while (rating >= 1) {
      stars.push('star');
      rating--;
    }
    if (rating === 0.5) {
      stars.push('star-half');
    }
    return stars;
  }, [props.rating]);

  return (
    <Pressable onPress={() => onPressHandler(props.id)}>
      <View style={styles.wrapper}>
        <View style={styles.dayView}>
          <Text style={styles.dayText}>{props.day}</Text>
        </View>
        <PosterImage url={props.poster} width={34} height={50} />
        <View
          style={[
            { flex: 1, height: 60, justifyContent: 'center' },
            props.isLast ? {} : styles.titleViewBorder,
          ]}
        >
          <View style={[styles.titleView]}>
            <View style={styles.titleWrapper}>
              <Text style={styles.movieTitleText}>{props.title}</Text>
              <Text style={styles.yearText}>{props.year}</Text>
            </View>
            <View style={styles.starView}>
              {rating.map((value, index) => (
                <FontAwesome
                  name={value}
                  key={`${props.id}-${index.toString()}`}
                  size={12}
                  color={SURFACE_COLORS.SUCCESS}
                />
              ))}
              {props.liked && <FontAwesome name={'heart'} size={10} style={styles.likedIcon} />}
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
  starView: { flexDirection: 'row', marginTop: 2 },
  titleWrapper: { flexDirection: 'row' },
  movieTitleText: { fontWeight: 'bold' },
  yearText: { marginLeft: 4, color: TEXT_COLORS.BODY_L2 },
  likedIcon: { marginLeft: 8, alignSelf: 'center', color: SURFACE_COLORS.BRIGHT_ORANGE },
});
export default TrackedMovie;
