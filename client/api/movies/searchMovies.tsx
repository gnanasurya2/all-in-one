import axios from 'axios';

interface searchMoviesParams {
    title: string,
    page:number,
}

export interface SerchMovieResult {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface searchMoviesResponse {
    Search: Array<SerchMovieResult>;
    totalResults: string;
    Response: string;
}

export const searchMovies = ({
    title,
    page,
}:searchMoviesParams) => {
    return axios.get<searchMoviesResponse>('/movies/search',{
        params: {
            title,
            page,
        },
    });
};
