import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface episodeResponse {
  title: string;
  released: string;
  episode: string;
  imdbRating: string;
  imdbId: string;
  liked: boolean | null;
  watched: boolean | null;
  rating: number | null;
  watchedDate: string | null;
  trackedId: number | null;
  isLogged: false;
}

export interface seasonEpisodeResponse {
  title: string;
  season: string;
  totalSeasons: string;
  episodes: Array<episodeResponse>;
}
async function getSeasonEpisodes(seasonId: number, id: string) {
  const response = await axios.get<seasonEpisodeResponse>(`/movies/season/${seasonId}`, {
    params: {
      id,
    },
  });
  return response.data;
}

export const useGetSeasonEpisodes = (params: { seasonId: number; imdbId: string }) => {
  const query = useQuery({
    queryKey: ['getSeasonEpisode', params.seasonId, params.imdbId],
    queryFn: () => getSeasonEpisodes(params.seasonId, params.imdbId),
    staleTime: Infinity,
  });
  return query;
};
