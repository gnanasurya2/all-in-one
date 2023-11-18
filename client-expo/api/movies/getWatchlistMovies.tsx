import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface getWatchlistMoviesParams {
  page: number;
  page_size: number;
}

export interface WatchlistMovieType {
  poster: string;
  imdb_id: string;
  title: string;
}

export interface getWatchlistMoviesResponse {
  response: Array<WatchlistMovieType>;
  has_more: boolean;
  page_number: number;
}

const getWatchlistMovies = async (params: getWatchlistMoviesParams) => {
  try {
    const response = await axios.get<getWatchlistMoviesResponse>('movies/get_watchlist', {
      params,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const useGetWatchlistMovies = (params: { page_size: number }) => {
  const query = useInfiniteQuery({
    queryKey: ['watchlistMovies'],
    queryFn: ({ pageParam = 1 }) =>
      getWatchlistMovies({ page: pageParam, page_size: params.page_size }),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return lastPage.page_number + 1;
      }
    },
    staleTime: Infinity,
  });
  return query;
};
