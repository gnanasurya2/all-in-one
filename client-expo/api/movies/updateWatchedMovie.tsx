import { InfiniteData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { addTrackedMovieResponse } from './addWatchedMovie';
import { getMovieResponse } from './getMovies';
import { getWatchlistMoviesResponse } from './getWatchlistMovies';

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

export const useUpdateTrackedMovie = ({
  id,
  type,
  poster,
}: {
  id: string;
  type: string;
  poster: string;
}) => {
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

      queryClient.setQueryData<InfiniteData<getWatchlistMoviesResponse> | undefined>(
        ['watchlistMovies'],
        (oldData) => {
          if (oldData) {
            if (!data.watch_list) {
              oldData.pages = oldData.pages.map((page) => {
                page.response = page.response.filter((result) => {
                  return result.imdb_id !== id;
                });
                return page;
              });
            } else {
              oldData.pages[0].response.unshift({ imdb_id: id, poster: poster, title: data.title });
            }
          }
          return oldData;
        }
      );
    },
  });
  return query;
};
