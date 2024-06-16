import Text from '@components/Text';
import { BORDERS_COLORS, SURFACE_COLORS, TEXT_COLORS } from '@constants/styles';
import { Pressable, StyleSheet, View } from 'react-native';

type EpisodeProps = {
  episodeNumber: string;
  title: string;
  watched: boolean | null;
  width: number;
  onPressHandler: () => void;
};
const Episode = ({ width, title, episodeNumber, onPressHandler, watched }: EpisodeProps) => {
  return (
    <Pressable onPress={onPressHandler}>
      <View
        style={[
          styles.wrapper,
          { width: width - 32 },
          watched ? { backgroundColor: SURFACE_COLORS.SUCCESS } : {},
        ]}
      >
        <View style={[styles.dayView, watched ? { borderColor: 'white' } : {}]}>
          <Text style={[styles.dayText, watched ? { color: 'white' } : {}]}>{episodeNumber}</Text>
        </View>
        <Text>{title}</Text>
      </View>
    </Pressable>
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
