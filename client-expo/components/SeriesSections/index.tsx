import { useGetSeasonEpisodes } from '@api/movies/getSeasonEpisodes';
import { TEXT_COLORS } from '@constants/styles';
import { useMemo, useRef, useState } from 'react';
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

type SeriesSectionsProps = {
  numberOfSeasons: string;
  imdbId: string;
};

type EpisodeState = {
  [key: string]: { watched: boolean };
};
type ContentElementProps = {
  item: string;
  index: number;
  visibleIndex: SharedValue<number>;
  sectionCardsRef: React.RefObject<FlatList<unknown>>;
};

const useSelectedStyle = (selectedItem: SharedValue<number>, item: number) =>
  useAnimatedStyle(() => ({
    fontWeight: selectedItem.value === item ? '600' : '400',
    borderBottomWidth: selectedItem.value === item ? 1 : 0,
  }));

const ContentsElement = ({ index, sectionCardsRef, visibleIndex, item }: ContentElementProps) => {
  const seletedStyle = useSelectedStyle(visibleIndex, index);
  return (
    <Pressable
      onPress={() => {
        sectionCardsRef.current?.scrollToIndex({ index, animated: true });
        visibleIndex.value = index;
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
  onPressHandler: (season: number, episode: string) => void;
  episodeState: EpisodeState;
}) => {
  const { data, isLoading } = useGetSeasonEpisodes({ seasonId, imdbId });

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      {data?.episodes.map((item) => (
        <Episode
          key={item.episode}
          episodeNumber={item.episode}
          title={item.title}
          watched={item.watched || episodeState[`${seasonId}-${item.episode}`]?.watched}
          width={width}
          onPressHandler={() => onPressHandler(seasonId, item.episode)}
        />
      ))}
    </ScrollView>
  );
};

const SeriesSections = ({ numberOfSeasons, imdbId }: SeriesSectionsProps) => {
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
  const [episodeState, setEpisodeState] = useState<EpisodeState>({});

  return (
    <>
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
          />
        )}
        ref={tableOfContentsRef}
      />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={seasonNames}
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
            {visibleIndex.value === index ? (
              <Episodes
                seasonId={index + 1}
                imdbId={imdbId}
                width={dimensions.width}
                onPressHandler={(season, episode) =>
                  setEpisodeState((prev) => ({
                    ...prev,
                    [`${season}-${episode}`]: {
                      watched: !prev[`${season}-${episode}`]?.watched,
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
    </>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 600,
  },
  tableOfContentsElement: {
    padding: 4,
    marginHorizontal: 4,
    margin: 8,
    overflow: 'hidden',
    color: TEXT_COLORS.BODY_L1,
    borderBottomColor: TEXT_COLORS.SUCCESS,
  },
});

export default SeriesSections;
