import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GetMovieListsResponse } from './getMovieLists';

export interface addMovieToListRequest {
  list_ids: Array<number>;
  poster: string;
  imdb_id: string;
  title: string;
}

export interface addMovieToListResoponse {
  status: string;
}

const addMovieToList = async (props: addMovieToListRequest) => {
  const response = await axios.post('/movies/add_to_list', props);
  return response.data;
};

export const useAddMovieToList = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: addMovieToList,
    onSuccess: (_, request) => {
      queryClient.invalidateQueries(['getMoviesForLists', request.list_ids]);
    },
  });
  return query;
};
