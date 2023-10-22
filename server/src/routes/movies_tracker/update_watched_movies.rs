use crate::database::movies::{self, Entity as Movies};
use crate::utils::type_conversion::i8_to_bool;
use axum::{Extension, Json};
use chrono::{NaiveDateTime, Utc};
use reqwest::StatusCode;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, Set};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct RequestAddWatchedMovie {
    id: i32,
    liked: bool,
    watched: bool,
    watch_list: bool,
    rating: f32,
    watched_date: String,
    title: String,
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

pub async fn update_watched_movies(
    Extension(database): Extension<DatabaseConnection>,
    Json(request_body): Json<RequestAddWatchedMovie>,
) -> Result<Json<ResponseAddWatchedMovie>, StatusCode> {
    let mut watched_movie = if let Some(movie) = Movies::find_by_id(request_body.id)
        .one(&database)
        .await
        .map_err(|_error| StatusCode::INTERNAL_SERVER_ERROR)?
    {
        movie.into_active_model()
    } else {
        return Err(StatusCode::NOT_FOUND);
    };

    watched_movie.liked = Set(Some(request_body.liked as i8));
    watched_movie.watched = Set(Some(request_body.watched as i8));
    watched_movie.watch_list = Set(Some(request_body.watch_list as i8));
    watched_movie.rating = Set(request_body.rating);
    let watched_date =
        NaiveDateTime::parse_from_str(&request_body.watched_date, "%Y-%m-%dT%H:%M:%S%.3fZ")
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    watched_movie.watched_date = Set(Some(watched_date));
    watched_movie.updated_at = Set(Some(Utc::now()));
    watched_movie.title = Set(request_body.title);

    let updated_movie = Movies::update(watched_movie)
        .filter(movies::Column::Id.eq(request_body.id))
        .exec(&database)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let watched_date = match updated_movie.watched_date {
        Some(date) => date.to_string(),
        None => "".to_owned(),
    };
    Ok(Json(ResponseAddWatchedMovie {
        id: updated_movie.id,
        liked: i8_to_bool(updated_movie.liked),
        watched: i8_to_bool(updated_movie.watched),
        watch_list: i8_to_bool(updated_movie.watch_list),
        rating: updated_movie.rating,
        watched_date,
        title: updated_movie.title,
        status: "Sucess".to_owned(),
    }))
}
