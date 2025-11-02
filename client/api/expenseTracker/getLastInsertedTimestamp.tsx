import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

interface LastInsertedTimestampResponse {
  timestamp: string;
}

async function lastInsertedTimestamp() {
  const response = await axios.get<LastInsertedTimestampResponse>(
    '/expense/get_last_inserted_timestamp',
  );
  return response.data;
}

export const useGetLastInsertedTimestamp = () => {
  const query = useQuery({
    queryKey: ['getLastUpdatedTimeStamp'],
    queryFn: () => lastInsertedTimestamp(),
    staleTime: Infinity,
  });
  return query;
};
