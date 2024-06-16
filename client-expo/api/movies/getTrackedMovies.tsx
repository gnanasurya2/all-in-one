import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface getTrackedMoviesParams {
  page: number;
  page_size: number;
}

export interface TrackedMovie {
  poster: string;
  rating: number;
  watched_date: string;
  year: number;
  imdb_id: string;
  title: string;
  liked: boolean;
  rewatch: boolean;
}

export interface getTrackedMoviesResponse {
  response: Array<TrackedMovie>;
  has_more: boolean;
  page_number: number;
}
const getTrackedMovies = async (params: getTrackedMoviesParams) => {
  try {
    const response = await axios.get<getTrackedMoviesResponse>('/movies/get_tracked', {
      params,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const useGetTrackedMovies = (params: { page_size: number }) => {
  const query = useInfiniteQuery({
    queryKey: ['trackedMovies'],
    queryFn: ({ pageParam = 1 }) =>
      getTrackedMovies({ page: pageParam, page_size: params.page_size }),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return lastPage.page_number + 1;
      }
    },
    staleTime: Infinity,
  });
  return query;
};
