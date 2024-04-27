use axum::extract::Query;
use axum::http::StatusCode;
use axum::Json;
use axum::{extract::Path, Extension};
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, FromQueryResult, PaginatorTrait, QueryFilter,
    QueryOrder, QuerySelect,
};
use serde::{Deserialize, Serialize};

use log::error;

use crate::database::movie_lists;
use crate::database::prelude::MovieLists;
use crate::utils::app_error::AppError;
#[derive(Deserialize)]
pub struct QueryParams {
    page: u64,
    page_size: u64,
}

#[derive(Debug, FromQueryResult, Serialize)]
pub struct QueryResultsMovieLists {
    id: i32,
    imdb_id: String,
    poster: Option<String>,
    title: String,
}

#[derive(Serialize)]
pub struct ResponseMoviesInLists {
    response: Vec<QueryResultsMovieLists>,
    has_more: bool,
    page_number: u64,
}

pub async fn get_movie_list(
    Extension(database): Extension<DatabaseConnection>,
    Path(list_id): Path<i32>,
    Query(query): Query<QueryParams>,
) -> Result<Json<ResponseMoviesInLists>, AppError> {
    let movies = MovieLists::find()
        .select_only()
        .columns([
            movie_lists::Column::Id,
            movie_lists::Column::ImdbId,
            movie_lists::Column::Poster,
            movie_lists::Column::Title,
        ])
        .filter(movie_lists::Column::ListId.eq(list_id))
        .order_by_desc(movie_lists::Column::UpdatedAt)
        .into_model::<QueryResultsMovieLists>()
        .paginate(&database, query.page_size)
        .fetch_page(query.page - 1)
        .await
        .map_err(|error| {
            error!("get_movie_list {:?}", error);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error while fetching the movies",
            )
        })?;

    let mut has_more = true;

    if movies.len() != query.page_size as usize {
        has_more = false;
    }

    Ok(Json(ResponseMoviesInLists {
        response: movies,
        has_more,
        page_number: query.page,
    }))
}
