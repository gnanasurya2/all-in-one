import { UpdateEpisodeData, useWatchedEpisodes } from '@api/movies/addWatchedEpisodes';
import EpisodeTile from '@components/EpisodeTile';
import Header from '@components/Header';
import Button from '@components/Button';

import { SURFACE_COLORS } from '@constants/styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const SeriesUpdateScreen = () => {
  const routeData = useLocalSearchParams();
  const [episodeData, setEpisodeData] = useState<Array<UpdateEpisodeData>>([]);
  const { mutateAsync, isLoading } = useWatchedEpisodes({
    title: routeData.title as string,
    episodes: episodeData,
    imdbId: routeData.imdbId as string,
  });
  useEffect(() => {
    if (typeof routeData.data === 'string') {
      const parsedData = JSON.parse(routeData.data);
      const updatedData = Object.keys(parsedData)
        .filter((ele) => parsedData[ele].watched)
        .map((ele) => {
          const [season, episode] = ele.split('-');
          return {
            season: parseInt(season),
            episode: parseInt(episode),
            title: parsedData[ele].title,
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
    });
    router.back();
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
            onRatingUpdate={(value) => {
              setEpisodeData((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], rating: value };
                return updated;
              });
            }}
          />
        )}
      />
      <Button
        title="Save"
        isLoading={isLoading}
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
