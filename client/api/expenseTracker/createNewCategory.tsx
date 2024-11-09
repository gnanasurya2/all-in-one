import axios from 'axios';
import {Category} from './getCategories';
import {useMutation, useQueryClient} from '@tanstack/react-query';

const createNewCategory = async (name: string) => {
  const response = await axios.post<Category>('/expense/category/create', {
    name,
  });
  return response.data;
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: createNewCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['getCategories'],
      });
    },
  });
  return query;
};
