import { ContentType } from '@constants/enums';
import { useQuery } from '@tanstack/react-query';
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
  liked: boolean | null;
  watched: boolean | null;
  watch_list: boolean | null;
  rating: number | null;
  watched_date: string | null;
  isLogged: boolean;
  tracked_id: number;
  Type: ContentType.Movies;
}

export interface getSeriesResponse {
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
  liked: boolean | null;
  watched: boolean | null;
  watch_list: boolean | null;
  rating: number | null;
  watched_date: string | null;
  isLogged: boolean;
  tracked_id: number;
  Type: ContentType.Series;
  NumberOfSeasons: string;
  Writer: string;
}

async function getMovie(id: string, type: ContentType) {
  const response = await axios.get<getMovieResponse | getSeriesResponse>('/movies/get', {
    params: {
      id,
      type,
    },
  });
  return response.data;
}

export const useGetMovies = ({ id, type }: { id: string; type: ContentType }) => {
  const query = useQuery({
    queryKey: ['getMovie', id, type],
    queryFn: () => getMovie(id, type),
    staleTime: Infinity,
  });
  return query;
};
