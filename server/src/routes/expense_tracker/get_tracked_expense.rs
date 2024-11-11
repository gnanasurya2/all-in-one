use std::str;

use axum::http::StatusCode;
use axum::Json;
use axum::{extract::Query, Extension};
use chrono::{DateTime, Utc};
use sea_orm::sea_query::Expr;
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityOrSelect, EntityTrait, FromQueryResult, QueryFilter,
    QueryOrder, QuerySelect,
};

use log::error;
use serde::{Deserialize, Serialize};

use crate::database::prelude::Expense;
use crate::database::{categories, expense};
use crate::routes::guard::AuthData;
use crate::utils::app_error::AppError;

#[derive(Deserialize)]
pub struct QueryParams {
    month: u32,
    year: i32,
}

#[derive(Debug, FromQueryResult, Serialize)]
pub struct ExpenseResponse {
    id: i32,
    name: Option<String>,
    amount: f32,
    r#type: String,
    created_at: Option<DateTime<Utc>>,
    category: String,
}

#[derive(Serialize)]
pub struct TrackedExpenseResponse {
    data: Vec<ExpenseResponse>,
    total_expense: f32,
    total_income: f32,
}
pub async fn get_tracked_expense(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Query(query): Query<QueryParams>,
) -> Result<Json<TrackedExpenseResponse>, AppError> {
    let mut total_expense = 0.0;
    let mut total_income = 0.0;
    let tracked_expense = Expense::find()
        .find_also_related(categories::Entity)
        .filter(expense::Column::UserId.eq(user.id))
        .filter(
            Expr::cust("MONTH(created_at)")
                .eq(query.month)
                .and(Expr::cust("YEAR(created_at)").eq(query.year)),
        )
        .order_by_desc(expense::Column::CreatedAt)
        .all(&database)
        .await
        .map_err(|err| {
            error!("fetching error {:?}", err);
            AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "error fetching expense")
        })?
        .into_iter()
        .map(|c| {
            if c.0.r#type == "INCOME" {
                total_income = total_income + c.0.amount
            } else {
                total_expense = total_expense + c.0.amount
            }
            ExpenseResponse {
                id: c.0.id,
                name: c.0.name,
                amount: c.0.amount,
                r#type: c.0.r#type,
                created_at: c.0.created_at,
                category: c.1.expect("category not found").name,
            }
        })
        .collect();

    Ok(Json(TrackedExpenseResponse {
        data: tracked_expense,
        total_expense,
        total_income,
    }))
}
