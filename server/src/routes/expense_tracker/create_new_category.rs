use axum::{http::StatusCode, Extension, Json};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set, TryIntoModel};
use serde::{Deserialize, Serialize};

use crate::{database::categories, utils::app_error::AppError};

#[derive(Deserialize)]
pub struct RequestCreateCategory {
    name: String,
}

#[derive(Serialize)]
pub struct ResponseCreateCategory {
    id: i32,
    name: String,
}

pub async fn create_new_category(
    Extension(database): Extension<DatabaseConnection>,
    Json(request_payload): Json<RequestCreateCategory>,
) -> Result<Json<ResponseCreateCategory>, AppError> {
    let new_category = categories::ActiveModel {
        name: Set(request_payload.name),
        ..Default::default()
    };

    let result = new_category
        .save(&database)
        .await
        .map_err(|_| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"))?
        .try_into_model()
        .unwrap();

    Ok(Json(ResponseCreateCategory {
        id: result.id,
        name: result.name,
    }))
}
