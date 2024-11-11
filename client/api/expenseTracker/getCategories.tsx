import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export interface Category {
  id: number;
  name: string;
}

export interface getCategoriesResponse {
  data: Array<Category>;
}

async function getCategories() {
  const response = await axios.get<getCategoriesResponse>(
    '/expense/categories',
  );
  return response.data;
}

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ['getCategories'],
    queryFn: () => getCategories(),
    staleTime: Infinity,
  });

  return query;
};
