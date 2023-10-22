import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { addTrackedMovieResponse } from './addWatchedMovie';
import { getMovieResponse } from './getMovies';

export interface updateTrackedMovieResponse {
  id: number;
  status: string;
  liked: boolean;
  watched: boolean;
  watch_list: boolean;
  rating: number;
  watched_date: string;
  title: string;
}

export interface updateTrackedMovieRequest {
  id: number;
  imdb_id: string;
  liked: boolean;
  watched: boolean;
  rating: number;
  watch_list: boolean;
  watched_date: string;
  type: string;
  title: string;
}

const updateTrackedMovie = async (props: updateTrackedMovieRequest) => {
  const response = await axios.patch<updateTrackedMovieResponse>('/movies/update_watched', props);
  return response.data;
};

export const useUpdateTrackedMovie = ({ id, type }: { id: string; type: string }) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: updateTrackedMovie,
    onSuccess: (data) => {
      queryClient.setQueryData<addTrackedMovieResponse>(['addTrackedMovie', id], (oldData) => ({
        ...oldData,
        ...data,
      }));

      queryClient.setQueryData<getMovieResponse>(['getMovie', id, type], (oldData) =>
        oldData
          ? {
              ...oldData,
              ...data,
            }
          : oldData
      );
    },
  });
  return query;
};
