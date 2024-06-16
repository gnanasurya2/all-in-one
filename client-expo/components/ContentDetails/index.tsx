import { getMovieResponse, getSeriesResponse } from '@api/movies/getMovies';
import PosterImage from '@components/PosterImage';
import ShowMore from '@components/ShowMoreComponent';
import Text from '@components/Text';
import { ContentType } from '@constants/enums';
import {
  FONT_SIZE,
  TEXT_COLORS,
  FONT_FAMILY,
  FONT_WEIGHT,
  SURFACE_COLORS,
} from '@constants/styles';
import { View, StyleSheet } from 'react-native';

type ContentDetailsProps = {
  data: getMovieResponse | getSeriesResponse;
};

const ContentDetails = ({ data }: ContentDetailsProps) => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{data.Title}</Text>
          <View style={styles.metaDataWrapper}>
            {data.Type === ContentType.Movies ? (
              <>
                <Text style={styles.directedByTitle}>DIRECTED BY</Text>
                <Text style={styles.directorText}>{data.Director}</Text>
              </>
            ) : (
              <>
                <Text style={styles.directedByTitle}>WRITTEN BY</Text>
                <Text style={styles.directorText}>{data.Writer}</Text>
              </>
            )}

            <Text>
              {data.Year} {data.Runtime}
            </Text>
          </View>
        </View>
        <PosterImage url={data.Poster} width={100} height={148} />
      </View>
      <View style={styles.genreWrapper}>
        {data.Genre.map((item) => (
          <View key={item} style={styles.genre}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      <ShowMore textLimit={250} style={styles.plotText}>
        {data.Plot}
      </ShowMore>
      <Text>{data.Actors.join(',  ')}</Text>

      <Text style={styles.ratingText}>Rating {data.imdbRating}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.H1,
    color: TEXT_COLORS.HEADING,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    textTransform: 'capitalize',
  },
  metaDataWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  directedByTitle: {
    fontSize: FONT_SIZE.H5,
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  directorText: {
    fontSize: FONT_SIZE.H5,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  plotText: {
    marginVertical: 8,
    fontSize: FONT_SIZE.H4,
    color: TEXT_COLORS.BODY_L2,
  },
  genreWrapper: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  genre: {
    backgroundColor: SURFACE_COLORS.BRIGHT_ORANGE,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 40,
  },
});

export default ContentDetails;
