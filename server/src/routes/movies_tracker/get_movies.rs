use axum::{
    extract::{Query, State},
    Json,
};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::env;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
struct RatingType {
    Source: String,
    Value: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct OmdbResponse {
    Actors: String,
    Awards: String,
    BoxOffice: String,
    Country: String,
    DVD: String,
    Director: String,
    Genre: String,
    Language: String,
    Plot: String,
    Poster: String,
    Production: String,
    Rated: String,
    Released: String,
    Metascore: String,
    imdbID: String,
    Type: String,
    imdbRating: String,
    Title: String,
    Runtime: String,
    Year: String,
}

#[derive(Serialize, Deserialize)]
pub struct QueryParams {
    id: String,
    r#type: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct GetMoviesApiResponse {
    Actors: Vec<String>,
    Awards: String,
    BoxOffice: String,
    Country: String,
    Director: String,
    Genre: Vec<String>,
    Language: String,
    Plot: String,
    Poster: String,
    Production: String,
    Rated: String,
    Released: String,
    imdbID: String,
    Type: String,
    imdbRating: String,
    Title: String,
    Runtime: String,
    Year: String,
}
pub async fn get_movies(
    State(client): State<Client>,
    Query(query): Query<QueryParams>,
) -> Result<Json<GetMoviesApiResponse>, StatusCode> {
    let api_key = env::var("OMDB_API_KEY").unwrap();

    let request_url = format!(
        "https://www.omdbapi.com/?apikey={}&i={}&type={}&plot=full",
        api_key, query.id, query.r#type
    );

    println!("{}", request_url);

    let response = client
        .get(request_url)
        .send()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let body = response
        .text()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match serde_json::from_str::<OmdbResponse>(body.as_str()) {
        Ok(response) => {
            let formatted_genre = response
                .Genre
                .split(",")
                .map(|s| s.trim().to_string())
                .collect();
            let formatter_actors = response
                .Actors
                .split(",")
                .map(|s| s.trim().to_string())
                .collect();

            let final_response = GetMoviesApiResponse {
                Actors: formatter_actors,
                Awards: response.Awards,
                BoxOffice: response.BoxOffice,
                Country: response.Country,
                Director: response.Director,
                Genre: formatted_genre,
                Language: response.Language,
                Plot: response.Plot,
                Production: response.Production,
                Poster: response.Poster,
                Rated: response.Rated,
                Released: response.Released,
                imdbID: response.imdbID,
                Type: response.Type,
                imdbRating: response.imdbRating,
                Title: response.Title,
                Runtime: response.Runtime,
                Year: response.Year,
            };
            Ok(Json(final_response))
        }
        Err(_) => Err(StatusCode::EXPECTATION_FAILED),
    }
}
