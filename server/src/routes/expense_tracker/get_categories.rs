use axum::http::StatusCode;
use axum::{Extension, Json};
use sea_orm::{DatabaseConnection, EntityOrSelect, EntityTrait, FromQueryResult};
use serde::Serialize;

use crate::database::prelude::Categories;

use crate::utils::app_error::AppError;

#[derive(Debug, FromQueryResult, Serialize)]
pub struct Category {
    id: i32,
    name: String,
}

#[derive(Serialize)]
pub struct CategoryResponse {
    data: Vec<Category>,
}

pub async fn get_categories(
    Extension(database): Extension<DatabaseConnection>,
) -> Result<Json<CategoryResponse>, AppError> {
    let categories_result = Categories::find()
        .select()
        .all(&database)
        .await
        .map_err(|_| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error fetching categories",
            )
        })?
        .into_iter()
        .map(|c| Category {
            id: c.id,
            name: c.name,
        })
        .collect();

    Ok(Json(CategoryResponse {
        data: categories_result,
    }))
}
