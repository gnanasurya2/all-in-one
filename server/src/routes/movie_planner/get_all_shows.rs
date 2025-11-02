use axum::{extract::Query, http::StatusCode, Extension, Json};
use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{routes::movie_planner::get_all_cinemas::MovieResponse, utils::app_error::AppError};

fn default_city() -> String {
    "Bengaluru".to_owned()
}

#[derive(Deserialize)]
pub struct QueryParams {
    #[serde(default = "default_city")]
    city: String,
    cid: String,
    dated: String,
    lat: String,
    lng: String,
}

#[derive(Serialize)]
pub struct RequestBody {
    city: String,
    lat: String,
    lng: String,
    dated: String,
    cid: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub struct ShowResponse {
    theatreId: String,
    screenId: u32,
    movieId: String,
    pub showTimeStamp: u64,
    pub stopTimeStamp: u64,
    pub endTimeStamp: u64,
    totalSeats: u16,
    availableSeats: u16,
    screenName: String,
    language: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct ExperienceSessionResponse {
    experience: String,
    showCount: u32,
    pub shows: Vec<ShowResponse>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct CinemaMovieSessionsResponse {
    movieRe: MovieResponse,
    showCount: u32,
    experienceSessions: Vec<ExperienceSessionResponse>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct ShowOutputResponse {
    cinemaMovieSessions: Vec<CinemaMovieSessionsResponse>,
}

#[derive(Serialize, Deserialize)]
pub struct GetAllShowsApiResponse {
    msg: String,
    result: String,
    output: ShowOutputResponse,
}

pub async fn get_all_shows(
    Extension(client): Extension<Client>,
    Query(query): Query<QueryParams>,
) -> Result<Json<GetAllShowsApiResponse>, AppError> {
    let mut headers = reqwest::header::HeaderMap::new();

    headers.insert(
        "appversion",
        "1.0"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "authorization",
        "Bearer"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "chain",
        "PVR"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "city",
        query
            .city
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "platform",
        "WEBSITE"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "Content-Type",
        "application/json"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );

    let body: RequestBody = RequestBody {
        city: query.city,
        lat: query.lat,
        lng: query.lng,
        dated: query.dated,
        cid: query.cid,
    };

    let response = client
        .post("https://api3.pvrcinemas.com/api/v1/booking/content/csessions")
        .headers(headers)
        .json(&body)
        .send()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    let body = response
        .json::<GetAllShowsApiResponse>()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    Ok(Json(body))
}
