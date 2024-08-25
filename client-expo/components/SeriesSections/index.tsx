import { useGetSeasonEpisodes } from '@api/movies/getSeasonEpisodes';
import CustomButton from '@components/Button';
import { TEXT_COLORS } from '@constants/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Episode from './Episode';
import { router, useFocusEffect } from 'expo-router';
import WatchedEpisode from './WatchedEpisode';

type SeriesSectionsProps = {
  numberOfSeasons: string;
  imdbId: string;
  title: string;
};

type EpisodeState = {
  [key: string]: { watched: boolean; title: string };
};
type ContentElementProps = {
  item: string;
  index: number;
  visibleIndex: SharedValue<number>;
  setSelectedSeason: React.Dispatch<React.SetStateAction<number>>;
  sectionCardsRef: React.RefObject<FlatList<unknown>>;
};

const useSelectedStyle = (selectedItem: SharedValue<number>, item: number) =>
  useAnimatedStyle(() => ({
    fontWeight: selectedItem.value === item ? '600' : '400',
    borderBottomWidth: selectedItem.value === item ? 1 : 0,
  }));

const ContentsElement = ({
  index,
  sectionCardsRef,
  visibleIndex,
  item,
  setSelectedSeason,
}: ContentElementProps) => {
  const seletedStyle = useSelectedStyle(visibleIndex, index);
  return (
    <Pressable
      onPress={() => {
        sectionCardsRef.current?.scrollToIndex({ index, animated: true });
        visibleIndex.value = index;
        setSelectedSeason(index);
      }}
      style={[styles.tableOfContentsElement]}
    >
      <Animated.Text style={[seletedStyle, styles.tableOfContentsElement]}>{item}</Animated.Text>
    </Pressable>
  );
};

const Episodes = ({
  seasonId,
  imdbId,
  width,
  onPressHandler,
  episodeState,
}: {
  seasonId: number;
  imdbId: string;
  width: number;
  onPressHandler: (season: number, episode: string, title: string) => void;
  episodeState: EpisodeState;
}) => {
  const { data, isLoading } = useGetSeasonEpisodes({ seasonId, imdbId });

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      {data?.episodes.map((item) =>
        item.watched ? (
          <WatchedEpisode
            key={item.episode}
            episodeNumber={item.episode}
            title={item.title}
            watched={item.watched || episodeState[`${seasonId}-${item.episode}`]?.watched}
            width={width}
            rating={item.rating}
            time={item.watchedDate}
          />
        ) : (
          <Episode
            key={item.episode}
            episodeNumber={item.episode}
            title={item.title}
            watched={item.watched || episodeState[`${seasonId}-${item.episode}`]?.watched}
            width={width}
            onPressHandler={() => onPressHandler(seasonId, item.episode, item.title)}
          />
        )
      )}
    </ScrollView>
  );
};

const SeriesSections = ({ numberOfSeasons, imdbId, title }: SeriesSectionsProps) => {
  const dimensions = useWindowDimensions();
  const seasonNames: Array<string> = useMemo(() => {
    const names = [];
    for (let i = 1; i <= parseInt(numberOfSeasons || '0'); i++) {
      names.push(`Season ${i}`);
    }
    return names;
  }, [numberOfSeasons]);
  const tableOfContentsRef = useRef<FlatList>(null);
  const sectionCardRef = useRef<FlatList>(null);
  const visibleIndex = useSharedValue(0);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [episodeState, setEpisodeState] = useState<EpisodeState>({});
  const [isNewlyWatched, setIsNewlyWatched] = useState(false);

  useEffect(() => {
    let isNewEpisode = false;
    for (let watchedState in episodeState) {
      if (episodeState[watchedState].watched) {
        isNewEpisode = true;
        break;
      }
    }
    setIsNewlyWatched(isNewEpisode);
  }, [episodeState]);

  useFocusEffect(
    useCallback(() => {
      setEpisodeState({});
      setSelectedSeason(0);
      visibleIndex.value = 0;
    }, [])
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonWrapper}>
        {isNewlyWatched ? (
          <CustomButton
            title="Update"
            style={styles.button}
            onPress={() => {
              router.push({
                pathname: '/(app)/movies/seriesUpdate',
                params: {
                  data: JSON.stringify(episodeState),
                  imdbId,
                  title,
                },
              });
            }}
          />
        ) : null}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={seasonNames}
        renderItem={({ item, index }) => (
          <ContentsElement
            index={index}
            item={item}
            visibleIndex={visibleIndex}
            sectionCardsRef={sectionCardRef}
            setSelectedSeason={setSelectedSeason}
          />
        )}
        ref={tableOfContentsRef}
      />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={seasonNames}
        style={{ flex: 1 }}
        onScrollToIndexFailed={({ index }): void => {
          sectionCardRef.current?.scrollToOffset({
            animated: true,
            offset: index * dimensions.width,
          });
        }}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: dimensions.width,
              minHeight: dimensions.height - 50,
              // maxHeight: dimensions.height - 50,
              flex: 1,
            }}
          >
            {selectedSeason === index ? (
              <Episodes
                seasonId={selectedSeason + 1}
                imdbId={imdbId}
                width={dimensions.width}
                onPressHandler={(season, episode, title) =>
                  setEpisodeState((prev) => ({
                    ...prev,
                    [`${season}-${episode}`]: {
                      watched: !prev[`${season}-${episode}`]?.watched,
                      title,
                    },
                  }))
                }
                episodeState={episodeState}
              />
            ) : (
              <ActivityIndicator />
            )}
          </View>
        )}
        ref={sectionCardRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableOfContentsElement: {
    padding: 4,
    marginHorizontal: 4,
    margin: 8,
    overflow: 'hidden',
    color: TEXT_COLORS.BODY_L1,
    borderBottomColor: TEXT_COLORS.SUCCESS,
  },
  button: {
    marginVertical: 16,
    alignSelf: 'center',
    width: '100%',
  },
  buttonWrapper: {
    height: 90,
  },
});

export default SeriesSections;
