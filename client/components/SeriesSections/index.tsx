import React from 'react';
import {useGetSeasonEpisodes} from '../../api/movies/getSeasonEpisodes';
import CustomButton from '../Button';
import {TEXT_COLORS} from '../../constants/styles';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {runOnJS, useAnimatedStyle} from 'react-native-reanimated';
import Episode from './Episode';
import WatchedEpisode from './WatchedEpisode';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {MovieDrawerParamList} from '../../navigation/MovieNavigator';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

type SeriesSectionsProps = {
  numberOfSeasons: string;
  imdbId: string;
  title: string;
  poster: string;
};

type EpisodeState = {
  [key: string]: {watched: boolean; title: string; year: number};
};
type ContentElementProps = {
  item: string;
  index: number;
  selectedSeason: number;
  setSelectedSeason: React.Dispatch<React.SetStateAction<number>>;
};

const useSelectedStyle = (selectedItem: number, item: number) =>
  useAnimatedStyle(() => ({
    fontWeight: selectedItem === item ? '600' : '400',
    borderBottomWidth: selectedItem === item ? 1 : 0,
  }));

const ContentsElement = ({
  index,
  item,
  selectedSeason,
  setSelectedSeason,
}: ContentElementProps) => {
  const seletedStyle = useSelectedStyle(selectedSeason, index);
  return (
    <Pressable
      onPress={() => {
        setSelectedSeason(index);
      }}
      style={[styles.tableOfContentsElement]}>
      <Animated.Text style={[seletedStyle, styles.tableOfContentsElement]}>
        {item}
      </Animated.Text>
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
  onPressHandler: (
    season: number,
    episode: string,
    title: string,
    year: number,
  ) => void;
  episodeState: EpisodeState;
}) => {
  const {data, isLoading} = useGetSeasonEpisodes({seasonId, imdbId});

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      {data?.episodes.map(item =>
        item.watched ? (
          <WatchedEpisode
            key={item.episode}
            episodeNumber={item.episode}
            title={item.title}
            watched={
              item.watched ||
              episodeState[`${seasonId}-${item.episode}`]?.watched
            }
            width={width}
            rating={item.rating}
            time={item.watchedDate}
          />
        ) : (
          <Episode
            key={item.episode}
            episodeNumber={item.episode}
            title={item.title}
            watched={
              item.watched ||
              episodeState[`${seasonId}-${item.episode}`]?.watched
            }
            width={width}
            onPressHandler={() =>
              onPressHandler(
                seasonId,
                item.episode,
                item.title,
                parseInt(item.released.split('-')[0] || '0', 10),
              )
            }
          />
        ),
      )}
    </ScrollView>
  );
};

const SeriesSections = ({
  numberOfSeasons,
  imdbId,
  title,
  poster,
}: SeriesSectionsProps) => {
  const navigation =
    useNavigation<DrawerNavigationProp<MovieDrawerParamList>>();
  const dimensions = useWindowDimensions();
  const seasonNames: Array<string> = useMemo(() => {
    const names = [];
    for (let i = 1; i <= parseInt(numberOfSeasons || '0'); i++) {
      names.push(`Season ${i}`);
    }
    return names;
  }, [numberOfSeasons]);
  const tableOfContentsRef = useRef<FlatList>(null);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [episodeState, setEpisodeState] = useState<EpisodeState>({});
  const [isNewlyWatched, setIsNewlyWatched] = useState(false);

  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      if (selectedSeason !== 0) {
        runOnJS(setSelectedSeason)(selectedSeason - 1);
      }
    });

  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      if (selectedSeason !== parseInt(numberOfSeasons, 10) - 1) {
        runOnJS(setSelectedSeason)(selectedSeason + 1);
      }
    });

  const composed = Gesture.Simultaneous(rightGesture, leftGesture);

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
    }, []),
  );

  useEffect(() => {
    tableOfContentsRef?.current?.scrollToIndex({
      index: selectedSeason,
      animated: true,
    });
  }, [selectedSeason]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.buttonWrapper}>
        {isNewlyWatched ? (
          <CustomButton
            title="Update"
            style={styles.button}
            onPress={() => {
              navigation.navigate('SeriesUpdate', {
                data: JSON.stringify(episodeState),
                imdbId,
                title,
                poster,
              });
            }}
          />
        ) : null}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={seasonNames}
        renderItem={({item, index}) => (
          <ContentsElement
            index={index}
            item={item}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
          />
        )}
        ref={tableOfContentsRef}
      />
      <GestureDetector gesture={composed}>
        <View
          style={{
            width: dimensions.width,
            minHeight: dimensions.height - 50,
            // maxHeight: dimensions.height - 50,
            flex: 1,
          }}>
          <Episodes
            seasonId={selectedSeason + 1}
            imdbId={imdbId}
            width={dimensions.width}
            onPressHandler={(season, episode, title, year) => {
              setEpisodeState(prev => ({
                ...prev,
                [`${season}-${episode}`]: {
                  watched: !prev[`${season}-${episode}`]?.watched,
                  title,
                  year,
                },
              }));
            }}
            episodeState={episodeState}
          />
        </View>
      </GestureDetector>
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
