import React from 'react';
import { UpdateEpisodeData, useWatchedEpisodes } from '../../api/movies/addWatchedEpisodes';
import EpisodeTile from '../../components/EpisodeTile';
import Header from '../../components/Header';
import Button from '../../components/Button';

import { SURFACE_COLORS } from '../../constants/styles';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MovieDrawerParamList } from '../../navigation/MovieNavigator';

const SeriesUpdateScreen = ({
  navigation,
  route: { params: routeData },
}: DrawerScreenProps<MovieDrawerParamList, 'SeriesUpdate'>) => {
  const [episodeData, setEpisodeData] = useState<Array<UpdateEpisodeData>>([]);

  const { mutateAsync, isPending } = useWatchedEpisodes({
    title: routeData.title as string,
    episodes: episodeData,
    imdbId: routeData.imdbId as string,
    poster: routeData.poster as string,
  });

  useEffect(() => {
    if (typeof routeData.data === 'string') {
      const parsedData = JSON.parse(routeData.data);
      const updatedData = Object.keys(parsedData)
        .filter((ele) => parsedData[ele].watched)
        .map((ele) => {
          const [season, episode] = ele.split('-');
          return {
            season: parseInt(season, 10),
            episode: parseInt(episode, 10),
            title: parsedData[ele].title,
            year: parsedData[ele].year,
            rating: 0,
            watchedTime: new Date().toISOString(),
          };
        });
      setEpisodeData(updatedData);
    }
  }, [routeData.data]);

  const updateEpisodes = async () => {
    await mutateAsync({
      title: routeData.title as string,
      episodes: episodeData,
      imdbId: routeData.imdbId as string,
      poster: routeData.poster as string,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.outerWrapper}>
      <Header title="Update Episodes" />
      <FlatList
        data={episodeData}
        keyExtractor={(item) => `${item.season}-${item.episode}`}
        renderItem={({ item, index }) => (
          <EpisodeTile
            {...item}
            date={new Date(item.watchedTime)}
            onRatingUpdate={(value) => {
              setEpisodeData((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], rating: value };
                return updated;
              });
            }}
            onDateChange={
              (value) => {
              setEpisodeData((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], watchedTime: value.toISOString() };
                return updated;
              });
            }
            }
          />
        )}
      />
      <Button
        title="Save"
        isLoading={isPending}
        onPress={() => updateEpisodes()}
        style={{
          width: '100%',
          borderRadius: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    backgroundColor: SURFACE_COLORS.PAGE,
    flex: 1,
  },
});

export default SeriesUpdateScreen;
