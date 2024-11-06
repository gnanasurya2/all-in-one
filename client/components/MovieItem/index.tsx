import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import Text from '../Text';
import {FONT_FAMILY} from '../../constants/styles';

interface MovieItemProps {
  title: string;
  poster: string;
  onPressHandler: () => void;
}

const MovieItem = ({title, poster, onPressHandler}: MovieItemProps) => {
  const {width, height} = useWindowDimensions();

  return (
    <View style={{width, height: height + (StatusBar?.currentHeight || 0)}}>
      <ImageBackground
        source={{uri: poster}}
        style={styles.image}
        blurRadius={16}>
        <Pressable style={styles.card} onPress={onPressHandler}>
          <Image style={styles.imageStyles} source={{uri: poster}} />
          <Text style={styles.movieTitle}>{title}</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#33CCCC21',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyles: {aspectRatio: 0.67, width: 160, borderRadius: 8},
  movieTitle: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    color: 'white',
    fontSize: 20,
    marginVertical: 8,
    maxWidth: 280,
  },
});
export default MovieItem;
