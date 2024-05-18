mod database;
mod routes;
mod scheduler;
mod services;
mod utils;

use std::env;

use log::info;
use routes::create_routes;
use scheduler::backup_scheduler;
use sea_orm::Database;
use tokio::net::TcpListener;

use crate::services::r2::R2Store;

pub async fn run(database_url: &str) {
    info!("database url {}", database_url);
    let database = Database::connect(database_url).await.unwrap();

    let access_key_id = env::var("R2_ACCESS_KEY_ID").unwrap();
    let secret_key_key = env::var("R2_SECRET_ACCESS_KEY").unwrap();
    let account_id = env::var("R2_ACCOUNT_ID").unwrap();
    let bucket_name = env::var("R2_BUCKET_NAME").unwrap();

    let r2_store = R2Store::new(access_key_id, secret_key_key, account_id, bucket_name);
    let _ = backup_scheduler::backup_scheduler(&r2_store).await;

    let app = create_routes(database, r2_store);

    let listener = TcpListener::bind("0.0.0.0:1540").await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap()
}
