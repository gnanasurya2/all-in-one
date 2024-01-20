use axum::{extract::Path, Extension};
use reqwest::Client;
use sea_orm::DatabaseConnection;

pub async fn get_movie_list(
    Extension(client): Extension<Client>,
    Extension(database): Extension<DatabaseConnection>,
    Path(list_id): Path<i32>,
) -> String {
    list_id.to_string()
}
