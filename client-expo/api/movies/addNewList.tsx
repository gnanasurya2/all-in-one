import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface addNewListRequest {
  title: string;
  description: string;
}

export interface addNewListResponse {
  id: number;
  title: string;
  description?: string;
}

const addNewList = async (props: addNewListRequest) => {
  const response = await axios.post<addNewListResponse>('/movies/lists/add', props);
  return response.data;
};

export const useAddNewList = () => {
  const query = useMutation({
    mutationFn: addNewList,
  });
  return query;
};
