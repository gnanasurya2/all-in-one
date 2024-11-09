use axum::{http::StatusCode, Extension, Json};
use chrono::{DateTime, TimeZone, Utc};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set, TryIntoModel};
use serde::{Deserialize, Serialize};

use log::error;

use crate::{database::expense, routes::guard::AuthData, utils::app_error::AppError};

#[derive(Deserialize)]
pub struct CreateExpenseRequest {
    amount: i32,
    category_id: i32,
    name: String,
    r#type: String,
    created_at: i64,
}

#[derive(Serialize)]
pub struct CreateExpenseResponse {
    message: String,
    created_at: Option<DateTime<Utc>>,
}

pub async fn create_new_expense(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Json(request_payload): Json<CreateExpenseRequest>,
) -> Result<Json<CreateExpenseResponse>, AppError> {
    let created_date = Utc.timestamp_opt(request_payload.created_at, 0).unwrap();

    let new_expense = expense::ActiveModel {
        amount: Set(request_payload.amount as f32),
        user_id: Set(user.id),
        category_id: Set(request_payload.category_id),
        name: Set(Some(request_payload.name)),
        r#type: Set(request_payload.r#type),
        created_at: Set(Some(created_date)),
        ..Default::default()
    };

    let response = new_expense
        .save(&database)
        .await
        .map_err(|err| {
            error!("error {:?}", err);
            AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "error while updating")
        })?
        .try_into_model()
        .map_err(|_| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while converting the model",
            )
        })?;

    Ok(Json(CreateExpenseResponse {
        message: "New Expense created".to_owned(),
        created_at: response.created_at,
    }))
}
