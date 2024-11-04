import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { BORDERS_COLORS } from '../../constants/styles';

interface WatchlistMovieProps {
  poster: string;
  onPresshandler: (id: string) => void;
  id: string;
}
const WatchlistMovie = ({ poster, onPresshandler, id }: WatchlistMovieProps) => {
  return (
    <Pressable onPress={() => onPresshandler(id)} style={styles.wrapper}>
      <Image source={{ uri: poster }} style={styles.posterImage} />
    </Pressable>
  );
};

export default WatchlistMovie;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: BORDERS_COLORS.PRIMARY,
    width: '24%',
    marginHorizontal: 2,
    aspectRatio: 0.676,
  },
  posterImage: { width: '100%', height: '100%', gap: 16 },
});
