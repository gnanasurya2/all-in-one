import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface GetMovieListsRequest {
  page: number;
}

export type MovieList = {
  data: {
    list_id: number;
    list_name: string;
    description: string;
  };
  posters: Array<{
    url: string;
    imdb_id: string;
  }>;
};

export interface GetMovieListsResponse {
  response: Array<MovieList>;
  has_more: boolean;
  page_number: number;
}
const getMovieLists = async ({ page }: GetMovieListsRequest) => {
  const response = await axios.get<GetMovieListsResponse>('/movies/lists', {
    params: { page, page_size: 20 },
  });

  return response.data;
};

export const useMovieLists = () => {
  const query = useInfiniteQuery({
    queryKey: ['getMovieLists'],
    queryFn: ({ pageParam = 1 }) => getMovieLists({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return lastPage.page_number + 1;
      }
    },
    staleTime: Infinity,
  });
  return query;
};
