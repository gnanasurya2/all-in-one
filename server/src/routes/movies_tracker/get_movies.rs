use axum::{extract::Query, http::StatusCode, Extension, Json};
use itertools::Itertools;
use log::info;
use reqwest::Client;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use std::env;

use crate::database::{movies, prelude::Movies};
use crate::routes::guard::AuthData;
use crate::utils::app_error::AppError;
use crate::utils::format_date::format_date;
use crate::utils::type_conversion::i8_to_bool;

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
#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct OmdbSeriesResponse {
    Title: String,
    Year: String,
    Rated: String,
    Released: String,
    Runtime: String,
    Genre: String,
    Director: String,
    Writer: String,
    Actors: String,
    Plot: String,
    Language: String,
    Country: String,
    Awards: String,
    Poster: String,
    Metascore: String,
    imdbRating: String,
    imdbID: String,
    Type: String,
    totalSeasons: String,
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
    BoxOffice: Option<String>,
    Country: String,
    Director: String,
    Genre: Vec<String>,
    Language: String,
    Plot: String,
    Poster: String,
    Production: Option<String>,
    Rated: String,
    Released: String,
    imdbID: String,
    Type: String,
    imdbRating: String,
    Title: String,
    Runtime: String,
    Year: String,
    NumberOfSeasons: Option<String>,
    Writer: Option<String>,
    liked: Option<bool>,
    watched: Option<bool>,
    watch_list: Option<bool>,
    rating: Option<f32>,
    watched_date: Option<String>,
    tracked_id: Option<i32>,
    isLogged: bool,
}

pub async fn get_movies(
    Extension(client): Extension<Client>,
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Query(query): Query<QueryParams>,
) -> Result<Json<GetMoviesApiResponse>, AppError> {
    let api_key = env::var("OMDB_API_KEY").unwrap();

    let request_url = format!(
        "https://www.omdbapi.com/?apikey={}&i={}&type={}&plot=full",
        api_key, query.id, query.r#type
    );

    info!("{}, {:?},{:?}", request_url, query.id, user.id);

    let response = client
        .get(request_url)
        .send()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    let body = response.text().await.map_err(|_| {
        AppError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Error while parsing the response",
        )
    })?;

    match query.r#type.as_str() {
        "movie" => match serde_json::from_str::<OmdbResponse>(body.as_str()) {
            Ok(response) => {
                let formatted_genre = format_comma_separated_strings(response.Genre);
                let formatter_actors = format_comma_separated_strings(response.Actors);

                let watched_data = Movies::find()
                    .filter(movies::Column::UserId.eq(user.id))
                    .filter(movies::Column::ImdbId.eq(query.id))
                    .one(&database)
                    .await
                    .map_err(|_| {
                        AppError::new(
                            StatusCode::INTERNAL_SERVER_ERROR,
                            "Error while retriving data",
                        )
                    })?;
                let mut final_response = GetMoviesApiResponse {
                    Actors: formatter_actors,
                    Awards: response.Awards,
                    BoxOffice: Some(response.BoxOffice),
                    Country: response.Country,
                    Director: response.Director,
                    Genre: formatted_genre,
                    Language: response.Language,
                    Plot: response.Plot,
                    Production: Some(response.Production),
                    Poster: response.Poster,
                    Rated: response.Rated,
                    Released: response.Released,
                    imdbID: response.imdbID,
                    Type: response.Type,
                    imdbRating: response.imdbRating,
                    Title: response.Title,
                    Runtime: response.Runtime,
                    Year: response.Year,
                    NumberOfSeasons: None,
                    Writer: None,
                    liked: None,
                    watched: None,
                    watch_list: None,
                    rating: None,
                    watched_date: None,
                    isLogged: false,
                    tracked_id: None,
                };

                if let Some(watched_data) = watched_data {
                    final_response.liked = Some(i8_to_bool(watched_data.liked));
                    final_response.watched = Some(i8_to_bool(watched_data.watched));
                    final_response.watch_list = Some(i8_to_bool(watched_data.watch_list));
                    final_response.watched_date = Some(format_date(watched_data.watched_date));
                    final_response.rating = Some(watched_data.rating);
                    final_response.isLogged = true;
                    final_response.tracked_id = Some(watched_data.id);
                }
                Ok(Json(final_response))
            }
            Err(_) => Err(AppError::new(
                StatusCode::EXPECTATION_FAILED,
                "Error while parsing the json",
            )),
        },
        "series" => match serde_json::from_str::<OmdbSeriesResponse>(body.as_str()) {
            Ok(response) => {
                let formatted_genre = format_comma_separated_strings(response.Genre);
                let formatter_actors = format_comma_separated_strings(response.Actors);

                let watched_data = Movies::find()
                    .filter(movies::Column::UserId.eq(user.id))
                    .filter(movies::Column::ImdbId.eq(query.id))
                    .one(&database)
                    .await
                    .map_err(|_| {
                        AppError::new(
                            StatusCode::INTERNAL_SERVER_ERROR,
                            "Error while retriving data",
                        )
                    })?;

                let mut final_response = GetMoviesApiResponse {
                    Actors: formatter_actors,
                    Awards: response.Awards,
                    Country: response.Country,
                    BoxOffice: None,
                    Director: response.Director,
                    Genre: formatted_genre,
                    Language: response.Language,
                    Production: None,
                    Plot: response.Plot,
                    Poster: response.Poster,
                    Rated: response.Rated,
                    Released: response.Released,
                    imdbID: response.imdbID,
                    Type: response.Type,
                    imdbRating: response.imdbRating,
                    Title: response.Title,
                    Runtime: response.Runtime,
                    Year: response.Year,
                    NumberOfSeasons: Some(response.totalSeasons),
                    Writer: Some(response.Writer),
                    liked: None,
                    watched: None,
                    watch_list: None,
                    rating: None,
                    watched_date: None,
                    isLogged: false,
                    tracked_id: None,
                };

                if let Some(watched_data) = watched_data {
                    final_response.liked = Some(i8_to_bool(watched_data.liked));
                    final_response.watched = Some(i8_to_bool(watched_data.watched));
                    final_response.watch_list = Some(i8_to_bool(watched_data.watch_list));
                    final_response.watched_date = Some(format_date(watched_data.watched_date));
                    final_response.rating = Some(watched_data.rating);
                    final_response.isLogged = true;
                    final_response.tracked_id = Some(watched_data.id);
                }
                Ok(Json(final_response))
            }
            Err(_) => Err(AppError::new(
                StatusCode::EXPECTATION_FAILED,
                "Error while parsing the json",
            )),
        },
        _ => {
            return Err(AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Invalid type",
            ))
        }
    }
}

fn format_comma_separated_strings(str: String) -> Vec<String> {
    str.split(",").map(|s| s.trim().to_string()).collect_vec()
}
