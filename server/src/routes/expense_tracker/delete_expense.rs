use axum::{extract::Path, http::StatusCode, Extension, Json};
use sea_orm::{DatabaseConnection, EntityTrait};
use serde::Serialize;

use crate::{database::expense, utils::app_error::AppError};

#[derive(Serialize)]
pub struct DeleteExpenseResponse {
    message: String,
    id: i32,
}

pub async fn delete_expense(
    Extension(database): Extension<DatabaseConnection>,
    Path(id): Path<i32>,
) -> Result<Json<DeleteExpenseResponse>, AppError> {
    expense::Entity::delete_by_id(id)
        .exec(&database)
        .await
        .map_err(|_| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while deleting expense",
            )
        })?;

    Ok(Json(DeleteExpenseResponse {
        message: "Exepense deleted successfully".to_owned(),
        id,
    }))
}
