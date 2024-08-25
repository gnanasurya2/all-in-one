mod backup;
mod expense_tracker;
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

use backup::trigger_backup::trigger_backup;
use expense_tracker::get_tracked_expense::get_tracked_expense;
use guard::guard;
use hello_world::hello_world;
use movies_tracker::add_movie_to_lists::add_movie_to_lists;
use movies_tracker::add_new_list::add_new_list;
use movies_tracker::add_watched_episodes::add_watched_episodes;
use movies_tracker::add_watched_movies::add_watched_movie;
use movies_tracker::get_movie_list::get_movie_list;
use movies_tracker::get_movie_lists::get_movie_lists;
use movies_tracker::get_movies::get_movies;
use movies_tracker::get_season_details::get_season_details;
use movies_tracker::get_watched_movies::get_watched_movies;
use movies_tracker::get_watchlist_movies::get_watchlist_movies;
use movies_tracker::search_movies::search_movies;
use movies_tracker::update_watched_movies::update_watched_movies;

use users::create_users;
use users::login;
use users::logout;

use crate::services::r2::R2Store;

#[derive(Clone)]
pub struct SharedData {
    pub message: String,
}

pub fn create_routes(database: DatabaseConnection, r2_store: R2Store) -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH])
        .allow_origin(Any);

    let client = Client::new();

    Router::new()
        .route("/backup/trigger", post(trigger_backup))
        .layer(Extension(r2_store))
        .route("/movies/get", get(get_movies))
        .route("/movies/search", get(search_movies))
        .route("/movies/add_watched", post(add_watched_movie))
        .route("/movies/add_watched_series", post(add_watched_episodes))
        .route("/movies/update_watched", patch(update_watched_movies))
        .route("/movies/get_tracked", get(get_watched_movies))
        .route("/movies/get_watchlist", get(get_watchlist_movies))
        .route("/movies/add_to_list", post(add_movie_to_lists))
        .route("/movies/lists/add", post(add_new_list))
        .route("/movies/lists", get(get_movie_lists))
        .route("/movies/lists/:list_id", get(get_movie_list))
        .route("/movies/season/:season_id", get(get_season_details))
        .route("/expense/get_tracked", get(get_tracked_expense))
        .route("/user/logout", post(logout))
        .route_layer(middleware::from_fn(guard))
        .route("/hello", get(hello_world))
        .route("/user/create", post(create_users))
        .route("/user/login", post(login))
        .layer(Extension(client))
        .layer(Extension(database))
        .layer(cors)
}
