import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface loginResponse {
  username: string;
  id: number;
  token: string;
}
const login = async (username: string, password: string) => {
  const response = await axios.post('/user/login', {
    username,
    password,
  });
  return response.data;
};

export const useLogin = ({ username, password }: { username: string; password: string }) => {
  const query = useQuery({
    queryKey: ['login', username],
    queryFn: () => login(username, password),
    staleTime: 0,
  });
};
