import Text from '@components/Text';
import { SURFACE_COLORS, TEXT_COLORS } from '@constants/styles';
import { FontAwesome } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type EpisodeProps = {
  episodeNumber: string;
  title: string;
  watched: boolean | null;
  width: number;
  rating: number | null;
  time: string | null;
};
const WatchedEpisode = ({ width, title, episodeNumber, time, rating }: EpisodeProps) => {
  const watchedDate = useMemo(() => {
    if (time) {
      const date = new Date(time);
      return `${date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      })}`;
    }
    return '';
  }, [time]);
  return (
    <View style={[styles.wrapper, { width: width - 32 }]}>
      <View style={styles.dayView}>
        <Text style={styles.dayText}>{episodeNumber}</Text>
      </View>
      <Text style={{ flex: 1 }}>{title}</Text>
      <Text style={{ marginRight: 4 }}>{rating}</Text>
      <FontAwesome size={16} color={SURFACE_COLORS.PAGE} name="star" />
      <Text style={{ marginLeft: 16 }}>{watchedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    width: '100%',
    backgroundColor: SURFACE_COLORS.SUCCESS,
    marginBottom: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayView: {
    borderWidth: 1,
    borderRadius: 4,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    marginRight: 16,
  },
  dayText: {
    fontWeight: '100',
    fontSize: 16,
    color: 'white',
  },
});
export default WatchedEpisode;
