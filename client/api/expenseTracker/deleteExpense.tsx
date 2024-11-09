import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

async function deleteExpense(id: number) {
  const response = await axios.delete<{message: string; id: number}>(
    `/expense/${id}`,
  );
  return response.data;
}

export const useDeleteExpense = (month: number, year: number) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: deleteExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['getTrackedExpense', month, year],
      });
    },
  });
  return query;
};
