import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

export interface Expense {
  amount: number;
  category_id: number;
  name: string;
  type: string;
  created_at: number;
}

export interface createNewExpenseRequest {
  data: Array<Expense>;
}
export interface createNewExpenseResponse {
  message: string;
  updated_months: Array<number>;
}

async function createExpense(prop: createNewExpenseRequest) {
  console.log('data', prop);
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
      data.updated_months.forEach(month => {
        const date = new Date(month);
        queryClient.invalidateQueries({
          queryKey: [
            'getTrackedExpense',
            date.getMonth() + 1,
            date.getFullYear(),
          ],
        });
      });
      queryClient.invalidateQueries({
        queryKey: ['getLastUpdatedTimeStamp'],
      });
    },
    onError: error => {
      console.log('error while updating', error.name);
    },
  });
  return query;
};
