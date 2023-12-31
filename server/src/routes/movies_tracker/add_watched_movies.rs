use axum::http::StatusCode;
use axum::{Extension, Json};
use chrono::NaiveDateTime;
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set, TryIntoModel};
use serde::{Deserialize, Serialize};

use crate::database::movies;
use crate::routes::guard::AuthData;
use crate::utils::app_error::AppError;
use crate::utils::format_date::format_date;
use crate::utils::type_conversion::i8_to_bool;

#[derive(Deserialize)]
pub struct RequestAddWatchedMovie {
    imdb_id: String,
    liked: bool,
    watched: bool,
    watch_list: bool,
    rating: f32,
    watched_date: String,
    poster: String,
    title: String,
    year: i32,
}

#[derive(Serialize)]
pub struct ResponseAddWatchedMovie {
    id: i32,
    liked: bool,
    watched: bool,
    watch_list: bool,
    rating: f32,
    watched_date: String,
    status: String,
    title: String,
}

pub async fn add_watched_movie(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Json(request_payload): Json<RequestAddWatchedMovie>,
) -> Result<Json<ResponseAddWatchedMovie>, AppError> {
    let watched_date =
        NaiveDateTime::parse_from_str(&request_payload.watched_date, "%Y-%m-%dT%H:%M:%S%.3fZ")
            .map_err(|_| {
                AppError::new(
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while parsing the string",
                )
            })?;

    let new_movie_log = movies::ActiveModel {
        imdb_id: Set(request_payload.imdb_id),
        liked: Set(Some(request_payload.liked as i8)),
        watched: Set(Some(request_payload.watched as i8)),
        watch_list: Set(Some(request_payload.watch_list as i8)),
        user_id: Set(user.id),
        rating: Set(request_payload.rating),
        watched_date: Set(Some(watched_date)),
        poster: Set(Some(request_payload.poster)),
        year: Set(request_payload.year),
        title: Set(request_payload.title),
        ..Default::default()
    };

    let result = new_movie_log
        .save(&database)
        .await
        .map_err(|_| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"))?
        .try_into_model()
        .unwrap();

    let watched_date = format_date(result.watched_date);

    Ok(Json(ResponseAddWatchedMovie {
        id: result.id,
        status: "SUCCESS".to_owned(),
        liked: i8_to_bool(result.liked),
        watched: i8_to_bool(result.watched),
        watch_list: i8_to_bool(result.watch_list),
        rating: result.rating,
        watched_date,
        title: result.title,
    }))
}
