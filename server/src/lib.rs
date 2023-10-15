mod database;
mod routes;
mod utils;

use routes::create_routes;
use sea_orm::Database;

pub async fn run(database_url: &str) {
    let database = Database::connect(database_url).await.unwrap();

    let app = create_routes(database);

    axum::Server::bind(&"0.0.0.0:1540".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap()
}
