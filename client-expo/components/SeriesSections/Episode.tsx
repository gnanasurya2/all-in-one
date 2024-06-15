import Text from '@components/Text';
import { BORDERS_COLORS, SURFACE_COLORS, TEXT_COLORS } from '@constants/styles';
import { StyleSheet, View } from 'react-native';

type EpisodeProps = {
  episodeNumber: string;
  title: string;
  watched: boolean | null;
  width: number;
};
const Episode = ({ width, title, episodeNumber }: EpisodeProps) => {
  return (
    <View style={[styles.wrapper, { width: width - 32 }]}>
      <View style={styles.dayView}>
        <Text style={styles.dayText}>{episodeNumber}</Text>
      </View>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    width: '100%',
    backgroundColor: SURFACE_COLORS.SECONDARY,
    marginBottom: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayView: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: TEXT_COLORS.BODY_L2,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dayText: {
    fontWeight: '100',
    fontSize: 16,
    color: TEXT_COLORS.BODY_L2,
  },
});
export default Episode;
