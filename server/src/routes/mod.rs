mod backup;
mod dictionary;
mod expense_tracker;
mod guard;
mod hello_world;
mod movie_planner;
mod movies_tracker;
mod users;

use axum::routing::{delete, patch, post};
use axum::{http::Method, routing::get, Router};
use axum::{middleware, Extension};
use reqwest::Client;
use sea_orm::DatabaseConnection;
use tower_http::cors::{Any, CorsLayer};

use backup::trigger_backup::trigger_backup;

use expense_tracker::create_new_category::create_new_category;
use expense_tracker::create_new_expense::create_new_expense;
use expense_tracker::delete_expense::delete_expense;
use expense_tracker::get_categories::get_categories;
use expense_tracker::get_last_inserted_timestamp::get_last_inserted_timestamp;
use expense_tracker::get_tracked_expense::get_tracked_expense;
use expense_tracker::update_expense::update_expense;

use dictionary::query_word::query_word;
use dictionary::search_words::search_words;

use movie_planner::get_all_cinemas::get_all_cinemas;
use movie_planner::get_all_shows::get_all_shows;

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

use crate::routes::movie_planner::plan_movies::plan_movies;
use crate::services::r2::R2Store;
use crate::AppState;

#[derive(Clone)]
pub struct SharedData {
    pub message: String,
}

pub fn create_routes(database: DatabaseConnection, r2_store: R2Store, state: AppState) -> Router {
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
        .route("/expense/category/create", post(create_new_category))
        .route("/expense/categories", get(get_categories))
        .route("/expense/create", post(create_new_expense))
        .route("/expense/:id", delete(delete_expense))
        .route("/expense/update_expense", patch(update_expense))
        .route("/dictionary/query_word", get(query_word))
        .route("/dictionary/search_words", get(search_words))
        .route("/movie_planner/get_all_cinemas", get(get_all_cinemas))
        .route("/movie_planner/get_all_shows", get(get_all_shows))
        .route("/movie_planner/plan", post(plan_movies))
        .route(
            "/expense/get_last_inserted_timestamp",
            get(get_last_inserted_timestamp),
        )
        .route("/user/logout", post(logout))
        .route_layer(middleware::from_fn(guard))
        .route("/hello", get(hello_world))
        .route("/user/create", post(create_users))
        .route("/user/login", post(login))
        .layer(Extension(client))
        .layer(Extension(database))
        .layer(cors)
        .with_state(state)
}
