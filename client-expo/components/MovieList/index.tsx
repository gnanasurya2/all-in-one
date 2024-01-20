import React from 'react';
import Text from '../Text';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { FONT_FAMILY, FONT_WEIGHT, TEXT_COLORS } from '../../constants/styles';
import PosterImage from '../PosterImage';

type MovieListProps = {
  title: string;
  numberOfFilms: number;
  description: string;
  onPressHandler: () => void;
  onPosterPressHandler: (id: string) => void;
  posters: Array<{
    url: string;
    imdb_id: string;
  }>;
};
const MovieList = ({
  title,
  numberOfFilms,
  description,
  onPressHandler,
  onPosterPressHandler,
  posters,
}: MovieListProps) => {
  return (
    <>
      <Pressable style={styles.wrapper} onPress={onPressHandler}>
        <View style={styles.titleWrapper}>
          <Text style={styles.listTitle}>{title}</Text>
          <Text style={styles.numberStyles}>{numberOfFilms} films</Text>
        </View>
      </Pressable>
      <FlatList
        data={posters}
        horizontal
        renderItem={({ item }) => (
          <Pressable onPress={() => onPosterPressHandler(item.imdb_id)}>
            <PosterImage url={item.url} width={67} height={100} style={styles.poster} />
          </Pressable>
        )}
      />
      <Pressable style={styles.wrapper} onPress={onPressHandler}>
        <Text style={styles.description}>{description}</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listTitle: {
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  numberStyles: {
    fontWeight: FONT_WEIGHT.LIGHT,
    color: TEXT_COLORS.BODY_L2,
  },
  description: {
    color: TEXT_COLORS.BODY_L1,
  },
  poster: {
    borderWidth: 0,
  },
});
export default MovieList;
