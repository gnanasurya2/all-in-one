use axum::http::StatusCode;
use axum::Json;
use axum::{extract::Query, Extension};
use chrono::NaiveDateTime;
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, FromQueryResult, PaginatorTrait, QueryFilter,
    QueryOrder, QuerySelect,
};
use serde::{Deserialize, Serialize};

use crate::database::movies;
use crate::database::prelude::Movies;
use crate::routes::guard::AuthData;
use crate::utils::app_error::AppError;
use crate::utils::format_date::format_date;
use crate::utils::type_conversion::i8_to_bool;

#[derive(Deserialize)]
pub struct QueryParams {
    page: u64,
    page_size: u64,
}

#[derive(FromQueryResult, Serialize, Deserialize)]
pub struct QueryResultTrackedMovie {
    poster: Option<String>,
    rating: f32,
    watched_date: Option<NaiveDateTime>,
    year: i32,
    imdb_id: String,
    title: String,
    liked: Option<i8>,
    rewatch: Option<i8>,
    r#type: String,
}

#[derive(FromQueryResult, Serialize, Deserialize)]
pub struct ResponseTrackedMovie {
    poster: Option<String>,
    rating: f32,
    watched_date: String,
    year: i32,
    imdb_id: String,
    title: String,
    liked: bool,
    rewatch: bool,
    r#type: String,
}

#[derive(Serialize)]
pub struct ResponseWatchedMovies {
    response: Vec<ResponseTrackedMovie>,
    has_more: bool,
    page_number: u64,
}

pub async fn get_watched_movies(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Query(query): Query<QueryParams>,
) -> Result<Json<ResponseWatchedMovies>, AppError> {
    let tracked_movies: Vec<ResponseTrackedMovie> = Movies::find()
        .select_only()
        .columns([
            movies::Column::Year,
            movies::Column::Poster,
            movies::Column::Rating,
            movies::Column::WatchedDate,
            movies::Column::ImdbId,
            movies::Column::Title,
            movies::Column::Liked,
            movies::Column::Rewatch,
            movies::Column::Type,
        ])
        .filter(movies::Column::UserId.eq(user.id))
        .filter(movies::Column::Watched.eq(1))
        .order_by_desc(movies::Column::WatchedDate)
        .order_by_desc(movies::Column::Season)
        .order_by_desc(movies::Column::Episode)
        .into_model::<QueryResultTrackedMovie>()
        .paginate(&database, query.page_size)
        .fetch_page(query.page - 1)
        .await
        .map_err(|error| {
            println!("{:?}", error);
            AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch data")
        })?
        .into_iter()
        .map(|db_movie| ResponseTrackedMovie {
            poster: db_movie.poster,
            rating: db_movie.rating,
            watched_date: format_date(db_movie.watched_date),
            imdb_id: db_movie.imdb_id,
            year: db_movie.year,
            title: db_movie.title,
            liked: i8_to_bool(db_movie.liked),
            rewatch: i8_to_bool(db_movie.rewatch),
            r#type: db_movie.r#type,
        })
        .collect();

    let mut has_more = true;
    if tracked_movies.len() != query.page_size as usize {
        has_more = false;
    };

    println!("len {}", tracked_movies.len());
    Ok(Json(ResponseWatchedMovies {
        response: tracked_movies,
        has_more,
        page_number: query.page,
    }))
}
