import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface GetMovieInListsRequest {
  page?: number;
  listId?: number;
}

export type MoviesInList = {
  id: number;
  imdb_id: string;
  title: string;
  poster: string;
};

export interface GetMovieListsResponse {
  response: Array<MoviesInList>;
  has_more: boolean;
  page_number: number;
}

const getMoviesInLists = async ({
  page,
  listId,
}: GetMovieInListsRequest): Promise<GetMovieListsResponse> => {
  if (!listId) {
    return {
      response: [],
      has_more: false,
      page_number: 1,
    };
  }
  const response = await axios.get<GetMovieListsResponse>(`/movies/lists/${listId}`, {
    params: { page, page_size: 20 },
  });

  return response.data;
};

export const useMoviesInLists = ({ listId }: GetMovieInListsRequest) => {
  const query = useInfiniteQuery({
    queryKey: ['getMovieInLists', listId],
    queryFn: ({ pageParam = 1 }) => getMoviesInLists({ page: pageParam, listId }),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return lastPage.page_number + 1;
      }
    },
    staleTime: Infinity,
  });
  return query;
};
