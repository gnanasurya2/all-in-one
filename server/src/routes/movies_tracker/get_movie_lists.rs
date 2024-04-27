use axum::{extract::Query, http::StatusCode, Extension, Json};
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, FromQueryResult, PaginatorTrait, QueryFilter,
    QueryOrder, QuerySelect,
};
use serde::{Deserialize, Serialize};

use crate::{routes::guard::AuthData, utils::app_error::AppError};

use crate::database::lists;
use crate::database::prelude::Lists;

use log::error;
#[derive(Deserialize)]
pub struct QueryParams {
    page: u64,
    page_size: u64,
}

#[derive(Debug, FromQueryResult, Serialize)]
pub struct QueryResultsLists {
    id: i32,
    title: String,
    description: Option<String>,
    number_of_items: Option<i32>,
}

#[derive(Serialize)]
pub struct ResponseMovieLists {
    response: Vec<QueryResultsLists>,
    has_more: bool,
    page_number: u64,
}
pub async fn get_movie_lists(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Query(query): Query<QueryParams>,
) -> Result<Json<ResponseMovieLists>, AppError> {
    let movie_lists = Lists::find()
        .select_only()
        .columns([
            lists::Column::Id,
            lists::Column::Title,
            lists::Column::Description,
            lists::Column::NumberOfItems,
        ])
        .filter(lists::Column::UserId.eq(user.id))
        .order_by_desc(lists::Column::UpdatedAt)
        .into_model::<QueryResultsLists>()
        .paginate(&database, query.page_size)
        .fetch_page(query.page - 1)
        .await
        .map_err(|error| {
            error!("{:?}", error);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error while fetching the lists",
            )
        })?;

    let mut has_more = true;

    if movie_lists.len() != query.page_size as usize {
        has_more = false;
    }

    Ok(Json(ResponseMovieLists {
        response: movie_lists,
        has_more,
        page_number: query.page,
    }))
}
