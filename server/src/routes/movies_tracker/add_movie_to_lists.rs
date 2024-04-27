use crate::{
    database::{
        movie_lists::{self, ActiveModel, Column},
        prelude::MovieLists,
    },
    utils::app_error::AppError,
};
use axum::{http::StatusCode, Extension, Json};
use sea_orm::{sea_query::OnConflict, DatabaseConnection, EntityTrait, Set};
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

    Ok(Json(AddMovieToListResponse {
        status: "SUCCESS".to_owned(),
    }))
}
