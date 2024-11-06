import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

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
    onSuccess: async (_, request) => {
      for (let id of request.list_ids) {
        await queryClient.invalidateQueries({
          queryKey: ['getMovieInLists', id],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ['getMovieLists'],
      });
    },
  });
  return query;
};
