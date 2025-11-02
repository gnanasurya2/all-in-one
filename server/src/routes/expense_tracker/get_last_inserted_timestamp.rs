use axum::http::StatusCode;
use axum::{Extension, Json};
use chrono::{DateTime, Utc};
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, FromQueryResult, QueryFilter, QueryOrder,
    QuerySelect,
};
use serde::{Deserialize, Serialize};

use crate::database::expense;
use crate::database::prelude::Expense;
use crate::{routes::guard::AuthData, utils::app_error::AppError};

#[derive(FromQueryResult, Serialize, Deserialize)]
pub struct QueryInsertedExpense {
    created_at: Option<DateTime<Utc>>,
}

#[derive(Serialize)]
pub struct GetLastInsertedTimstampResponse {
    timestamp: Option<DateTime<Utc>>,
}
pub async fn get_last_inserted_timestamp(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
) -> Result<Json<GetLastInsertedTimstampResponse>, AppError> {
    let inserted_query = Expense::find()
        .select_only()
        .column(expense::Column::CreatedAt)
        .filter(expense::Column::UserId.eq(user.id));

    let last_item = inserted_query
        .order_by_desc(expense::Column::CreatedAt)
        .into_model::<QueryInsertedExpense>()
        .one(&database)
        .await
        .map_err(|err| {
            println!("db err {:?}", err);
            AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch data")
        })?;

    if let Some(data) = last_item {
        Ok(Json(GetLastInsertedTimstampResponse {
            timestamp: data.created_at,
        }))
    } else {
        Err(AppError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "data not found",
        ))
    }
}
