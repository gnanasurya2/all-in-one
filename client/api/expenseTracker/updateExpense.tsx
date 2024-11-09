import {useQueryClient, useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {Expense} from './createNewExpense';

export interface UpdateExpense extends Expense {
  id: number;
}

export interface UpdateExpenseResponse {
  message: string;
  created_at: string;
}

async function updateExpense(prop: UpdateExpense) {
  const response = await axios.patch<UpdateExpenseResponse>(
    '/expense/update_expense',
    {
      ...prop,
    },
  );
  return response.data;
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: updateExpense,
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
