mod guard;
mod hello_world;
mod movies_tracker;
mod users;

use axum::routing::post;
use axum::{http::Method, routing::get, Router};
use axum::{middleware, Extension};
use reqwest::Client;
use sea_orm::DatabaseConnection;
use tower_http::cors::{Any, CorsLayer};

use guard::guard;
use hello_world::hello_world;
use movies_tracker::get_movies::get_movies;
use movies_tracker::search_movies::search_movies;
use users::create_users;
use users::login;
use users::logout;

#[derive(Clone)]
pub struct SharedData {
    pub message: String,
}

pub fn create_routes(database: DatabaseConnection) -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    let client = Client::new();

    Router::new()
        .route("/movies/get", get(get_movies))
        .route("/movies/search", get(search_movies))
        .route("/user/logout", post(logout))
        .route_layer(middleware::from_fn(guard))
        .route("/hello", get(hello_world))
        .route("/user/create", post(create_users))
        .route("/user/login", post(login))
        .layer(Extension(client))
        .layer(Extension(database))
        .layer(cors)
}
