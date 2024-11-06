use crate::{
    database::{
        lists,
        movie_lists::{self, ActiveModel, Column},
        prelude::{Lists, MovieLists},
    },
    utils::app_error::AppError,
};
use axum::{http::StatusCode, Extension, Json};
use migration::Expr;
use sea_orm::{
    sea_query::OnConflict, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct AddMovieToListPayload {
    list_ids: Vec<i32>,
    poster: Option<String>,
    imdb_id: String,
    title: String,
}

#[derive(Serialize)]
pub struct AddMovieToListResponse {
    status: String,
}
pub async fn add_movie_to_lists(
    Extension(database): Extension<DatabaseConnection>,
    Json(request_payload): Json<AddMovieToListPayload>,
) -> Result<Json<AddMovieToListResponse>, AppError> {
    let movie_lists_model = request_payload
        .list_ids
        .iter()
        .map(|id| movie_lists::ActiveModel {
            title: Set(request_payload.title.clone()),
            poster: Set(request_payload.poster.clone()),
            imdb_id: Set(request_payload.imdb_id.clone()),
            list_id: Set(*id),
            ..Default::default()
        })
        .collect::<Vec<ActiveModel>>();

    MovieLists::insert_many(movie_lists_model)
        .on_conflict(
            OnConflict::columns([Column::ListId, Column::ImdbId])
                .update_column(Column::Title)
                .to_owned(),
        )
        .exec(&database)
        .await
        .map_err(|err| {
            print!("err {:?}", err);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while adding to db",
            )
        })?;

    Lists::update_many()
        .col_expr(
            lists::Column::NumberOfItems,
            Expr::col(lists::Column::NumberOfItems).add(1),
        )
        .filter(lists::Column::Id.is_in(request_payload.list_ids))
        .exec(&database)
        .await
        .map_err(|err| {
            print!("updating list count err {:?}", err);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while adding to db",
            )
        })?;

    Ok(Json(AddMovieToListResponse {
        status: "SUCCESS".to_owned(),
    }))
}
