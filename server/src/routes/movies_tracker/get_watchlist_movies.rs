use axum::{extract::Query, Extension, Json};
use reqwest::StatusCode;
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, FromQueryResult, PaginatorTrait, QueryFilter,
    QueryOrder, QuerySelect,
};
use serde::{Deserialize, Serialize};

use crate::database::movies::{self, Entity as Movies};
use crate::{database::users::Model, utils::app_error::AppError};

#[derive(Deserialize)]
pub struct QueryParams {
    page: u64,
    page_size: u64,
}

#[derive(FromQueryResult, Serialize, Deserialize)]
pub struct ResponseWatchlistMovie {
    poster: Option<String>,
    imdb_id: String,
    title: String,
}

#[derive(Serialize)]
pub struct ResponseWatchlistMovies {
    response: Vec<ResponseWatchlistMovie>,
    has_more: bool,
    page_number: u64,
}
pub async fn get_watchlist_movies(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<Model>,
    Query(query): Query<QueryParams>,
) -> Result<Json<ResponseWatchlistMovies>, AppError> {
    let watchlist_movies: Vec<ResponseWatchlistMovie> = Movies::find()
        .select_only()
        .columns([
            movies::Column::ImdbId,
            movies::Column::Poster,
            movies::Column::Title,
        ])
        .filter(movies::Column::UserId.eq(user.id))
        .filter(movies::Column::WatchList.eq(1))
        .order_by_desc(movies::Column::UpdatedAt)
        .into_model::<ResponseWatchlistMovie>()
        .paginate(&database, query.page_size)
        .fetch_page(query.page - 1)
        .await
        .map_err(|_error| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to fetch data from database",
            )
        })?
        .into_iter()
        .collect();
    let mut has_more = true;
    if watchlist_movies.len() != query.page_size as usize {
        has_more = false;
    }

    Ok(Json(ResponseWatchlistMovies {
        response: watchlist_movies,
        has_more,
        page_number: query.page_size,
    }))
}
