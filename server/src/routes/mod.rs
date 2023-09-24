mod hello_world;
mod read_middleware_custom_header;
mod set_middleware_custom_headers;
mod movies_tracker;
use axum::{
    http::Method,
    middleware,
    routing::get,
    Extension, Router,
};
use reqwest::Client;
use tower_http::cors::{Any, CorsLayer};

use hello_world::hello_world;
use read_middleware_custom_header::read_middleware_custom_header;
use set_middleware_custom_headers::set_middleware_custom_header;
use movies_tracker::search_movies::search_movies;
use movies_tracker::get_movies::get_movies;

#[derive(Clone)]
pub struct SharedData {
    pub message: String,
}

pub fn create_routes() -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    let shared_data = SharedData {
        message: "Hello from shared data".to_owned(),
    };

    let client = Client::new();
    
    Router::new()
        .route(
            "/read_middleware_custom_header",
            get(read_middleware_custom_header),
        )
        .route_layer(middleware::from_fn(set_middleware_custom_header))
        .route("/hello", get(hello_world))
        .route("/movies/get", get(get_movies))
        .route("/movies/search", get(search_movies))
        .layer(cors)
        .layer(Extension(shared_data))
        .with_state(client)
}
