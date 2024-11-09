import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: string;
  created_at: string;
  category: string;
}

export interface getTrackedExpensesResponse {
  data: Array<Expense>;
  total_expense: number;
  total_income: number;
}

async function getTrackedExpenses(month: number, year: number) {
  const response = await axios.get<getTrackedExpensesResponse>(
    '/expense/get_tracked',
    {
      params: {month, year},
    },
  );

  return {
    data: response.data.data.map(ele => ({
      id: ele.id,
      date: new Date(ele.created_at).getTime(),
      amount: ele.amount,
      title: ele.name,
      category: ele.category,
      isIncome: ele.type === 'INCOME',
    })),
    total_income: response.data.total_income,
    total_expense: response.data.total_expense,
  };
}

export const useGetTrackedExpenses = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const query = useQuery({
    queryKey: ['getTrackedExpense', month, year],
    queryFn: () => getTrackedExpenses(month, year),
    staleTime: Infinity,
  });

  return query;
};
