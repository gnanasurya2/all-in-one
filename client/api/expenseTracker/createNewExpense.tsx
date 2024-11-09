import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

export interface Expense {
  amount: number;
  category_id: number;
  name: string;
  type: string;
  created_at: number;
}

export interface createNewExpenseResponse {
  message: string;
  created_at: string;
}

async function createExpense(prop: Expense) {
  const response = await axios.post<createNewExpenseResponse>(
    '/expense/create',
    {...prop},
  );
  return response.data;
}

export const useCreateNewExpense = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: createExpense,
    onSuccess: data => {
      const date = new Date(data.created_at);
      queryClient.invalidateQueries({
        queryKey: [
          'getTrackedExpense',
          date.getMonth() + 1,
          date.getFullYear(),
        ],
      });
    },
  });
  return query;
};
