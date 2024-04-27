mod database;
mod routes;
mod utils;

use log::info;
use routes::create_routes;
use sea_orm::Database;
use tokio::net::TcpListener;

pub async fn run(database_url: &str) {
    info!("database url {}", database_url);
    let database = Database::connect(database_url).await.unwrap();

    let app = create_routes(database);

    let listener = TcpListener::bind("0.0.0.0:1540").await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap()
}
