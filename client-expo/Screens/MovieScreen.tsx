import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  GRADIENT_COLORS,
  SURFACE_COLORS,
  TEXT_COLORS,
} from '../constants/styles';
import Text from '../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MovieApp/MovieAppNavigator';
import { useGetMovies } from '../api/movies/getMovies';
import PosterImage from '../components/PosterImage';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import ShowMore from '../components/ShowMoreComponent';

const MovieScreen = ({
  navigation,
  route: {
    params: { movieId, type },
  },
}: NativeStackScreenProps<RootStackParamList, 'Movie'>) => {
  const { data } = useGetMovies({ id: movieId, type });
  const gradientColor = useMemo(() => {
    const hash = movieId.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0);

    return GRADIENT_COLORS[hash % GRADIENT_COLORS.length];
  }, [movieId]);

  return (
    <>
      <Pressable
        style={styles.iconWrapper}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <FontAwesome5 name="chevron-left" size={24} color="white" />
      </Pressable>
      <ScrollView>
        <LinearGradient
          colors={[`${gradientColor}FF`, `${gradientColor}00`]}
          style={styles.gradient}
        />
        <View style={styles.wrapper}>
          {data ? (
            <>
              <View style={styles.header}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{data.Title}</Text>
                  <View style={styles.metaDataWrapper}>
                    <Text style={styles.directedByTitle}>DIRECTED BY</Text>
                    <Text style={styles.directorText}>{data.Director}</Text>
                    <Text>
                      {data.Year} {data.Runtime}
                    </Text>
                  </View>
                </View>
                <PosterImage url={data.Poster} width={100} height={148} />
              </View>
              <ShowMore textLimit={250} style={styles.plotText}>
                {data.Plot}
              </ShowMore>
              <Text>{data.Actors}</Text>
              <Text style={styles.ratingText}>Rating {data.imdbRating}</Text>
              <StarRating />
            </>
          ) : (
            <Text>loading...</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    padding: 8,
    zIndex: 10,
  },
  icon: {
    width: 50,
    height: 50,
    stroke: 'white',
  },
  wrapper: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.PAGE,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  gradient: {
    width: '100%',
    height: 200,
  },
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
  ratingText: {
    fontSize: 40,
  },
});

export default MovieScreen;
