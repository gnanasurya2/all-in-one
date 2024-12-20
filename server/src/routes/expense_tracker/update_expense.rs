use axum::http::StatusCode;
use axum::{Extension, Json};
use chrono::{TimeZone, Utc};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, Set};
use serde::{Deserialize, Serialize};

use crate::database::expense;
use crate::database::prelude::Expense;

use crate::utils::format_date::format_date_utc;
use crate::{routes::guard::AuthData, utils::app_error::AppError};

#[derive(Deserialize)]
pub struct RequestUpdateExpense {
    id: i32,
    name: String,
    amount: f32,
    r#type: String,
    category_id: i32,
    created_at: i64,
}

#[derive(Serialize)]
pub struct ResponseUpdateExpense {
    message: String,
    created_at: String,
}

pub async fn update_expense(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Json(request_body): Json<RequestUpdateExpense>,
) -> Result<Json<ResponseUpdateExpense>, AppError> {
    let mut updated_expense = if let Some(exp) = Expense::find_by_id(request_body.id)
        .filter(expense::Column::UserId.eq(user.id))
        .one(&database)
        .await
        .map_err(|_| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "unable to fetch expense"))?
    {
        exp.into_active_model()
    } else {
        return Err(AppError::new(StatusCode::NOT_FOUND, "Expense not found"));
    };

    let created_date = Utc.timestamp_opt(request_body.created_at, 0).unwrap();

    updated_expense.amount = Set(request_body.amount);
    updated_expense.category_id = Set(request_body.category_id);
    updated_expense.name = Set(Some(request_body.name));
    updated_expense.r#type = Set(request_body.r#type);
    updated_expense.created_at = Set(Some(created_date));

    let new_expense = Expense::update(updated_expense)
        .filter(expense::Column::Id.eq(request_body.id))
        .exec(&database)
        .await
        .map_err(|_| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while updating the expense",
            )
        })?;

    Ok(Json(ResponseUpdateExpense {
        message: "Updated expense".to_owned(),
        created_at: format_date_utc(new_expense.created_at),
    }))
}
