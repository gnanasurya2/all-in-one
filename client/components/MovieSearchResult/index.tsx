import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SerchMovieResult} from '../../api/movies';
import {FONT_SIZE, SURFACE_COLORS, TEXT_COLORS, FONT_WEIGHT} from '../../constants/styles';
import Text from '../Text';
import PosterImage from '../PosterImage';

interface MovieSearchResultProps extends SerchMovieResult {
  onPressHandler: (id: string, Type: string) => void;
}

export const MovieSearchResult = ({Title, Poster, Year, onPressHandler, imdbID, Type}: MovieSearchResultProps) => {
  return (
    <Pressable
      style={styles.wrapper}
      android_ripple={{color: SURFACE_COLORS.HIGHLIGHT, foreground: true}}
      onPress={() => onPressHandler(imdbID, Type)}>
      <PosterImage url={Poster} width={100} height={148} />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          {Title}
          <Text style={styles.year}>,{Year}</Text>
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    backgroundColor: SURFACE_COLORS.SECONDARY,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  title: {
    flexWrap: 'wrap',
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.H5,
    color: TEXT_COLORS.HEADING,
  },
  year: {
    color: TEXT_COLORS.BODY_L2,
    fontStyle: 'italic',
    fontSize: FONT_SIZE.H5,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
  },
});
