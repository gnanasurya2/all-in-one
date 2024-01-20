import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import Text from '../Text';
import { Image, ImageBackground } from 'expo-image';
import { FONT_FAMILY } from '../../constants/styles';

interface MovieItemProps {
  title: string;
  poster: string;
  onPressHandler: () => void;
}

const MovieItem = ({ title, poster, onPressHandler }: MovieItemProps) => {
  const { width, height } = useWindowDimensions();
  return (
    <View style={[styles.wrapper, { width, height: height - 80 }]}>
      <ImageBackground source={{ uri: poster }} style={styles.image} blurRadius={10}>
        <Pressable style={styles.card} onPress={onPressHandler}>
          <Image style={styles.imageStyles} source={{ uri: poster }} />
          <Text style={styles.movieTitle}>{title}</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'red',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#33CCCC',
    padding: 16,
    borderRadius: 12,
    elevation: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyles: { aspectRatio: 0.67, width: 160, borderRadius: 8 },
  movieTitle: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    color: 'black',
    fontSize: 20,
    marginVertical: 8,
    maxWidth: 280,
  },
});
export default MovieItem;
