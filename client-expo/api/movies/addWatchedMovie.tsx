import { useQuery } from '@tanstack/react-query';
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

export interface addTrackedMovieRequest {
  imdb_id: string;
  liked: boolean;
  watched: boolean;
  rating: number;
  watch_list: boolean;
  watched_date: string;
  poster: string;
  year: number;
  title: string;
}

const addTrackedMovie = async (props: addTrackedMovieRequest) => {
  const response = await axios.post<addTrackedMovieResponse>('/movies/add_watched', props);
  return response.data;
};

export const useAddTrackedMovie = (params: addTrackedMovieRequest) => {
  const query = useQuery({
    queryKey: ['addTrackedMovie', params.imdb_id],
    queryFn: () => addTrackedMovie(params),
    staleTime: Infinity,
    enabled: false,
  });
  return query;
};
