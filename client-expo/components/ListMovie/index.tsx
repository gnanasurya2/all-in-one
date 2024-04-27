import { Pressable, StyleSheet } from 'react-native';
import Text from '../Text';
import { MoviesInList } from '@api/movies/getMoviesInList';
import PosterImage from '@components/PosterImage';
import { FONT_FAMILY, FONT_WEIGHT } from '@constants/styles';

interface ListMovieProps extends MoviesInList {
  onPressHandler: () => void;
}
const ListMovie = ({ title, poster, onPressHandler }: ListMovieProps) => {
  return (
    <Pressable onPress={onPressHandler} style={styles.wrapper}>
      <PosterImage url={poster} width={100} height={148} />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
  },
});
export default ListMovie;
