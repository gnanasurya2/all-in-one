use axum::{
    extract::{Query, State},
    Json,
};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::env;

fn default_year() -> i32 {
    0
}

fn default_page() -> i8 {
    1
}

fn default_content_type() -> String {
    "".to_owned()
}

#[derive(Serialize, Deserialize)]
pub struct QueryParams {
    title: String,
    #[serde(default = "default_page")]
    page: i8,
    #[serde(default = "default_content_type")]
    content_type: String,
    #[serde(default = "default_year")]
    year: i32,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct SearchResult {
    Title: String,
    Year: String,
    imdbID: String,
    Type: String,
    Poster: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct OmdbSearchResponse {
    Search: Vec<SearchResult>,
    totalResults: String,
    Response: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct SearchMoviesReturnResponse {
    Search: Vec<SearchResult>,
    totalResults: String,
    Response: String,
    page: i8,
    hasMoreData: bool,
}

pub async fn search_movies(
    State(client): State<Client>,
    Query(query): Query<QueryParams>,
) -> Result<Json<SearchMoviesReturnResponse>, StatusCode> {
    let api_key = env::var("OMDB_API_KEY").unwrap();
    let mut request_url = format!(
        "https://www.omdbapi.com/?apikey={}&s={}&page={}",
        api_key, query.title, query.page
    );

    if query.year != 0 {
        request_url.push_str(format!("&y={}", query.year).as_str())
    }

    if query.content_type != "" {
        request_url.push_str(format!("&type={}", query.content_type).as_str())
    }

    println!("{}", request_url);
    let response = client
        .get(request_url)
        .send()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let body = response
        .text()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response: OmdbSearchResponse = serde_json::from_str(body.as_str()).unwrap();

    let mut has_more_data = false;
    if (response.totalResults.parse::<isize>().unwrap() / 10) + 1 > (query.page as isize) {
        has_more_data = true;
    }

    let final_response = SearchMoviesReturnResponse {
        Search: response.Search,
        Response: response.Response,
        totalResults: response.totalResults,
        page: query.page,
        hasMoreData: has_more_data,
    };
    Ok(Json(final_response))
}
