import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export interface getMovieResponse {
  Actors: Array<string>;
  Awards: string;
  BoxOffice: string;
  Country: string;
  DVD: string;
  Director: string;
  Language: string;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Released: string;
  MetaScore: string;
  imdbRating: string;
  Title: string;
  Runtime: string;
  Year: string;
  Genre: Array<string>;
}

const getMovie = async (id: string, type: string) => {
  const response = await axios.get<getMovieResponse>('/movies/get', {
    params: {
      id,
      type,
    },
  });
  return response.data;
};

export const useGetMovies = ({id, type}: {id: string; type: string}) => {
  const query = useQuery({
    queryKey: ['getMovie', id, type],
    queryFn: () => getMovie(id, type),
    staleTime: Infinity,
  });
  return query;
};
