mod guard;
mod hello_world;
mod movies_tracker;
mod users;

use axum::routing::{patch, post};
use axum::{http::Method, routing::get, Router};
use axum::{middleware, Extension};
use reqwest::Client;
use sea_orm::DatabaseConnection;
use tower_http::cors::{Any, CorsLayer};

use guard::guard;
use hello_world::hello_world;
use movies_tracker::add_watched_movies::add_watched_movie;
use movies_tracker::get_movies::get_movies;
use movies_tracker::get_watched_movies::get_watched_movies;
use movies_tracker::search_movies::search_movies;
use movies_tracker::update_watched_movies::update_watched_movies;
use users::create_users;
use users::login;
use users::logout;

#[derive(Clone)]
pub struct SharedData {
    pub message: String,
}

pub fn create_routes(database: DatabaseConnection) -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH])
        .allow_origin(Any);

    let client = Client::new();

    Router::new()
        .route("/movies/get", get(get_movies))
        .route("/movies/search", get(search_movies))
        .route("/movies/add_watched", post(add_watched_movie))
        .route("/movies/update_watched", patch(update_watched_movies))
        .route("/movies/get_tracked", get(get_watched_movies))
        .route("/user/logout", post(logout))
        .route_layer(middleware::from_fn(guard))
        .route("/hello", get(hello_world))
        .route("/user/create", post(create_users))
        .route("/user/login", post(login))
        .layer(Extension(client))
        .layer(Extension(database))
        .layer(cors)
}
