use std::collections::HashSet;

use axum::{http::StatusCode, Extension, Json};
use chrono::{Datelike, TimeZone, Utc};
use sea_orm::{DatabaseConnection, EntityTrait, Set};
use serde::{Deserialize, Serialize};

use crate::{
    database::{
        expense::{self, ActiveModel},
        prelude::Expense,
    },
    routes::guard::AuthData,
    utils::app_error::AppError,
};

#[derive(Deserialize)]
pub struct ExpenseRequest {
    amount: i32,
    category_id: i32,
    name: String,
    r#type: String,
    created_at: i64,
}

#[derive(Deserialize)]
pub struct CreateExpenseRequest {
    data: Vec<ExpenseRequest>,
}

#[derive(Serialize)]
pub struct CreateExpenseResponse {
    message: String,
    updated_months: Vec<i64>,
}

pub async fn create_new_expense(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Json(request_payload): Json<CreateExpenseRequest>,
) -> Result<Json<CreateExpenseResponse>, AppError> {
    let mut updated_months = HashSet::new();

    let new_expense_list = request_payload
        .data
        .iter()
        .map(|item| {
            let created_date = Utc.timestamp_opt(item.created_at, 0).unwrap();

            updated_months.insert(created_date.with_day0(0).unwrap().timestamp_millis());

            return expense::ActiveModel {
                amount: Set(item.amount as f32),
                user_id: Set(user.id),
                category_id: Set(item.category_id),
                name: Set(Some(item.name.clone())),
                r#type: Set(item.r#type.clone()),
                created_at: Set(Some(created_date)),
                ..Default::default()
            };
        })
        .collect::<Vec<ActiveModel>>();

    Expense::insert_many(new_expense_list)
        .exec(&database)
        .await
        .map_err(|err| {
            print!("err {:?}", err);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while adding to db",
            )
        })?;

    Ok(Json(CreateExpenseResponse {
        message: "New Expense created".to_owned(),
        updated_months: Vec::from_iter(updated_months),
    }))
}
