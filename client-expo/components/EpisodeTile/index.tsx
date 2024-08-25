import { SURFACE_COLORS, TEXT_COLORS, FONT_FAMILY } from '@constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import Text from '@components/Text';
import { router } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import StarRating from '@components/StarRating';
import DateTimeSelector from '@components/DateTimeSelector';

interface IEpisodeTileProps {
  season: number;
  episode: number;
  rating: number;
  title: string;
  onRatingUpdate: (value: number) => void;
}
const EpisodeTile = ({ season, episode, title, onRatingUpdate, rating }: IEpisodeTileProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.square}>
        <Text style={styles.squareText}>
          S{season} E{episode}
        </Text>
      </View>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.episodeText}>
        {title}
      </Text>
      <StarRating value={rating} onChange={onRatingUpdate} size={14} />
      <DateTimeSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  headerText: {
    color: TEXT_COLORS.HEADING,
    fontSize: 18,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    marginLeft: 16,
  },
  episodeText: {
    flex: 1,
    marginLeft: 8,
  },
  square: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'white',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  squareText: {
    fontWeight: '100',
    fontSize: 16,
    color: 'white',
  },
});

export default EpisodeTile;
