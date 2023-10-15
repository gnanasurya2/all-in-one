import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface searchMoviesParams {
  title: string;
  page: number;
}

export interface SerchMovieResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface searchMoviesResponse {
  Search: Array<SerchMovieResult>;
  totalResults: string;
  Response: string;
  hasMoreData: boolean;
  page: number;
}

const searchMovies = async ({ title, page }: searchMoviesParams) => {
  if (!title) {
    return {
      Search: [],
      totalResults: '',
      hasMoreData: true,
      page: 0,
    };
  }
  console.log('axios', axios.defaults.baseURL);
  try {
    const response = await axios.get<searchMoviesResponse>('/movies/search', {
      params: {
        title,
        page,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const useSearchMovies = ({ title }: { title: string }) => {
  const query = useInfiniteQuery({
    queryKey: ['searchMovies', title],
    queryFn: ({ pageParam = 1 }) => searchMovies({ title, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMoreData) {
        return lastPage.page + 1;
      }
    },
    staleTime: Infinity,
  });
  return query;
};
