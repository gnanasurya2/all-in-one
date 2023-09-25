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

pub async fn get_movies(
    State(client): State<Client>,
    Query(query): Query<QueryParams>,
) -> Result<Json<OmdbResponse>, StatusCode> {
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

    let response: OmdbResponse = serde_json::from_str(body.as_str()).unwrap();
    Ok(Json(response))
}
