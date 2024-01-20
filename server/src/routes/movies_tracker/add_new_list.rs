use axum::{http::StatusCode, Extension, Json};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set, TryIntoModel};
use serde::{Deserialize, Serialize};

use crate::{database::lists, routes::guard::AuthData, utils::app_error::AppError};
#[derive(Deserialize)]
pub struct RequestAddNewList {
    title: String,
    description: Option<String>,
}

#[derive(Serialize)]
pub struct ResponseAddNewList {
    id: i32,
    title: String,
    description: Option<String>,
}

pub async fn add_new_list(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Json(request_payload): Json<RequestAddNewList>,
) -> Result<Json<ResponseAddNewList>, AppError> {
    let new_list = lists::ActiveModel {
        title: Set(request_payload.title),
        description: Set(request_payload.description),
        user_id: Set(user.id),
        ..Default::default()
    };

    let result = new_list
        .save(&database)
        .await
        .map_err(|_| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"))?
        .try_into_model()
        .unwrap();

    Ok(Json(ResponseAddNewList {
        id: result.id,
        title: result.title,
        description: result.description,
    }))
}
