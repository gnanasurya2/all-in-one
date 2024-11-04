import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface addTrackedMovieResponse {
  id: number;
  status: string;
  liked: boolean;
  watched: boolean;
  watch_list: boolean;
  rating: number;
  watched_date: string;
  title: string;
}

export type UpdateEpisodeData = {
  season: number;
  episode: number;
  rating: number;
  title: string;
  year: number;
  watchedTime: string;
};

export interface addWatchedEpisodesRequest {
  title: string;
  imdbId: string;
  poster: string;
  episodes: Array<UpdateEpisodeData>;
}

const addWatchedEpisodes = async (props: addWatchedEpisodesRequest) => {
  const response = await axios.post<addTrackedMovieResponse>('/movies/add_watched_series', props);
  return response.data;
};

export const useWatchedEpisodes = (params: addWatchedEpisodesRequest) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: addWatchedEpisodes,
    onSuccess: () => {
      const set = new Set<number>();
      params.episodes.forEach((ele) => {
        set.add(ele.season);
      });

      for (const season of set) {
        queryClient.invalidateQueries({ queryKey: ['getSeasonEpisode', season, params.imdbId] });
      }
    },
  });
  return query;
};
